import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

type LoginStep = 'phone' | 'otp' | 'done';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">

        <div class="login-brand">🔳 MadadQR</div>
        <h1>Sign In</h1>
        <p class="login-sub">Enter your mobile number to receive an OTP</p>

        <div *ngIf="errorMsg" class="error-banner">{{ errorMsg }}</div>

        <!-- Step 1: Phone -->
        <div *ngIf="step === 'phone'">
          <div class="form-group">
            <label>Mobile Number</label>
            <div class="input-prefix">
              <span class="prefix">+91</span>
              <input
                type="tel"
                [(ngModel)]="mobile"
                name="mobile"
                placeholder="9876543210"
                maxlength="10"
                pattern="[0-9]{10}"
                class="form-input prefix-input"
                (keyup.enter)="sendOtp()"
              />
            </div>
          </div>
          <button class="btn-submit" (click)="sendOtp()" [disabled]="loading || mobile.length !== 10">
            <span *ngIf="!loading">Send OTP →</span>
            <span *ngIf="loading">Sending…</span>
          </button>
          <div class="note">⚠️ OTP will be sent via SMS to your registered number.</div>
        </div>

        <!-- Step 2: OTP Verify -->
        <div *ngIf="step === 'otp'">
          <p class="otp-sent-msg">OTP sent to <strong>+91 {{ mobile }}</strong></p>
          <div class="form-group">
            <label>Enter 6-digit OTP</label>
            <input
              type="text"
              [(ngModel)]="otp"
              name="otp"
              placeholder="— — — — — —"
              maxlength="6"
              class="form-input otp-input"
              (keyup.enter)="verifyOtp()"
              autocomplete="one-time-code"
            />
          </div>
          <button class="btn-submit" (click)="verifyOtp()" [disabled]="loading || otp.length !== 6">
            <span *ngIf="!loading">Verify OTP →</span>
            <span *ngIf="loading">Verifying…</span>
          </button>
          <button class="btn-resend" (click)="resendOtp()" [disabled]="resendCooldown > 0">
            {{ resendCooldown > 0 ? 'Resend in ' + resendCooldown + 's' : 'Resend OTP' }}
          </button>
        </div>

        <!-- Step 3: Done -->
        <div *ngIf="step === 'done'" class="success-state">
          <div class="success-icon">✅</div>
          <p>Logged in successfully! Redirecting…</p>
        </div>

        <div class="login-footer">
          Don't have a vehicle registered yet?
          <a routerLink="/register">Register here →</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: calc(100vh - 64px);
      background: #0a0a14;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 20px;
      padding: 2.5rem 2rem;
    }
    .login-brand { color: #a78bfa; font-weight: 800; font-size: 1rem; margin-bottom: 1.25rem; }
    h1 { color: #fff; font-size: 1.8rem; font-weight: 800; margin: 0 0 0.4rem; }
    .login-sub { color: #64748b; font-size: 0.9rem; margin-bottom: 1.75rem; }
    .error-banner {
      background: rgba(248,113,113,0.1);
      border: 1px solid rgba(248,113,113,0.3);
      color: #f87171;
      border-radius: 10px;
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; color: #94a3b8; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; }
    .form-input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 0.95rem;
      padding: 0.7rem 0.9rem;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .form-input:focus { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.06); }
    .form-input::placeholder { color: #334155; }
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
    .otp-input { font-size: 1.4rem; letter-spacing: 0.3em; text-align: center; font-weight: 700; }
    .otp-sent-msg { color: #94a3b8; font-size: 0.88rem; margin-bottom: 1rem; }
    .otp-sent-msg strong { color: #e2e8f0; }
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
      margin-bottom: 0.75rem;
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.5); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-resend {
      width: 100%;
      background: transparent;
      border: 1px solid rgba(99,102,241,0.3);
      color: #6366f1;
      border-radius: 10px;
      padding: 0.65rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 0.5rem;
    }
    .btn-resend:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-resend:hover:not(:disabled) { background: rgba(99,102,241,0.08); }
    .note { color: #475569; font-size: 0.78rem; margin-top: 0.5rem; }
    .success-state { text-align: center; padding: 1.5rem 0; }
    .success-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .success-state p { color: #4ade80; font-weight: 600; }
    .login-footer { margin-top: 1.75rem; text-align: center; color: #475569; font-size: 0.85rem; }
    .login-footer a { color: #6366f1; font-weight: 600; text-decoration: none; margin-left: 0.25rem; }
    .login-footer a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  step: LoginStep = 'phone';
  mobile = '';
  otp = '';
  loading = false;
  errorMsg = '';
  resendCooldown = 0;
  private cooldownInterval: any;

  constructor(
    private supa: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async sendOtp() {
    if (this.mobile.length !== 10) return;
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();
    try {
      const phone = `+91${this.mobile}`;
      const { error } = await this.supa.sendOtp(phone);
      if (error) throw new Error(error.message);
      this.step = 'otp';
      this.startResendCooldown();
    } catch (err: any) {
      this.errorMsg = err.message || 'Failed to send OTP. Please try again.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async resendOtp() {
    await this.sendOtp();
  }

  async verifyOtp() {
    if (this.otp.length !== 6) return;
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();
    try {
      const phone = `+91${this.mobile}`;
      const { data, error } = await this.supa.verifyOtp(phone, this.otp);
      if (error) throw new Error(error.message);

      const authUserId = data.user?.id;
      if (!authUserId) throw new Error('Verification failed, please try again.');

      // Find or create user record in custom users table by mobile
      let { data: existingUser } = await this.supa.getUserByMobile(this.mobile);
      if (!existingUser) {
        // New user — redirect to register to fill in details
        this.step = 'done';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/register']), 1200);
        return;
      }

      // Existing user — store userId and go to dashboard
      localStorage.setItem('mq_userId', existingUser.id);
      this.step = 'done';
      this.cdr.detectChanges();
      setTimeout(() => this.router.navigate(['/dashboard'], { queryParams: { userId: existingUser.id } }), 1200);
    } catch (err: any) {
      this.errorMsg = err.message || 'Invalid OTP. Please try again.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private startResendCooldown(seconds = 30) {
    this.resendCooldown = seconds;
    this.cooldownInterval = setInterval(() => {
      this.resendCooldown--;
      this.cdr.detectChanges();
      if (this.resendCooldown <= 0) {
        clearInterval(this.cooldownInterval);
      }
    }, 1000);
  }
}
