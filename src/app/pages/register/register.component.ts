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
          <p>Set it up once and keep your vehicle contact-ready.</p>
          <ul class="info-list">
            <li>✓ Free QR code generation</li>
            <li>✓ Emergency contact alerts</li>
            <li>✓ Works on any phone without app</li>
            <li>✓ Setup in under 2 minutes</li>
          </ul>
          <div class="info-note">
            🔒 Your details are used only for emergency communication.
          </div>
        </div>

        <!-- Form Panel -->
        <div class="register-form-panel">
          <div class="form-header">
            <h1>Get Your QR Code</h1>
            <p>Enter the vehicle and contact details below</p>
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
              <button (click)="registerNext()" class="btn-register-next">➕ Register Another Vehicle</button>
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
                <span class="agent-check-label">🛡️ Agent mode (bulk registration)</span>
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

            <!-- User Type Selection -->
            <div class="form-section type-section">
              <div class="section-label">Registration Type</div>
              <div class="type-picker">
                <label class="type-option" [class.type-active]="userType==='individual'">
                  <input type="radio" name="userType" [(ngModel)]="userType" value="individual" />
                  <span class="type-icon">👤</span>
                  <div>
                    <div class="type-label">Individual</div>
                    <div class="type-desc">Personal vehicle</div>
                  </div>
                </label>
                <label class="type-option" [class.type-active]="userType==='branding'">
                  <input type="radio" name="userType" [(ngModel)]="userType" value="branding" />
                  <span class="type-icon">🏢</span>
                  <div>
                    <div class="type-label">Business or School</div>
                    <div class="type-desc">Branded QR sticker</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Branding Details -->
            <div *ngIf="userType === 'branding'" class="form-section branding-section">
              <div class="section-label">🏢 Organization Branding</div>
              <div class="form-group">
                <label>Organization Name <span class="required">*</span></label>
                <input type="text" [(ngModel)]="form.organizationName" name="organizationName"
                  [required]="userType === 'branding'" class="form-input"
                  placeholder="e.g. ABC School / XYZ Logistics" />
              </div>
              <div class="form-group">
                <label>Organization Type</label>
                <select [(ngModel)]="form.brandingType" name="brandingType" class="form-input">
                  <option value="">Select type</option>
                  <option value="School">School</option>
                  <option value="Business">Business</option>
                  <option value="Fleet">Fleet</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Logo <span class="optional-tag">optional</span></label>
                <input type="file" (change)="onLogoSelected($event)" accept="image/*" class="form-input file-input" />
                <div *ngIf="form.logoPreviewUrl" class="logo-preview">
                  <img [src]="form.logoPreviewUrl" alt="Logo preview" />
                </div>
              </div>
              <div class="form-group">
                <label>Tagline <span class="optional-tag">optional</span></label>
                <input type="text" [(ngModel)]="form.tagline" name="tagline" class="form-input"
                  placeholder="e.g. Safety First" maxlength="60" />
              </div>
              <div class="form-group">
                <label>Ad Text <span class="optional-tag">optional</span></label>
                <input type="text" [(ngModel)]="form.adText" name="adText" class="form-input"
                  placeholder="e.g. Reliable Transport Partner" maxlength="80" />
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
              <div *ngIf="userType === 'individual'" class="form-group">
                <label>Vehicle Number <span class="required">*</span></label>
                <input type="text" [(ngModel)]="form.vehicleNumber" name="vehicleNumber"
                  [required]="userType === 'individual'"
                  placeholder="e.g. MH 12 AB 1234" class="form-input uppercase"
                  (input)="toUpperCase($event)" />
              </div>
              <div *ngIf="userType === 'branding'" class="form-group">
                <label>Vehicle Numbers <span class="required">*</span> <span class="optional-tag">comma separated</span></label>
                <textarea [(ngModel)]="form.vehicleNumbers" name="vehicleNumbers"
                  [required]="userType === 'branding'" class="form-input"
                  placeholder="e.g. MH12AB1234, MH12CD5678, GJ01XY9999" rows="3"></textarea>
                <p class="section-hint">Enter each vehicle number separated by a comma</p>
              </div>
            </div>

            <!-- Emergency Contacts -->
            <div class="form-section">
              <div class="section-label">Emergency Contacts</div>
              <p class="section-hint">These contacts will receive emergency alerts</p>
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

            <!-- Consent & Terms -->
            <div class="form-section consent-section">
              <label class="consent-label">
                <input type="checkbox" [(ngModel)]="consentGiven" name="consentGiven" required />
                <span>I agree to the <a href="#" (click)="$event.preventDefault(); showConsent = !showConsent" style="color:#6366f1;text-decoration:underline;">Terms and Conditions</a></span>
              </label>
              <div *ngIf="showConsent" class="consent-messages">
                <ul>
                  <li>By registering, you agree that your details will be used only for emergency communication.</li>
                  <li>Your personal information (name and mobile number) will not be shared publicly or sold to third parties.</li>
                  <li>MadadQR is a facilitation tool for emergency situations.</li>
                  <li>MadadQR is not responsible for any misuse of the platform by users or third parties.</li>
                  <li>Use the service only for genuine emergency purposes.</li>
                  <li>Misuse of this service may be tracked and reported.</li>
                </ul>
                <div class="consent-basic-rule"><strong>Basic Rule:</strong> Use responsibly and protect user data.</div>
              </div>
            </div>
            <button type="submit" class="btn-submit" [disabled]="loading || !regForm.form.valid || !consentGiven">
              <span *ngIf="!loading">{{ userType === 'branding' ? '🏢 Register with Branding 🔳' : 'Generate My QR Code 🔳' }}</span>
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
    .type-section { }
    .type-picker { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .type-option {
      display: flex; align-items: center; gap: 0.75rem;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; padding: 0.9rem 1rem; cursor: pointer;
      transition: all 0.2s;
    }
    .type-option input[type="radio"] { display: none; }
    .type-option:hover { border-color: rgba(99,102,241,0.4); }
    .type-option.type-active {
      border-color: #6366f1; background: rgba(99,102,241,0.1);
      box-shadow: 0 0 0 1px rgba(99,102,241,0.3);
    }
    .type-icon { font-size: 1.5rem; flex-shrink: 0; }
    .type-label { color: #e2e8f0; font-size: 0.88rem; font-weight: 700; }
    .type-desc { color: #64748b; font-size: 0.75rem; margin-top: 0.1rem; }
    .branding-section {
      background: rgba(99,102,241,0.04);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 14px; padding: 1.25rem 1.25rem 0.5rem;
    }
    .optional-tag {
      background: rgba(99,102,241,0.12); color: #a78bfa;
      font-size: 0.7rem; font-weight: 600; border-radius: 6px;
      padding: 0.15rem 0.45rem; margin-left: 0.35rem;
    }
    .file-input { padding: 0.5rem 0.9rem; cursor: pointer; }
    .logo-preview { margin-top: 0.75rem; background: #fff; display: inline-block; border-radius: 8px; padding: 0.4rem; }
    .logo-preview img { max-width: 140px; max-height: 70px; display: block; object-fit: contain; }
    .consent-section { margin-top: 0.5rem; }
    .consent-label { display: flex; align-items: flex-start; gap: 0.6rem; cursor: pointer; color: #94a3b8; font-size: 0.85rem; }
    .consent-label input { margin-top: 2px; accent-color: #6366f1; flex-shrink: 0; }
    .consent-messages {
      margin-top: 0.75rem; background: rgba(99,102,241,0.06);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 10px; padding: 0.9rem 1rem;
    }
    .consent-messages ul { margin: 0 0 0.6rem; padding-left: 1.2rem; }
    .consent-messages li { color: #94a3b8; font-size: 0.8rem; line-height: 1.7; }
    .consent-basic-rule { color: #a78bfa; font-size: 0.78rem; }
    form textarea.form-input { resize: vertical; min-height: 72px; }
    @media (max-width: 768px) {
      .register-container { grid-template-columns: 1fr; }
      .register-info { display: none; }
      .register-form-panel { padding: 2rem 1.5rem; }
      .ec-fields { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
  consentGiven = false;
  showConsent = false;
  userType: 'individual' | 'branding' = 'individual';

  form = {
    name: '',
    mobile: '',
    vehicleNumber: '',
    emergencyContacts: [
      { name: '', mobile: '' },
      { name: '', mobile: '' }
    ],
    organizationName: '',
    logoFile: null as File | null,
    logoPreviewUrl: '',
    tagline: '',
    adText: '',
    brandingType: '',
    vehicleNumbers: ''
  };

  loading = false;
  errorMsg = '';
  successData: {
    userId: string; vehicleId: string; name: string;
    vehicleNumber: string; qrUrl: string; orgName?: string;
  } | null = null;

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

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.form.logoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.form.logoPreviewUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(input.files[0]);
    }
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
      name: '', mobile: '', vehicleNumber: '',
      emergencyContacts: [{ name: '', mobile: '' }, { name: '', mobile: '' }],
      organizationName: '', logoFile: null, logoPreviewUrl: '',
      tagline: '', adText: '', brandingType: '', vehicleNumbers: ''
    };
    this.cdr.detectChanges();
  }

  async onSubmit() {
    if (!this.consentGiven) {
      this.errorMsg = 'Please agree to the Terms and Conditions to register.';
      return;
    }
    if (this.isAgentMode) {
      if (!this.agentPinInput.trim()) { this.agentPinError = 'Please enter the Agent PIN.'; return; }
      if (this.agentPinInput.trim() !== environment.agentPin) {
        this.agentPinError = 'Incorrect Agent PIN.';
        this.pinVerified = false;
        this.cdr.detectChanges();
        return;
      }
      this.pinVerified = true;
      this.agentPinError = '';
    }
    if (this.userType === 'branding' && !this.form.organizationName.trim()) {
      this.errorMsg = 'Organization name is required for branding registration.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    try {
      // 1. Create user
      const { data: user, error: userErr } = await this.supa.createUser({
        name: this.form.name.trim(), mobile: this.form.mobile.trim()
      });
      if (userErr) throw new Error((userErr as any)?.message || 'User creation failed');
      if (!user?.id) throw new Error('User creation failed');

      // 2. Upload logo to Supabase Storage (if branding + logo provided)
      //    Naming convention: logos/org-{slug}-{timestamp}.{ext}
      let logoPath = '';
      let logoUrl = '';
      if (this.userType === 'branding' && this.form.logoFile) {
        const logoResult = await this.supa.uploadLogo(this.form.logoFile, this.form.organizationName);
        if (!logoResult.error) { logoPath = logoResult.path; logoUrl = logoResult.url; }
      }

      // 3. Create branding record (if branding type)
      let brandingId: string | undefined;
      if (this.userType === 'branding') {
        const { data: branding, error: bErr } = await this.supa.createBranding({
          user_id: user.id,
          organization_name: this.form.organizationName.trim(),
          branding_type: this.form.brandingType || undefined,
          logo_path: logoPath || undefined,
          logo_url: logoUrl || undefined,
          tagline: this.form.tagline.trim() || undefined,
          ad_text: this.form.adText.trim() || undefined
        });
        if (bErr) throw new Error((bErr as any)?.message || 'Branding creation failed');
        brandingId = branding?.id;
      }

      // 4. Parse vehicle numbers (bulk for branding, single for individual)
      const vehicleNums = this.userType === 'branding' && this.form.vehicleNumbers.trim()
        ? this.form.vehicleNumbers.split(',').map(v => v.trim().toUpperCase()).filter(v => v)
        : [this.form.vehicleNumber.trim().toUpperCase()];

      // 5. Create primary vehicle
      const { data: vehicle, error: vErr } = await this.supa.createVehicle({
        user_id: user.id, vehicle_number: vehicleNums[0],
        user_type: this.userType, branding_id: brandingId
      });
      if (vErr) throw new Error((vErr as any)?.message || 'Vehicle creation failed');
      if (!vehicle?.id) throw new Error('Vehicle creation failed');

      // 6. Create additional vehicles for bulk branding
      for (let i = 1; i < vehicleNums.length; i++) {
        await this.supa.createVehicle({
          user_id: user.id, vehicle_number: vehicleNums[i],
          user_type: this.userType, branding_id: brandingId
        });
      }

      // 7. Save emergency contacts (linked to primary vehicle)
      const validContacts = this.form.emergencyContacts.filter(c => c.mobile?.trim());
      if (validContacts.length > 0) {
        await this.supa.upsertEmergencyContacts(vehicle.id, validContacts);
      }

      const qrUrl = `${this.BASE_URL}/v/${vehicle.id}`;
      this.supa.addRegistrationSession({
        userId: user.id, vehicleId: vehicle.id,
        name: this.form.name.trim(), vehicleNumber: vehicleNums[0]
      });
      localStorage.setItem('mq_role', this.isAgentMode ? 'agent' : 'customer');

      this.successData = {
        userId: user.id, vehicleId: vehicle.id,
        name: this.form.name.trim(), vehicleNumber: vehicleNums[0], qrUrl,
        orgName: this.userType === 'branding' ? this.form.organizationName.trim() : undefined
      };
      this.cdr.detectChanges();
    } catch (err: any) {
      this.errorMsg = err.message || 'Something went wrong. Please try again.';
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
