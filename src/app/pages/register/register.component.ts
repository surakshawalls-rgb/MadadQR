import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { SupabaseService } from '../../services/supabase.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, QRCodeComponent],
  template: `
    <div class="register-page">
      <div class="register-container">

        <!-- Left Panel -->
        <div class="register-info">
          <div class="info-glow"></div>
          <div class="info-brand">🔳 MadadQR</div>
          <h2>Register Your Vehicle</h2>
          <p>Setup once. Protected forever. Ek baar register karo aur apni gadi safe karo.</p>
          <ul class="info-list">
            <li>✓ Free QR code generation</li>
            <li>✓ Emergency contact alerts</li>
            <li>✓ Works on any phone without app</li>
            <li>✓ Setup in under 2 minutes</li>
          </ul>
          <div class="info-note">
            🔒 Your details are only used for emergency communication.
          </div>
        </div>

        <!-- Form Panel -->
        <div class="register-form-panel">
          <div class="form-header">
            <h1>Get Your QR Code</h1>
            <p>Fill in the details below</p>
          </div>

          <!-- Success Card with inline QR (shown after registration) -->
          <div *ngIf="successData" class="success-card">
            <div class="success-card-header">
              <div class="success-icon">✅</div>
              <div>
                <strong>Registration Complete!</strong>
                <p>{{ successData.name }} — {{ successData.vehicleNumber }}</p>
              </div>
            </div>
            <div class="qr-preview">
              <div class="qr-box">
                <qrcode
                  [qrdata]="successData.qrUrl"
                  [width]="160"
                  [errorCorrectionLevel]="'M'"
                  [colorDark]="'#1e1b4b'"
                  [colorLight]="'#ffffff'"
                  [margin]="2">
                </qrcode>
              </div>
              <div class="qr-info">
                <div class="qr-vehicle-num">{{ successData.vehicleNumber }}</div>
                <div class="qr-owner">{{ successData.name }}</div>
                <div class="qr-url-small">{{ successData.qrUrl }}</div>
                <div class="qr-btns">
                  <button (click)="downloadQR()" class="btn-qr-download">📥 Download QR</button>
                  <a [routerLink]="['/qr']" [queryParams]="{vehicleId: successData.vehicleId}" class="btn-qr-view">🔍 Full QR</a>
                </div>
              </div>
            </div>
            <div class="success-actions">
              <button (click)="registerNext()" class="btn-register-next">➕ Register Next Customer</button>
              <a [routerLink]="['/dashboard']" [queryParams]="{userId: successData.userId}" class="btn-goto-dash">📊 View Dashboard →</a>
            </div>
          </div>

          <div *ngIf="errorMsg" class="error-banner">{{ errorMsg }}</div>

          <form (ngSubmit)="onSubmit()" #regForm="ngForm" *ngIf="!successData">
            <!-- Agent Mode Toggle -->
            <div class="form-section agent-section">
              <div class="section-label">Registration Mode</div>
              <label class="agent-check-wrap">
                <input type="checkbox" [(ngModel)]="isAgentMode" name="isAgentMode" class="agent-checkbox" />
                <span class="agent-check-label">🛡️ I'm an Agent (bulk registration)</span>
              </label>
              <div *ngIf="isAgentMode" class="agent-pin-group">
                <div class="form-group" style="margin-top:0.75rem; margin-bottom:0;">
                  <label>Agent PIN <span class="required">*</span></label>
                  <input type="password" [(ngModel)]="agentPinInput" name="agentPinInput"
                    placeholder="Enter agent PIN" class="form-input" autocomplete="off" />
                </div>
                <div *ngIf="agentPinError" class="pin-error-msg">{{ agentPinError }}</div>
                <div *ngIf="pinVerified" class="pin-ok-msg">✓ Agent Mode Active</div>
              </div>
            </div>

            <!-- Owner Info -->
            <div class="form-section">
              <div class="section-label">Owner Information</div>
              <div class="form-group">
                <label>Full Name <span class="required">*</span></label>
                <input type="text" [(ngModel)]="form.name" name="name" required
                  placeholder="e.g. Rahul Sharma" class="form-input" />
              </div>
              <div class="form-group">
                <label>Mobile Number <span class="required">*</span></label>
                <div class="input-prefix">
                  <span class="prefix">+91</span>
                  <input type="tel" [(ngModel)]="form.mobile" name="mobile" required
                    placeholder="9876543210" maxlength="10" pattern="[0-9]{10}"
                    class="form-input prefix-input" />
                </div>
              </div>
            </div>

            <!-- Vehicle Info -->
            <div class="form-section">
              <div class="section-label">Vehicle Information</div>
              <div class="form-group">
                <label>Vehicle Number <span class="required">*</span></label>
                <input type="text" [(ngModel)]="form.vehicleNumber" name="vehicleNumber" required
                  placeholder="e.g. MH 12 AB 1234" class="form-input uppercase"
                  (input)="toUpperCase($event)" />
              </div>
            </div>

            <!-- Emergency Contacts -->
            <div class="form-section">
              <div class="section-label">Emergency Contacts</div>
              <p class="section-hint">Inhe emergency alert bheja jayega</p>
              <div class="emergency-contact" *ngFor="let c of form.emergencyContacts; let i = index">
                <div class="ec-header">Contact {{ i + 1 }}</div>
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
                        placeholder="9876543210" maxlength="10" pattern="[0-9]{10}"
                        class="form-input prefix-input" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading || !regForm.form.valid">
              <span *ngIf="!loading">Generate My QR Code 🔳</span>
              <span *ngIf="loading" class="loading-spinner">Registering…</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .register-page {
      min-height: calc(100vh - 64px);
      background: #0a0a14;
      display: flex;
      align-items: center;
      padding: 2rem 1.5rem;
    }
    .register-container {
      max-width: 920px;
      width: 100%;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 0;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 24px;
      overflow: hidden;
    }
    .register-info {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08));
      border-right: 1px solid rgba(99,102,241,0.15);
      padding: 3rem 2rem;
    }
    .info-glow {
      position: absolute;
      top: -80px; left: -80px;
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
      pointer-events: none;
    }
    .info-brand { color: #a78bfa; font-weight: 800; font-size: 1.1rem; margin-bottom: 1.5rem; }
    .register-info h2 { color: #fff; font-size: 1.6rem; font-weight: 800; line-height: 1.3; margin-bottom: 0.75rem; }
    .register-info p { color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .info-list { list-style: none; padding: 0; margin: 0 0 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; }
    .info-list li { color: #cbd5e1; font-size: 0.88rem; display: flex; align-items: center; gap: 0.6rem; }
    .info-note {
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.2);
      color: #94a3b8;
      border-radius: 10px;
      padding: 0.75rem 1rem;
      font-size: 0.82rem;
      line-height: 1.5;
    }
    .register-form-panel { padding: 3rem 2.5rem; }
    .form-header { margin-bottom: 2rem; }
    .form-header h1 { color: #fff; font-size: 1.6rem; font-weight: 800; margin-bottom: 0.25rem; }
    .form-header p { color: #64748b; font-size: 0.9rem; }
    .form-section { margin-bottom: 1.75rem; }
    .section-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.75rem;
      padding-bottom: 0.4rem;
      border-bottom: 1px solid rgba(99,102,241,0.15);
    }
    .section-hint { color: #64748b; font-size: 0.8rem; margin: -0.4rem 0 0.75rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; color: #94a3b8; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; }
    .required { color: #f87171; }
    .form-input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 0.95rem;
      padding: 0.7rem 0.9rem;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .form-input:focus { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.06); }
    .form-input::placeholder { color: #334155; }
    .uppercase { text-transform: uppercase; }
    .input-prefix { display: flex; align-items: center; }
    .prefix {
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      border-right: none;
      color: #a78bfa;
      padding: 0.7rem 0.75rem;
      border-radius: 10px 0 0 10px;
      font-size: 0.9rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .prefix-input { border-radius: 0 10px 10px 0 !important; flex: 1; }
    .emergency-contact {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.1);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 0.75rem;
    }
    .ec-header { color: #6366f1; font-size: 0.78rem; font-weight: 700; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; }
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
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.5); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .success-card {
      background: rgba(34,197,94,0.07);
      border: 1px solid rgba(34,197,94,0.3);
      border-radius: 14px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .success-card-header { display: flex; align-items: flex-start; gap: 0.85rem; margin-bottom: 1rem; }
    .success-icon { font-size: 1.5rem; flex-shrink: 0; }
    .success-card-header strong { color: #4ade80; display: block; margin-bottom: 0.2rem; font-size: 1rem; }
    .success-card-header p { color: #94a3b8; font-size: 0.85rem; margin: 0; }
    .qr-preview { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem; background: rgba(255,255,255,0.03); border-radius: 10px; padding: 0.75rem; }
    .qr-box { background: #fff; border-radius: 8px; padding: 0.4rem; flex-shrink: 0; }
    .qr-info { flex: 1; min-width: 0; }
    .qr-vehicle-num { font-family: monospace; font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 0.15rem; }
    .qr-owner { color: #94a3b8; font-size: 0.82rem; margin-bottom: 0.25rem; }
    .qr-url-small { color: #475569; font-size: 0.68rem; font-family: monospace; word-break: break-all; margin-bottom: 0.6rem; }
    .qr-btns { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .btn-qr-download {
      background: linear-gradient(135deg, #059669, #10b981);
      color: #fff; border: none; border-radius: 8px;
      padding: 0.45rem 0.85rem; font-size: 0.8rem; font-weight: 700; cursor: pointer;
    }
    .btn-qr-view {
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.3);
      color: #a78bfa; border-radius: 8px;
      padding: 0.45rem 0.85rem; font-size: 0.8rem; font-weight: 600; text-decoration: none;
    }
    .success-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .btn-register-next {
      flex: 1; background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; border: none; border-radius: 10px;
      padding: 0.7rem 1rem; font-size: 0.9rem; font-weight: 700; cursor: pointer;
    }
    .btn-goto-dash {
      flex: 1; background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1); color: #94a3b8;
      border-radius: 10px; padding: 0.7rem 1rem;
      font-size: 0.9rem; font-weight: 600; text-decoration: none; text-align: center;
    }
    .error-banner {
      background: rgba(248,113,113,0.1);
      border: 1px solid rgba(248,113,113,0.3);
      border-radius: 12px;
      color: #f87171;
      padding: 0.9rem 1.1rem;
      font-size: 0.88rem;
      margin-bottom: 1.5rem;
    }
    .agent-section { border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 0.9rem 1rem 1rem; background: rgba(99,102,241,0.03); }
    .agent-check-wrap { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }
    .agent-checkbox { width: 16px; height: 16px; accent-color: #6366f1; cursor: pointer; flex-shrink: 0; }
    .agent-check-label { color: #cbd5e1; font-size: 0.88rem; font-weight: 500; }
    .agent-pin-group {}
    .pin-error-msg { color: #f87171; font-size: 0.78rem; margin-top: 0.4rem; }
    .pin-ok-msg { color: #4ade80; font-size: 0.78rem; margin-top: 0.4rem; font-weight: 600; }
    @media (max-width: 768px) {
      .register-container { grid-template-columns: 1fr; }
      .register-info { display: none; }
      .register-form-panel { padding: 2rem 1.5rem; }
      .ec-fields { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
  form = {
    name: '',
    mobile: '',
    vehicleNumber: '',
    emergencyContacts: [
      { name: '', mobile: '' },
      { name: '', mobile: '' }
    ]
  };
  loading = false;
  errorMsg = '';
  successData: { userId: string; vehicleId: string; name: string; vehicleNumber: string; qrUrl: string } | null = null;

  // Agent mode
  isAgentMode = false;
  agentPinInput = '';
  agentPinError = '';
  pinVerified = false;

  private readonly BASE_URL = 'https://madad-qr.vercel.app';

  constructor(private supa: SupabaseService, private router: Router, private cdr: ChangeDetectorRef) {}

  toUpperCase(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.form.vehicleNumber = input.value;
  }

  downloadQR() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `MadadQR-${this.successData?.vehicleNumber || 'QR'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  registerNext() {
    this.successData = null;
    this.errorMsg = '';
    this.form = {
      name: '',
      mobile: '',
      vehicleNumber: '',
      emergencyContacts: [{ name: '', mobile: '' }, { name: '', mobile: '' }]
    };
    // Keep agent mode & verified PIN for the next customer
    this.cdr.detectChanges();
  }

  async onSubmit() {
    // Validate agent PIN before making any API calls
    if (this.isAgentMode) {
      if (!this.agentPinInput.trim()) {
        this.agentPinError = 'Please enter the Agent PIN.';
        return;
      }
      if (this.agentPinInput.trim() !== environment.agentPin) {
        this.agentPinError = 'Incorrect Agent PIN. Please check and try again.';
        this.pinVerified = false;
        this.cdr.detectChanges();
        return;
      }
      this.pinVerified = true;
      this.agentPinError = '';
    }
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();
    console.log('[Register] Submit started', this.form);
    try {
      // Create user
      console.log('[Register] Creating user...');
      const { data: user, error: userErr } = await this.supa.createUser({
        name: this.form.name.trim(),
        mobile: this.form.mobile.trim()
      });
      console.log('[Register] User create result:', { user, userErr });
      if (userErr) throw new Error(userErr.message);
      if (!user || !user.id) throw new Error('User creation failed, no user ID returned');

      // Create vehicle
      console.log('[Register] Creating vehicle...');
      const { data: vehicle, error: vErr } = await this.supa.createVehicle({
        user_id: user.id,
        vehicle_number: this.form.vehicleNumber.trim().toUpperCase()
      });
      console.log('[Register] Vehicle create result:', { vehicle, vErr });
      if (vErr) throw new Error(vErr.message);
      if (!vehicle || !vehicle.id) throw new Error('Vehicle creation failed, no vehicle ID returned');

      // Save emergency contacts
      const validContacts = this.form.emergencyContacts.filter(c => c.mobile?.trim());
      if (validContacts.length > 0) {
        console.log('[Register] Saving emergency contacts:', validContacts);
        await this.supa.upsertEmergencyContacts(vehicle.id, validContacts);
        console.log('[Register] Emergency contacts saved');
      }

      // Store session info using multi-session tracking
      const qrUrl = `${this.BASE_URL}/v/${vehicle.id}`;
      this.supa.addRegistrationSession({
        userId: user.id,
        vehicleId: vehicle.id,
        name: this.form.name.trim(),
        vehicleNumber: this.form.vehicleNumber.trim().toUpperCase()
      });

      // Store role so dashboard knows if this is an agent session
      localStorage.setItem('mq_role', this.isAgentMode ? 'agent' : 'customer');

      this.successData = {
        userId: user.id,
        vehicleId: vehicle.id,
        name: this.form.name.trim(),
        vehicleNumber: this.form.vehicleNumber.trim().toUpperCase(),
        qrUrl
      };
      this.cdr.detectChanges();
      console.log('[Register] Registration successful', this.successData);
    } catch (err: any) {
      console.error('[Register] Registration error:', err);
      this.errorMsg = err.message || 'Something went wrong. Please try again.';
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
      console.log('[Register] Submit finished, loading:', this.loading);
    }
  }
}
