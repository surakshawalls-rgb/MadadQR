import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">

        <div class="login-brand">🔳 MadadQR</div>
        <h1>Sign In</h1>
        <p class="login-sub">Enter your registered mobile number to access your dashboard</p>

        <div *ngIf="errorMsg" class="error-banner">{{ errorMsg }}</div>

        <div *ngIf="!done">
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
                (keyup.enter)="login()"
                autocomplete="tel"
              />
            </div>
          </div>
          <button class="btn-submit" (click)="login()" [disabled]="loading || mobile.length !== 10">
            <span *ngIf="!loading">Find My Vehicle &rarr;</span>
            <span *ngIf="loading" class="loading-txt">Looking up&hellip;</span>
          </button>
          <div class="note">No OTP or password needed — just your registered mobile number.</div>
        </div>

        <div *ngIf="done" class="success-state">
          <div class="success-icon">✅</div>
          <p>Found! Redirecting to your dashboard&hellip;</p>
        </div>

        <div class="login-footer">
          Not registered yet?
          <a routerLink="/register">Register your vehicle &rarr;</a>
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
    .login-sub { color: #64748b; font-size: 0.9rem; margin-bottom: 1.75rem; line-height: 1.5; }
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
    .loading-txt { opacity: 0.8; }
    .note { color: #475569; font-size: 0.78rem; line-height: 1.5; }
    .success-state { text-align: center; padding: 1.5rem 0; }
    .success-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .success-state p { color: #4ade80; font-weight: 600; }
    .login-footer { margin-top: 1.75rem; text-align: center; color: #475569; font-size: 0.85rem; }
    .login-footer a { color: #6366f1; font-weight: 600; text-decoration: none; margin-left: 0.25rem; }
    .login-footer a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  mobile = '';
  loading = false;
  errorMsg = '';
  done = false;

  constructor(
    private supa: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async login() {
    if (this.mobile.length !== 10) return;
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();
    try {
      const { data: user, error } = await this.supa.getUserByMobile(this.mobile.trim());
      if (error) throw new Error(error.message);
      if (!user) {
        this.errorMsg = 'No account found for this mobile number. Please register first.';
        return;
      }
      localStorage.setItem('mq_userId', user.id);
      const { data: vehicles } = await this.supa.getVehiclesByUser(user.id);
      if (vehicles && vehicles.length > 0) {
        localStorage.setItem('mq_vehicleId', vehicles[0].id);
        vehicles.forEach((v: any) => {
          this.supa.addRegistrationSession({
            userId: user.id,
            vehicleId: v.id,
            name: user.name,
            vehicleNumber: v.vehicle_number
          });
        });
      }
      this.done = true;
      this.cdr.detectChanges();
      setTimeout(() => this.router.navigate(['/dashboard'], { queryParams: { userId: user.id } }), 1200);
    } catch (err: any) {
      this.errorMsg = err.message || 'Something went wrong. Please try again.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
