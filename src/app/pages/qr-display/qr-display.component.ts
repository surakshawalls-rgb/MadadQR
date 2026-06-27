import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
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

          <!-- QR STICKER CARD -->
          <div class="qr-card" id="printArea">

            <!-- Header Bar -->
            <div class="sticker-header">
              <span class="emerg-icon">🚨</span>
              <span class="emerg-title">IN CASE OF EMERGENCY</span>
              <img *ngIf="branding?.logo_url" [src]="branding.logo_url" class="org-logo-header" alt="org logo" />
            </div>

            <!-- Sub-header -->
            <div class="sticker-subheader">Accident&nbsp;•&nbsp;Parking Issue&nbsp;•&nbsp;Lost Vehicle</div>

            <!-- Main Body -->
            <div class="sticker-body">
              <!-- Left: QR Code -->
              <div class="sticker-qr-col">
                <div class="qr-box-sticker">
                  <qrcode
                    #qrRef
                    [qrdata]="qrUrl"
                    [width]="180"
                    [errorCorrectionLevel]="'H'"
                    [colorDark]="'#1a1a2e'"
                    [colorLight]="'#ffffff'"
                    [margin]="2">
                  </qrcode>
                </div>
              </div>
              <!-- Right: Scan Instructions -->
              <div class="sticker-scan-col">
                <div class="scan-headline">Scan this QR<br>to help</div>
                <div class="scan-using-label">Scan using:</div>
                <div class="scan-apps">
                  <span>🔍 Google Lens / <strong>Paytm</strong></span>
                  <span>📱 PhonePe / Any QR Scanner</span>
                </div>
                <div class="no-app-note">(No app required)</div>
              </div>
            </div>

            <!-- Brand Bar -->
            <div class="sticker-brand-bar">
              <div class="brand-left">
                <ng-container *ngIf="!branding">
                  <div class="mq-brand-name">MadadQR</div>
                  <div class="mq-brand-tag">.Madad bas ek scan door</div>
                </ng-container>
                <ng-container *ngIf="branding">
                  <div class="org-brand-wrap">
                    <img *ngIf="branding.logo_url" [src]="branding.logo_url" class="org-logo-brand" alt="org logo" />
                    <div>
                      <div class="org-brand-name">{{ branding.organization_name }}</div>
                      <div *ngIf="branding.tagline" class="org-brand-tag">{{ branding.tagline }}</div>
                      <div class="mq-powered">Powered by MadadQR</div>
                    </div>
                  </div>
                </ng-container>
              </div>
              <div class="brand-right">
                <div class="vehicle-plate-sticker">{{ vehicle?.vehicle_number }}</div>
              </div>
            </div>

            <!-- Footer -->
            <div class="sticker-footer">
              <span>Only for emergency &amp; genuine use</span>
              <span class="footer-sep">&nbsp;•&nbsp;</span>
              <span>Misuse may be tracked</span>
            </div>
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
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      margin-bottom: 2rem;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }
    .sticker-header {
      background: #c0392b;
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.7rem 1.2rem;
    }
    .emerg-icon { font-size: 1.4rem; }
    .emerg-title {
      font-size: 1.1rem; font-weight: 900; color: #fff;
      letter-spacing: 0.04em; flex: 1;
    }
    .org-logo-header { max-height: 36px; max-width: 80px; object-fit: contain; border-radius: 4px; background: #fff; padding: 2px; }
    .sticker-subheader {
      background: #f1f1f1; color: #333;
      text-align: center; font-size: 0.82rem; font-weight: 600;
      padding: 0.4rem 0.75rem; letter-spacing: 0.02em;
    }
    .sticker-body { display: flex; gap: 0; padding: 1rem 1rem 0.5rem; }
    .sticker-qr-col { flex-shrink: 0; margin-right: 1rem; }
    .qr-box-sticker { background: #fff; border: 1.5px solid #ddd; border-radius: 10px; padding: 6px; display: inline-block; }
    .sticker-scan-col { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 0.35rem; }
    .scan-headline { font-size: 1.25rem; font-weight: 900; color: #1a1a2e; line-height: 1.25; }
    .scan-using-label { font-size: 0.72rem; color: #555; font-weight: 600; }
    .scan-apps { display: flex; flex-direction: column; gap: 0.15rem; }
    .scan-apps span { font-size: 0.76rem; color: #333; }
    .no-app-note { font-size: 0.73rem; color: #666; margin-top: 0.35rem; }
    .sticker-brand-bar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.6rem 1rem; border-top: 1px solid #eee; background: #fafafa;
    }
    .brand-left { display: flex; flex-direction: column; gap: 0.1rem; }
    .mq-brand-name { font-size: 1.1rem; font-weight: 900; color: #2a2a72; }
    .mq-brand-tag { font-size: 0.7rem; color: #888; }
    .org-brand-wrap { display: flex; align-items: center; gap: 0.6rem; }
    .org-logo-brand { max-height: 40px; max-width: 70px; object-fit: contain; }
    .org-brand-name { font-size: 0.95rem; font-weight: 800; color: #1a1a2e; }
    .org-brand-tag { font-size: 0.73rem; color: #555; }
    .mq-powered { font-size: 0.65rem; color: #9ca3af; margin-top: 0.15rem; }
    .brand-right { text-align: right; }
    .vehicle-plate-sticker {
      display: inline-block; background: #1e293b; color: #fff;
      border-radius: 6px; padding: 0.3rem 0.8rem;
      font-family: monospace; font-size: 0.85rem; font-weight: 800; letter-spacing: 0.05em;
    }
    .sticker-footer {
      background: #1a1a2e; color: #fff;
      text-align: center; padding: 0.55rem 1rem;
      font-size: 0.78rem; font-weight: 600;
    }
    .footer-sep { opacity: 0.5; }
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
  branding: any = null;
  loading = true;
  qrUrl = '';
  canShare = false;

  constructor(
    private supa: SupabaseService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    this.canShare = !!navigator.share;
    this.cdr.detectChanges();
    const vehicleId = this.route.snapshot.queryParamMap.get('vehicleId') || localStorage.getItem('mq_vehicleId');
    const baseUrl = 'https://madad-qr.vercel.app';
    if (!vehicleId) { this.loading = false; this.cdr.detectChanges(); return; }
    try {
      const { data } = await this.supa.getVehicleById(vehicleId);
      this.vehicle = data;
      this.qrUrl = `${baseUrl}/v/${vehicleId}`;
      // Load branding if co-branded vehicle
      if (data?.branding_id) {
        const { data: b } = await this.supa.getBrandingById(data.branding_id);
        this.branding = b;
      }
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
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
