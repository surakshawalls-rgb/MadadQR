import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="edit-page">
      <div class="edit-container">

        <div class="edit-header">
          <a [routerLink]="['/dashboard']" class="btn-back">← Back to Dashboard</a>
          <h1>Update Your Details</h1>
          <p>Changes apply to your QR scan page immediately</p>
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading your details…</p>
        </div>

        <div *ngIf="successMsg" class="success-banner">
          ✅ {{ successMsg }}
        </div>

        <div *ngIf="errorMsg" class="error-banner">
          ❌ {{ errorMsg }}
        </div>

        <form *ngIf="!loading" (ngSubmit)="onSubmit()" #editForm="ngForm">

          <!-- Owner Info -->
          <div class="form-section">
            <div class="section-label">Owner Information</div>
            <div class="form-group">
              <label>Full Name <span class="req">*</span></label>
              <input type="text" [(ngModel)]="form.name" name="name" required
                placeholder="e.g. Rahul Sharma" class="form-input" />
            </div>
            <div class="form-group">
              <label>Mobile Number <span class="req">*</span></label>
              <div class="input-prefix">
                <span class="prefix">+91</span>
                <input type="tel" [(ngModel)]="form.mobile" name="mobile" required
                  placeholder="9876543210" maxlength="10" class="form-input prefix-input" />
              </div>
            </div>
          </div>

          <!-- Vehicle Info -->
          <div class="form-section">
            <div class="section-label">Vehicle Information</div>
            <div class="form-group">
              <label>Vehicle Number <span class="req">*</span></label>
              <input type="text" [(ngModel)]="form.vehicleNumber" name="vehicleNumber" required
                placeholder="e.g. MH 12 AB 1234" class="form-input uppercase"
                (input)="toUpperCase($event)" />
            </div>
          </div>

          <!-- Emergency Contacts -->
          <div class="form-section">
            <div class="section-label">Emergency Contacts</div>
            <div class="ec-row" *ngFor="let c of form.emergencyContacts; let i = index">
              <div class="ec-label">Contact {{ i + 1 }}</div>
              <div class="ec-fields">
                <div class="form-group">
                  <label>Name</label>
                  <input type="text" [(ngModel)]="c.name" [name]="'ecName' + i"
                    placeholder="e.g. Priya (Wife)" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Mobile</label>
                  <div class="input-prefix">
                    <span class="prefix">+91</span>
                    <input type="tel" [(ngModel)]="c.mobile" [name]="'ecMobile' + i"
                      placeholder="9876543210" maxlength="10" class="form-input prefix-input" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" class="btn-submit" [disabled]="saving || !editForm.form.valid">
            <span *ngIf="!saving">💾 Save Changes</span>
            <span *ngIf="saving">Saving…</span>
          </button>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .edit-page { background: #0a0a14; min-height: calc(100vh - 64px); padding: 2.5rem 1.5rem; }
    .edit-container { max-width: 600px; margin: 0 auto; }
    .edit-header { margin-bottom: 2rem; }
    .btn-back { color: #6366f1; text-decoration: none; font-size: 0.88rem; font-weight: 600; display: inline-block; margin-bottom: 1.25rem; }
    .edit-header h1 { color: #fff; font-size: 1.8rem; font-weight: 800; margin-bottom: 0.25rem; }
    .edit-header p { color: #64748b; font-size: 0.9rem; }
    .loading-state { text-align: center; padding: 3rem 0; }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid rgba(99,102,241,0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-state p { color: #64748b; }
    .success-banner {
      background: rgba(34,197,94,0.1);
      border: 1px solid rgba(34,197,94,0.3);
      color: #4ade80;
      border-radius: 10px;
      padding: 0.85rem 1rem;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    .error-banner {
      background: rgba(248,113,113,0.1);
      border: 1px solid rgba(248,113,113,0.3);
      color: #f87171;
      border-radius: 10px;
      padding: 0.85rem 1rem;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    .form-section {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.12);
      border-radius: 14px;
      padding: 1.5rem;
      margin-bottom: 1.25rem;
    }
    .section-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 1rem;
    }
    .form-group { margin-bottom: 0.9rem; }
    .form-group:last-child { margin-bottom: 0; }
    .form-group label { display: block; color: #94a3b8; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem; }
    .req { color: #f87171; }
    .form-input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 0.95rem;
      padding: 0.65rem 0.85rem;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .form-input:focus { border-color: rgba(99,102,241,0.6); }
    .form-input::placeholder { color: #334155; }
    .uppercase { text-transform: uppercase; }
    .input-prefix { display: flex; }
    .prefix {
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      border-right: none;
      color: #a78bfa;
      padding: 0.65rem 0.65rem;
      border-radius: 10px 0 0 10px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .prefix-input { border-radius: 0 10px 10px 0 !important; flex: 1; }
    .ec-row { margin-bottom: 1rem; }
    .ec-label { color: #6366f1; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.5rem; }
    .ec-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .btn-submit {
      width: 100%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 0.9rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s;
      box-shadow: 0 4px 20px rgba(99,102,241,0.35);
      margin-top: 0.5rem;
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    @media (max-width: 480px) { .ec-fields { grid-template-columns: 1fr; } }
  `]
})
export class EditProfileComponent implements OnInit {
  form = {
    name: '',
    mobile: '',
    vehicleNumber: '',
    emergencyContacts: [{ name: '', mobile: '' }, { name: '', mobile: '' }]
  };
  vehicleId = '';
  userId = '';
  loading = true;
  saving = false;
  successMsg = '';
  errorMsg = '';

  constructor(private supa: SupabaseService, private route: ActivatedRoute) {}

  async ngOnInit() {
    this.vehicleId = this.route.snapshot.queryParamMap.get('vehicleId') || localStorage.getItem('mq_vehicleId') || '';
    if (!this.vehicleId) { this.loading = false; return; }
    try {
      const { data: vehicle } = await this.supa.getVehicleById(this.vehicleId);
      if (vehicle) {
        this.userId = vehicle.user_id;
        this.form.vehicleNumber = vehicle.vehicle_number;
        const u = (vehicle as any).users;
        if (u) { this.form.name = u.name; this.form.mobile = u.mobile; }
        const { data: contacts } = await this.supa.getEmergencyContacts(this.vehicleId);
        if (contacts && contacts.length > 0) {
          this.form.emergencyContacts = contacts.map((c: any) => ({ name: c.name || '', mobile: c.mobile || '' }));
          while (this.form.emergencyContacts.length < 2) this.form.emergencyContacts.push({ name: '', mobile: '' });
        }
      }
    } finally { this.loading = false; }
  }

  toUpperCase(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.form.vehicleNumber = input.value;
  }

  async onSubmit() {
    this.saving = true;
    this.successMsg = '';
    this.errorMsg = '';
    try {
      await this.supa.updateUser(this.userId, { name: this.form.name.trim(), mobile: this.form.mobile.trim() });
      await this.supa.updateVehicle(this.vehicleId, { vehicle_number: this.form.vehicleNumber.trim().toUpperCase() });
      await this.supa.upsertEmergencyContacts(this.vehicleId, this.form.emergencyContacts);
      this.successMsg = 'Details updated successfully!';
    } catch (err: any) {
      this.errorMsg = err.message || 'Update failed. Please try again.';
    } finally { this.saving = false; }
  }
}
