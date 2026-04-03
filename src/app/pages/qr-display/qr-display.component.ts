import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-qr-display',
  standalone: true,
  imports: [CommonModule, RouterLink, QRCodeComponent],
  template: `
    <div class="qr-page">
      <div class="qr-container">

        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading your QR code…</p>
        </div>

        <div *ngIf="!loading && vehicle">
          <div class="qr-header">
            <div class="back-link">
              <a [routerLink]="['/dashboard']" [queryParams]="{userId: vehicle.user_id}" class="btn-back">← Back to Dashboard</a>
            </div>
            <h1>Your MadadQR Code</h1>
            <p>Print karo aur apni gaadi ki windshield par chipkao</p>
          </div>

          <div class="qr-card" id="printArea">
            <div class="qr-card-top">
              <div class="qr-brand">🔳 MadadQR</div>
              <div class="qr-tagline">Madad bas ek scan door</div>
            </div>
            <div class="qr-code-area" #qrCodeEl>
              <qrcode
                #qrRef
                [qrdata]="qrUrl"
                [width]="280"
                [errorCorrectionLevel]="'H'"
                [colorDark]="'#1e1b4b'"
                [colorLight]="'#ffffff'"
                [margin]="3">
              </qrcode>
            </div>
            <div class="qr-vehicle-info">
              <div class="plate-tag">{{ vehicle.vehicle_number }}</div>
              <p class="scan-instruction">📱 Scan karo emergency mein</p>
            </div>
            <div class="qr-url-display">{{ qrUrl }}</div>
          </div>

          <div class="qr-actions">
            <button (click)="downloadQR()" class="btn-primary">
              📥 Download QR
            </button>
            <button (click)="printQR()" class="btn-secondary">
              🖨️ Print QR
            </button>
            <button (click)="shareQR()" class="btn-secondary" *ngIf="canShare">
              📤 Share
            </button>
          </div>

          <div class="qr-instructions">
            <h3>Instructions</h3>
            <ol>
              <li>Download ya print karo QR code</li>
              <li>Laminate karo agar possible ho</li>
              <li>Gaadi ki windshield ya dashboard par chipkao</li>
              <li>Emergency mein koi bhi scan karke help kar sakta hai</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .qr-page { background: #0a0a14; min-height: calc(100vh - 64px); padding: 2.5rem 1.5rem; }
    .qr-container { max-width: 600px; margin: 0 auto; }
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
    .qr-header { text-align: center; margin-bottom: 2rem; }
    .back-link { margin-bottom: 1.5rem; }
    .btn-back { color: #6366f1; text-decoration: none; font-size: 0.88rem; font-weight: 600; }
    .qr-header h1 { color: #fff; font-size: 1.8rem; font-weight: 800; margin-bottom: 0.4rem; }
    .qr-header p { color: #64748b; font-size: 0.9rem; }
    .qr-card {
      background: #fff;
      border-radius: 20px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      margin-bottom: 2rem;
    }
    .qr-card-top { margin-bottom: 1rem; }
    .qr-brand { font-size: 1.2rem; font-weight: 800; color: #1e1b4b; }
    .qr-tagline { font-size: 0.78rem; color: #64748b; margin-top: 0.2rem; }
    .qr-code-area { display: flex; justify-content: center; margin: 1rem 0; }
    .qr-vehicle-info { margin-top: 1rem; }
    .plate-tag {
      display: inline-block;
      background: #1e293b;
      color: #fff;
      border-radius: 8px;
      padding: 0.4rem 1.2rem;
      font-family: monospace;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    .scan-instruction { color: #64748b; font-size: 0.85rem; margin: 0; }
    .qr-url-display {
      font-size: 0.7rem;
      color: #94a3b8;
      margin-top: 0.75rem;
      font-family: monospace;
      word-break: break-all;
    }
    .qr-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem; }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 0.75rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-secondary {
      background: rgba(255,255,255,0.05);
      color: #cbd5e1;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 0.75rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .qr-instructions {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 16px;
      padding: 1.5rem;
    }
    .qr-instructions h3 { color: #fff; font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
    .qr-instructions ol { padding-left: 1.25rem; margin: 0; }
    .qr-instructions li { color: #94a3b8; font-size: 0.88rem; line-height: 1.8; }
  `]
})
export class QrDisplayComponent implements OnInit {
  vehicle: any = null;
  loading = true;
  qrUrl = '';
  canShare = false;

  constructor(private supa: SupabaseService, private route: ActivatedRoute) {}

  async ngOnInit() {
    this.canShare = !!navigator.share;
    const vehicleId = this.route.snapshot.queryParamMap.get('vehicleId') || localStorage.getItem('mq_vehicleId');
    if (!vehicleId) { this.loading = false; return; }
    try {
      const { data } = await this.supa.getVehicleById(vehicleId);
      this.vehicle = data;
      this.qrUrl = `${window.location.origin}/v/${vehicleId}`;
    } finally {
      this.loading = false;
    }
  }

  downloadQR() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `MadadQR-${this.vehicle?.vehicle_number || 'QR'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  printQR() {
    window.print();
  }

  async shareQR() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: 'My MadadQR Code', url: this.qrUrl });
    } catch {}
  }
}
