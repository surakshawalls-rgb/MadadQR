import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

type ActionType = 'emergency' | 'parking' | null;

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scan-page">

      <!-- Loading -->
      <div *ngIf="loading" class="state-screen">
        <div class="spinner"></div>
        <p>Loading vehicle details…</p>
      </div>

      <!-- Not Found -->
      <div *ngIf="!loading && !vehicle" class="state-screen">
        <div class="state-icon">❌</div>
        <h2>Vehicle Not Found</h2>
        <p>This QR code is not registered or may be invalid.</p>
        <a href="/" class="btn-home">Go to MadadQR.com</a>
      </div>

      <!-- Main Scan Page -->
      <div *ngIf="!loading && vehicle" class="scan-main">

        <!-- Header -->
        <div class="scan-header">
          <div class="scan-logo">🔳 MadadQR</div>
          <div class="scan-subtitle">Vehicle Assistance</div>
        </div>

        <!-- Vehicle Info -->
        <div class="vehicle-card">
          <div class="vehicle-icon">🚗</div>
          <div class="plate-number">{{ vehicle.vehicle_number }}</div>
          <div class="owner-name">Owner: {{ ownerName }}</div>
          <div class="scan-note">Use only in genuine situations</div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">

          <!-- Emergency -->
          <button class="action-btn btn-emergency" (click)="triggerAction('emergency')">
            <span class="btn-icon">🚨</span>
            <div class="btn-text">
              <span class="btn-title">Report Emergency</span>
              <span class="btn-desc">Alert owner & emergency contacts</span>
            </div>
          </button>

          <!-- Call Owner -->
          <a [href]="'tel:+91' + ownerMobile" class="action-btn btn-call">
            <span class="btn-icon">📞</span>
            <div class="btn-text">
              <span class="btn-title">Call Owner</span>
              <span class="btn-desc">Direct call — turant connect karo</span>
            </div>
          </a>

          <!-- Parking Issue -->
          <button class="action-btn btn-parking" (click)="triggerAction('parking')">
            <span class="btn-icon">🚗</span>
            <div class="btn-text">
              <span class="btn-title">Parking Issue</span>
              <span class="btn-desc">Gaadi raste mein hai</span>
            </div>
          </button>

          <!-- WhatsApp -->
          <a [href]="whatsappUrl" target="_blank" class="action-btn btn-whatsapp">
            <span class="btn-icon">💬</span>
            <div class="btn-text">
              <span class="btn-title">WhatsApp Owner</span>
              <span class="btn-desc">Quick message bhejo</span>
            </div>
          </a>

        </div>

        <!-- Footer brand -->
        <div class="scan-footer">
          <p>Powered by <strong>MadadQR</strong> — Madad bas ek scan door</p>
          <a href="/" class="register-link">Register your vehicle →</a>
        </div>

      </div>

      <!-- Confirmation Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">

          <div *ngIf="!alertSent && !alertLoading">
            <div class="modal-icon">{{ pendingAction === 'emergency' ? '🚨' : '🚗' }}</div>
            <h3>{{ pendingAction === 'emergency' ? 'Report Emergency?' : 'Report Parking Issue?' }}</h3>
            <p>
              {{ pendingAction === 'emergency'
                ? 'Owner aur emergency contacts ko turant SMS alert bheja jayega. Sirf genuine emergency mein use karo.'
                : 'Owner ko SMS bheja jayega ki unki gaadi raste mein hai.' }}
            </p>
            <div class="modal-actions">
              <button class="btn-modal-cancel" (click)="closeModal()">Cancel</button>
              <button class="btn-modal-confirm" (click)="confirmAlert()">
                {{ pendingAction === 'emergency' ? 'Yes, Alert Now' : 'Yes, Notify' }}
              </button>
            </div>
          </div>

          <div *ngIf="alertLoading" class="modal-loading">
            <div class="spinner"></div>
            <p>Sending alert…</p>
          </div>

          <div *ngIf="alertSent" class="modal-success">
            <div class="success-icon-large">✅</div>
            <h3>Alert Sent!</h3>
            <p>
              {{ pendingAction === 'emergency'
                ? 'Owner aur emergency contacts ko notify kar diya gaya hai.'
                : 'Owner ko parking issue ke baare mein notify kar diya gaya hai.' }}
            </p>
            <button class="btn-modal-cancel" (click)="closeModal()">Close</button>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    .scan-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a14 0%, #0f0f1e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .state-screen { text-align: center; }
    .spinner {
      width: 44px; height: 44px;
      border: 3px solid rgba(99,102,241,0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      margin: 0 auto 1.25rem;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .state-screen p { color: #64748b; }
    .state-icon { font-size: 3rem; margin-bottom: 1rem; }
    .state-screen h2 { color: #fff; font-size: 1.4rem; margin-bottom: 0.5rem; }
    .btn-home {
      display: inline-block;
      margin-top: 1.25rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      padding: 0.65rem 1.4rem;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .scan-main {
      width: 100%;
      max-width: 420px;
    }
    .scan-header { text-align: center; margin-bottom: 1.75rem; }
    .scan-logo { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 0.2rem; }
    .scan-subtitle { color: #6366f1; font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
    .vehicle-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 20px;
      padding: 1.75rem;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .vehicle-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .plate-number {
      font-family: monospace;
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
      background: #1e293b;
      border: 2px solid #334155;
      border-radius: 10px;
      padding: 0.4rem 1.25rem;
      display: inline-block;
      letter-spacing: 0.06em;
      margin-bottom: 0.75rem;
    }
    .owner-name { color: #94a3b8; font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
    .scan-note { color: #475569; font-size: 0.78rem; }
    .action-buttons { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
    .action-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border-radius: 14px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      text-align: left;
      width: 100%;
    }
    .action-btn:hover { transform: translateY(-2px); }
    .btn-emergency { background: linear-gradient(135deg, #dc2626, #ef4444); color: #fff; box-shadow: 0 4px 20px rgba(220,38,38,0.3); }
    .btn-call { background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; box-shadow: 0 4px 20px rgba(37,99,235,0.3); }
    .btn-parking { background: linear-gradient(135deg, #d97706, #f59e0b); color: #fff; box-shadow: 0 4px 20px rgba(217,119,6,0.3); }
    .btn-whatsapp { background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff; box-shadow: 0 4px 20px rgba(22,163,74,0.3); }
    .btn-icon { font-size: 1.75rem; flex-shrink: 0; }
    .btn-text { display: flex; flex-direction: column; gap: 0.15rem; }
    .btn-title { font-size: 1rem; font-weight: 700; }
    .btn-desc { font-size: 0.78rem; opacity: 0.85; }
    .scan-footer { text-align: center; }
    .scan-footer p { color: #334155; font-size: 0.8rem; margin-bottom: 0.4rem; }
    .scan-footer strong { color: #475569; }
    .register-link { color: #6366f1; font-size: 0.82rem; text-decoration: none; font-weight: 600; }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      z-index: 500;
      backdrop-filter: blur(4px);
    }
    .modal {
      background: #13131f;
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 20px;
      padding: 2rem;
      max-width: 380px;
      width: 100%;
      text-align: center;
    }
    .modal-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .modal h3 { color: #fff; font-size: 1.2rem; font-weight: 800; margin-bottom: 0.5rem; }
    .modal p { color: #94a3b8; font-size: 0.88rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .modal-actions { display: flex; gap: 0.75rem; }
    .btn-modal-cancel {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #94a3b8;
      padding: 0.7rem;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-modal-cancel:hover { background: rgba(255,255,255,0.1); }
    .btn-modal-confirm {
      flex: 1;
      background: linear-gradient(135deg, #dc2626, #ef4444);
      border: none;
      color: #fff;
      padding: 0.7rem;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-modal-confirm:hover { opacity: 0.9; }
    .modal-loading { text-align: center; padding: 1rem 0; }
    .modal-loading p { color: #94a3b8; margin-top: 0.75rem; }
    .modal-success { padding: 0.5rem 0; }
    .success-icon-large { font-size: 3rem; margin-bottom: 0.75rem; }
    .modal-success h3 { color: #4ade80; }
  `]
})
export class ScanComponent implements OnInit {
  vehicle: any = null;
  ownerName = '';
  ownerMobile = '';
  emergencyContacts: any[] = [];
  loading = true;
  showModal = false;
  pendingAction: ActionType = null;
  alertLoading = false;
  alertSent = false;
  whatsappUrl = '';

  constructor(private supa: SupabaseService, private route: ActivatedRoute) {}

  async ngOnInit() {
    const vehicleId = this.route.snapshot.paramMap.get('vehicleId');
    if (!vehicleId) { this.loading = false; return; }
    try {
      const { data, error } = await this.supa.getVehicleById(vehicleId);
      if (error || !data) { this.loading = false; return; }
      this.vehicle = data;
      const u = (data as any).users;
      this.ownerName = u?.name || 'Owner';
      this.ownerMobile = u?.mobile || '';
      const { data: contacts } = await this.supa.getEmergencyContacts(vehicleId);
      this.emergencyContacts = contacts || [];
      this.whatsappUrl = `https://wa.me/91${this.ownerMobile}?text=${encodeURIComponent('Your vehicle ' + data.vehicle_number + ' may need attention.')}`;
    } finally {
      this.loading = false;
    }
  }

  triggerAction(type: ActionType) {
    this.pendingAction = type;
    this.alertSent = false;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.pendingAction = null;
    this.alertSent = false;
  }

  async confirmAlert() {
    this.alertLoading = true;
    // SMS/WhatsApp alerts via tel: links (server-side SMS integration is a Phase 2 feature)
    // For MVP, open WhatsApp for owner and emergency contacts
    const msg = this.pendingAction === 'emergency'
      ? `🚨 EMERGENCY: Your vehicle ${this.vehicle?.vehicle_number} needs immediate help! Someone reported an emergency via MadadQR.`
      : `🚗 Your vehicle ${this.vehicle?.vehicle_number} is blocking the road. Please move it. (via MadadQR)`;

    // Open WhatsApp for owner
    const ownerWA = `https://wa.me/91${this.ownerMobile}?text=${encodeURIComponent(msg)}`;
    window.open(ownerWA, '_blank');

    // Open WhatsApp for each emergency contact
    for (const c of this.emergencyContacts) {
      if (c.mobile) {
        const ecWA = `https://wa.me/91${c.mobile}?text=${encodeURIComponent(msg)}`;
        window.open(ecWA, '_blank');
      }
    }
    await new Promise(r => setTimeout(r, 800));
    this.alertLoading = false;
    this.alertSent = true;
  }
}
