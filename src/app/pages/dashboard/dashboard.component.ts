import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { SupabaseService } from '../../services/supabase.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, QRCodeComponent],
  template: `
    <div class="dashboard-page">
      <div class="dash-container">

        <!-- Header -->
        <div class="dash-header">
          <div>
            <h1>Your Dashboard</h1>
            <p *ngIf="vehicle">Welcome back, <span class="accent">{{ user?.name }}</span></p>
          </div>
          <a routerLink="/register" class="btn-new">+ Register Another</a>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading your details…</p>
        </div>

        <!-- Error -->
        <div *ngIf="errorMsg && !loading" class="error-card">
          <p>{{ errorMsg }}</p>
          <a routerLink="/register" class="btn-link">Register Now →</a>
        </div>

        <!-- Dashboard Content -->
        <div *ngIf="vehicle && !loading" class="dash-grid">

          <!-- Vehicle Card -->
          <div class="info-card">
            <div class="card-header">
              <span class="card-icon">🚗</span>
              <h3>Vehicle Details</h3>
            </div>
            <div class="detail-row">
              <span class="detail-label">Vehicle Number</span>
              <span class="detail-value plate">{{ vehicle.vehicle_number }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Owner Name</span>
              <span class="detail-value">{{ user?.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mobile</span>
              <span class="detail-value">+91 {{ user?.mobile }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Registered</span>
              <span class="detail-value">{{ vehicle.created_at | date:'dd MMM yyyy' }}</span>
            </div>
            <a [routerLink]="['/edit-profile']" [queryParams]="{vehicleId: vehicle.id}" class="card-action">
              ✏️ Edit Details
            </a>
          </div>

          <!-- Emergency Contacts Card -->
          <div class="info-card">
            <div class="card-header">
              <span class="card-icon">👥</span>
              <h3>Emergency Contacts</h3>
            </div>
            <div *ngIf="emergencyContacts.length === 0" class="empty-state">
              <p>No emergency contacts added yet</p>
              <a [routerLink]="['/edit-profile']" [queryParams]="{vehicleId: vehicle.id}" class="btn-link">Add Contacts →</a>
            </div>
            <div *ngFor="let c of emergencyContacts; let i = index" class="contact-row">
              <div class="contact-avatar">{{ i + 1 }}</div>
              <div>
                <div class="contact-name">{{ c.name || 'Contact ' + (i+1) }}</div>
                <div class="contact-mobile">+91 {{ c.mobile }}</div>
              </div>
            </div>
          </div>

          <!-- QR Code Card -->
          <div class="qr-card">
            <div class="card-header">
              <span class="card-icon">🔳</span>
              <h3>Your MadadQR Code</h3>
            </div>
            <p class="qr-hint">Print aur apni gaadi par chipkaye</p>
            <div class="qr-wrapper" #qrWrapper>
              <qrcode
                [qrdata]="qrUrl"
                [width]="220"
                [errorCorrectionLevel]="'M'"
                [colorDark]="'#1e1b4b'"
                [colorLight]="'#ffffff'"
                [margin]="2">
              </qrcode>
            </div>
            <div class="qr-url">{{ qrUrl }}</div>
            <div class="qr-actions">
              <a [routerLink]="['/qr']" [queryParams]="{vehicleId: vehicle.id}" class="btn-qr">
                🔍 View Full QR
              </a>
              <a [href]="scanUrl" target="_blank" class="btn-qr btn-outline">
                🔗 Test Scan Page
              </a>
            </div>
          </div>

        </div>

        <!-- Quick Actions -->
        <div *ngIf="vehicle && !loading" class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-grid">
            <a [routerLink]="['/qr']" [queryParams]="{vehicleId: vehicle.id}" class="action-card">
              <span class="action-icon">📥</span>
              <span>Download QR</span>
            </a>
            <a [routerLink]="['/edit-profile']" [queryParams]="{vehicleId: vehicle.id}" class="action-card">
              <span class="action-icon">✏️</span>
              <span>Edit Profile</span>
            </a>
            <a [href]="scanUrl" target="_blank" class="action-card">
              <span class="action-icon">🔍</span>
              <span>Preview Scan Page</span>
            </a>
            <a routerLink="/register" class="action-card">
              <span class="action-icon">➕</span>
              <span>Add Vehicle</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { background: #0a0a14; min-height: calc(100vh - 64px); padding: 2.5rem 1.5rem; }
    .dash-container { max-width: 1100px; margin: 0 auto; }
    .dash-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .dash-header h1 { color: #fff; font-size: 1.8rem; font-weight: 800; margin: 0 0 0.2rem; }
    .dash-header p { color: #64748b; margin: 0; font-size: 0.9rem; }
    .accent { color: #a78bfa; }
    .btn-new {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      padding: 0.55rem 1.2rem;
      border-radius: 10px;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn-new:hover { opacity: 0.85; transform: translateY(-1px); }
    .loading-state { text-align: center; padding: 4rem; }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(99,102,241,0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-state p { color: #64748b; }
    .error-card {
      text-align: center;
      background: rgba(248,113,113,0.08);
      border: 1px solid rgba(248,113,113,0.2);
      border-radius: 16px;
      padding: 3rem;
    }
    .error-card p { color: #f87171; margin-bottom: 1rem; }
    .btn-link { color: #6366f1; text-decoration: none; font-weight: 600; }
    .dash-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .info-card, .qr-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 16px;
      padding: 1.5rem;
    }
    .card-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem; }
    .card-icon { font-size: 1.3rem; }
    .card-header h3 { color: #e2e8f0; font-size: 1rem; font-weight: 700; margin: 0; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 0.5rem; }
    .detail-row:last-of-type { border-bottom: none; }
    .detail-label { color: #64748b; font-size: 0.82rem; flex-shrink: 0; }
    .detail-value { color: #e2e8f0; font-size: 0.9rem; font-weight: 600; text-align: right; }
    .plate {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 0.2rem 0.6rem;
      font-family: monospace;
      font-size: 0.95rem;
      letter-spacing: 0.05em;
    }
    .card-action {
      display: block;
      margin-top: 1rem;
      text-align: center;
      color: #6366f1;
      font-size: 0.88rem;
      font-weight: 600;
      text-decoration: none;
      padding: 0.5rem;
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 8px;
      transition: all 0.2s;
    }
    .card-action:hover { background: rgba(99,102,241,0.1); }
    .empty-state { text-align: center; padding: 1.5rem 0; }
    .empty-state p { color: #475569; font-size: 0.88rem; margin-bottom: 0.5rem; }
    .contact-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .contact-row:last-child { border-bottom: none; }
    .contact-avatar {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700; color: #fff; flex-shrink: 0;
    }
    .contact-name { color: #e2e8f0; font-size: 0.88rem; font-weight: 600; }
    .contact-mobile { color: #64748b; font-size: 0.8rem; }
    .qr-card { text-align: center; }
    .qr-hint { color: #64748b; font-size: 0.82rem; margin-bottom: 1rem; }
    .qr-wrapper {
      background: #fff;
      border-radius: 12px;
      padding: 0.75rem;
      display: inline-block;
      margin-bottom: 0.75rem;
    }
    .qr-url {
      color: #475569;
      font-size: 0.75rem;
      word-break: break-all;
      margin-bottom: 1rem;
      font-family: monospace;
    }
    .qr-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
    .btn-qr {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-qr:hover { opacity: 0.9; }
    .btn-outline {
      background: transparent !important;
      border: 1px solid rgba(99,102,241,0.4);
      color: #a78bfa !important;
    }
    .quick-actions { margin-top: 1rem; }
    .quick-actions h3 { color: #fff; font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
    .action-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    .action-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 12px;
      padding: 1.25rem 1rem;
      text-align: center;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .action-card:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.35); transform: translateY(-2px); }
    .action-icon { font-size: 1.5rem; }
    .action-card span:last-child { color: #94a3b8; font-size: 0.82rem; font-weight: 600; }
    @media (max-width: 1024px) {
      .dash-grid { grid-template-columns: 1fr 1fr; }
      .action-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .dash-grid { grid-template-columns: 1fr; }
      .action-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: any = null;
  vehicle: any = null;
  emergencyContacts: any[] = [];
  loading = true;
  errorMsg = '';
  qrUrl = '';
  scanUrl = '';

  constructor(private supa: SupabaseService, private route: ActivatedRoute) {}

  async ngOnInit() {
    const userId = this.route.snapshot.queryParamMap.get('userId') || localStorage.getItem('mq_userId');
    if (!userId) {
      this.loading = false;
      this.errorMsg = 'No registered vehicle found. Please register first.';
      return;
    }
    try {
      const { data: vehicles } = await this.supa.getVehiclesByUser(userId);
      if (!vehicles || vehicles.length === 0) {
        this.errorMsg = 'No vehicles found. Please register first.';
        this.loading = false;
        return;
      }
      this.vehicle = vehicles[0];
      const { data: userData } = await this.supa.getUserById(userId);
      this.user = userData;
      const { data: contacts } = await this.supa.getEmergencyContacts(this.vehicle.id);
      this.emergencyContacts = contacts || [];
      this.qrUrl = `${window.location.origin}/v/${this.vehicle.id}`;
      this.scanUrl = this.qrUrl;
    } catch (err: any) {
      this.errorMsg = 'Failed to load dashboard. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
