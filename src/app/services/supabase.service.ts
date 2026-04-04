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

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  // ── Users ──────────────────────────────────────────────────────────────────

  async createUser(data: { name: string; mobile: string }) {
    return this.supabase.from('users').insert(data).select().single();
  }

  async getUserById(id: string) {
    return this.supabase.from('users').select('*').eq('id', id).single();
  }

  async getUserByMobile(mobile: string) {
    return this.supabase.from('users').select('*').eq('mobile', mobile).maybeSingle();
  }

  async updateUser(id: string, data: { name?: string; mobile?: string }) {
    return this.supabase.from('users').update(data).eq('id', id).select().single();
  }

  // ── Vehicles ───────────────────────────────────────────────────────────────

  async createVehicle(data: { user_id: string; vehicle_number: string; qr_code_url?: string }) {
    return this.supabase.from('vehicles').insert(data).select().single();
  }

  async getVehiclesByUser(userId: string) {
    return this.supabase.from('vehicles').select('*').eq('user_id', userId);
  }

  async getVehicleById(vehicleId: string) {
    return this.supabase.from('vehicles').select('*, users(name, mobile)').eq('id', vehicleId).single();
  }

  async updateVehicle(id: string, data: { vehicle_number?: string }) {
    return this.supabase.from('vehicles').update(data).eq('id', id).select().single();
  }

  // ── Emergency Contacts ─────────────────────────────────────────────────────

  async createEmergencyContacts(contacts: EmergencyContact[]) {
    return this.supabase.from('emergency_contacts').insert(contacts);
  }

  async getEmergencyContacts(vehicleId: string) {
    return this.supabase.from('emergency_contacts').select('*').eq('vehicle_id', vehicleId);
  }

  async deleteEmergencyContacts(vehicleId: string) {
    return this.supabase.from('emergency_contacts').delete().eq('vehicle_id', vehicleId);
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
    return this.supabase.auth.signInWithOtp({ phone });
  }

  async verifyOtp(phone: string, token: string) {
    return this.supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  async getAuthUser(): Promise<SupabaseUser | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user ?? null;
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((_event, session) => {
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
