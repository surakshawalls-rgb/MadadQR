import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface User {
  id?: string;
  name: string;
  mobile: string;
  created_at?: string;
}

export interface Vehicle {
  id?: string;
  user_id: string;
  vehicle_number: string;
  qr_code_url?: string;
  created_at?: string;
}

export interface EmergencyContact {
  id?: string;
  vehicle_id: string;
  name?: string;
  mobile?: string;
}

/**
 * Branding record for Business/School co-branded QR stickers.
 * Logo is stored in Supabase Storage bucket 'logos'.
 * Naming convention: logos/org-{slug}-{timestamp}.{ext}
 * Only logo_path (filename) is stored in DB to save space.
 */
export interface Branding {
  id?: string;
  user_id: string;
  organization_name: string;
  branding_type?: string;    // School | Business | Fleet | Other
  logo_path?: string;        // e.g. 'org-abc-school-1712345678.png'
  logo_url?: string;         // full public URL from Supabase Storage
  tagline?: string;
  ad_text?: string;
  created_at?: string;
}

type LocalDbState = {
  users: User[];
  vehicles: Array<Vehicle & { user_type?: string; branding_id?: string }>;
  emergencyContacts: EmergencyContact[];
  branding: Branding[];
};

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase?: SupabaseClient;

  private get client() {
    if (!this.supabase) {
      this.supabase = createClient(
        environment.supabase.url,
        environment.supabase.anonKey
      );
    }
    return this.supabase;
  }

  private get isBrowser() {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private get emptyLocalDb(): LocalDbState {
    return { users: [], vehicles: [], emergencyContacts: [], branding: [] };
  }

  private readLocalDb(): LocalDbState {
    if (!this.isBrowser) return this.emptyLocalDb;
    try {
      return JSON.parse(localStorage.getItem('mq_local_db') || '') as LocalDbState;
    } catch {
      return this.emptyLocalDb;
    }
  }

  private writeLocalDb(db: LocalDbState) {
    if (!this.isBrowser) return;
    localStorage.setItem('mq_local_db', JSON.stringify(db));
  }

  private makeId() {
    return globalThis.crypto?.randomUUID?.() || `mq_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  private localUsers() {
    return this.readLocalDb().users;
  }

  private localVehicles() {
    return this.readLocalDb().vehicles;
  }

  private localContacts() {
    return this.readLocalDb().emergencyContacts;
  }

  private localBranding() {
    return this.readLocalDb().branding;
  }

  // ── Users ──────────────────────────────────────────────────────────────────

  async createUser(data: { name: string; mobile: string }) {
    try {
      const result = await this.client.from('users').insert(data).select().single();
      if (!result.error && result.data) return result;
    } catch {}

    const db = this.readLocalDb();
    const existing = db.users.find(u => u.mobile === data.mobile);
    const user = existing ?? { id: this.makeId(), name: data.name, mobile: data.mobile };
    if (!existing) db.users.push(user);
    else Object.assign(existing, data);
    this.writeLocalDb(db);
    return { data: user, error: null };
  }

  async getUserById(id: string) {
    try {
      const result = await this.client.from('users').select('*').eq('id', id).single();
      if (!result.error) return result;
    } catch {}

    const user = this.localUsers().find(u => u.id === id) || null;
    return { data: user, error: null };
  }

  async getUserByMobile(mobile: string) {
    try {
      const result = await this.client.from('users').select('*').eq('mobile', mobile).maybeSingle();
      if (!result.error || result.data) return result;
    } catch {}

    const user = this.localUsers().find(u => u.mobile === mobile) || null;
    return { data: user, error: null };
  }

  async updateUser(id: string, data: { name?: string; mobile?: string }) {
    try {
      const result = await this.client.from('users').update(data).eq('id', id).select().single();
      if (!result.error && result.data) return result;
    } catch {}

    const db = this.readLocalDb();
    const user = db.users.find(u => u.id === id);
    if (!user) return { data: null, error: null };
    Object.assign(user, data);
    this.writeLocalDb(db);
    return { data: user, error: null };
  }

  // ── Vehicles ───────────────────────────────────────────────────────────────

  async createVehicle(data: { user_id: string; vehicle_number: string; qr_code_url?: string; user_type?: string; branding_id?: string }) {
    try {
      const result = await this.client.from('vehicles').insert(data).select().single();
      if (!result.error && result.data) return result;
    } catch {}

    const db = this.readLocalDb();
    const vehicle = { id: this.makeId(), created_at: new Date().toISOString(), ...data };
    db.vehicles.push(vehicle);
    this.writeLocalDb(db);
    return { data: vehicle, error: null };
  }

  async getVehiclesByUser(userId: string) {
    try {
      const result = await this.client.from('vehicles').select('*').eq('user_id', userId);
      if (!result.error) return result;
    } catch {}

    return { data: this.localVehicles().filter(v => v.user_id === userId), error: null };
  }

  async getVehicleById(vehicleId: string) {
    try {
      const result = await this.client.from('vehicles').select('*, users(name, mobile)').eq('id', vehicleId).single();
      if (!result.error && result.data) return result;
    } catch {}

    const db = this.readLocalDb();
    const vehicle = db.vehicles.find(v => v.id === vehicleId) || null;
    if (!vehicle) return { data: null, error: null };
    const user = db.users.find(u => u.id === vehicle.user_id) || null;
    return { data: { ...vehicle, users: user }, error: null };
  }

  async updateVehicle(id: string, data: { vehicle_number?: string }) {
    try {
      const result = await this.client.from('vehicles').update(data).eq('id', id).select().single();
      if (!result.error && result.data) return result;
    } catch {}

    const db = this.readLocalDb();
    const vehicle = db.vehicles.find(v => v.id === id);
    if (!vehicle) return { data: null, error: null };
    Object.assign(vehicle, data);
    this.writeLocalDb(db);
    return { data: vehicle, error: null };
  }

  // Delete a vehicle by ID
  async deleteVehicle(vehicleId: string) {
    try {
      const result = await this.client.from('vehicles').delete().eq('id', vehicleId);
      if (!result.error) return result;
    } catch {}

    const db = this.readLocalDb();
    db.vehicles = db.vehicles.filter(v => v.id !== vehicleId);
    db.emergencyContacts = db.emergencyContacts.filter(c => c.vehicle_id !== vehicleId);
    this.writeLocalDb(db);
    return { data: null, error: null };
  }

  async getAllVehiclesWithOwners() {
    try {
      const result = await this.client
        .from('vehicles')
        .select('id, user_id, vehicle_number, created_at, users(id, name, mobile, created_at)')
        .order('created_at', { ascending: false });
      if (!result.error) return result;
    } catch {}

    const db = this.readLocalDb();
    const data = db.vehicles
      .slice()
      .reverse()
      .map(v => ({ ...v, users: db.users.find(u => u.id === v.user_id) || null }));
    return { data, error: null };
  }

  // ── Emergency Contacts ─────────────────────────────────────────────────────

  async createEmergencyContacts(contacts: EmergencyContact[]) {
    try {
      const result = await this.client.from('emergency_contacts').insert(contacts);
      if (!result.error) return result;
    } catch {}

    const db = this.readLocalDb();
    contacts.forEach(contact => {
      db.emergencyContacts.push({ id: this.makeId(), ...contact });
    });
    this.writeLocalDb(db);
    return { data: contacts, error: null };
  }

  async getEmergencyContacts(vehicleId: string) {
    try {
      const result = await this.client.from('emergency_contacts').select('*').eq('vehicle_id', vehicleId);
      if (!result.error) return result;
    } catch {}

    return { data: this.localContacts().filter(c => c.vehicle_id === vehicleId), error: null };
  }

  async deleteEmergencyContacts(vehicleId: string) {
    try {
      const result = await this.client.from('emergency_contacts').delete().eq('vehicle_id', vehicleId);
      if (!result.error) return result;
    } catch {}

    const db = this.readLocalDb();
    db.emergencyContacts = db.emergencyContacts.filter(c => c.vehicle_id !== vehicleId);
    this.writeLocalDb(db);
    return { data: null, error: null };
  }

  // ── Branding ───────────────────────────────────────────────────────────────
  // Logo storage: Supabase Storage bucket 'logos' (public, ~1 GB free)
  // Naming convention: org-{slug}-{timestamp}.{ext}
  // Only the filename is stored in the DB (saves space).

  async uploadLogo(file: File, orgName: string): Promise<{ path: string; url: string; error: any }> {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
    const filename = `org-${slug}-${Date.now()}.${ext}`;
    const { error } = await this.client.storage
      .from('logos')
      .upload(filename, file, { upsert: false, contentType: file.type });
    if (error) return { path: '', url: '', error };
    const { data: urlData } = this.client.storage.from('logos').getPublicUrl(filename);
    return { path: filename, url: urlData.publicUrl, error: null };
  }

  async createBranding(data: Omit<Branding, 'id' | 'created_at'>) {
    try {
      const result = await this.client.from('branding').insert(data).select().single();
      if (!result.error && result.data) return result;
    } catch {}

    const db = this.readLocalDb();
    const branding = { id: this.makeId(), ...data };
    db.branding.push(branding);
    this.writeLocalDb(db);
    return { data: branding, error: null };
  }

  async getBrandingById(id: string) {
    try {
      const result = await this.client.from('branding').select('*').eq('id', id).single();
      if (!result.error && result.data) return result;
    } catch {}

    const branding = this.localBranding().find(b => b.id === id) || null;
    return { data: branding, error: null };
  }

  async getBrandingByUser(userId: string) {
    try {
      const result = await this.client.from('branding').select('*').eq('user_id', userId).maybeSingle();
      if (!result.error || result.data) return result;
    } catch {}

    const branding = this.localBranding().find(b => b.user_id === userId) || null;
    return { data: branding, error: null };
  }

  async upsertEmergencyContacts(vehicleId: string, contacts: { name: string; mobile: string }[]) {
    await this.deleteEmergencyContacts(vehicleId);
    const rows = contacts
      .filter(c => c.mobile?.trim())
      .map(c => ({ vehicle_id: vehicleId, name: c.name, mobile: c.mobile }));
    if (rows.length === 0) return { data: [], error: null };
    return this.createEmergencyContacts(rows);
  }

  // ── Auth (Phone OTP) ───────────────────────────────────────────────────────

  async sendOtp(phone: string) {
    // phone should be in E.164 format e.g. +919876543210
    return this.client.auth.signInWithOtp({ phone });
  }

  async verifyOtp(phone: string, token: string) {
    return this.client.auth.verifyOtp({ phone, token, type: 'sms' });
  }

  async getSession(): Promise<Session | null> {
    try {
      const { data } = await this.client.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  }

  async getAuthUser(): Promise<SupabaseUser | null> {
    try {
      const { data } = await this.client.auth.getUser();
      return data.user ?? null;
    } catch {
      return null;
    }
  }

  async signOut() {
    return this.client.auth.signOut();
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    return this.client.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }

  // ── Session Helpers ────────────────────────────────────────────────────────

  /** Store a registration entry (supports agent multi-registration) */
  addRegistrationSession(entry: { userId: string; vehicleId: string; name: string; vehicleNumber: string }) {
    const existing: any[] = JSON.parse(localStorage.getItem('mq_sessions') || '[]');
    // Avoid duplicates
    const idx = existing.findIndex(e => e.vehicleId === entry.vehicleId);
    if (idx === -1) existing.push(entry);
    else existing[idx] = entry;
    localStorage.setItem('mq_sessions', JSON.stringify(existing));
    // Also keep latest for backward compat
    localStorage.setItem('mq_userId', entry.userId);
    localStorage.setItem('mq_vehicleId', entry.vehicleId);
  }

  getRegistrationSessions(): { userId: string; vehicleId: string; name: string; vehicleNumber: string }[] {
    return JSON.parse(localStorage.getItem('mq_sessions') || '[]');
  }

  clearRegistrationSessions() {
    localStorage.removeItem('mq_sessions');
    localStorage.removeItem('mq_userId');
    localStorage.removeItem('mq_vehicleId');
  }
}
