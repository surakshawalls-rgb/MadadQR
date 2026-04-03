import { Component, OnDestroy, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';

type ScanState = 'idle' | 'scanning' | 'success' | 'error' | 'nocamera';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="scanner-page">
      <div class="scanner-container">

        <!-- Header -->
        <div class="scanner-header">
          <h1>Scan QR Code</h1>
          <p>Point your camera at a MadadQR sticker on any vehicle</p>
        </div>

        <!-- Idle State -->
        <div *ngIf="state === 'idle'" class="state-card">
          <div class="scan-icon-large">🔳</div>
          <h3>Ready to Scan</h3>
          <p>Allow camera access to scan a MadadQR sticker</p>
          <button class="btn-start" (click)="startScanner()">
            <span>📷 Start Camera</span>
          </button>
          <div class="manual-entry-section">
            <div class="divider"><span>OR</span></div>
            <p class="manual-label">Enter Vehicle ID manually</p>
            <div class="manual-input-row">
              <input
                type="text"
                [(ngModel)]="manualId"
                placeholder="Paste vehicle ID here"
                class="manual-input"
                (keyup.enter)="goManual()"
              />
              <button class="btn-go" (click)="goManual()" [disabled]="!manualId.trim()">Go →</button>
            </div>
          </div>
        </div>

        <!-- Scanning State -->
        <div *ngIf="state === 'scanning'" class="scanner-active">
          <div class="video-wrapper">
            <div id="qr-reader"></div>
            <div class="scan-overlay">
              <div class="scan-frame">
                <span class="corner tl"></span>
                <span class="corner tr"></span>
                <span class="corner bl"></span>
                <span class="corner br"></span>
                <div class="scan-line"></div>
              </div>
            </div>
          </div>
          <p class="scan-hint">🔳 Align the QR code inside the frame</p>
          <button class="btn-stop" (click)="stopScanner()">✕ Stop Camera</button>
        </div>

        <!-- Success -->
        <div *ngIf="state === 'success'" class="state-card success">
          <div class="success-icon">✅</div>
          <h3>QR Code Detected!</h3>
          <p>Redirecting to vehicle info…</p>
          <div class="spinner-small"></div>
        </div>

        <!-- Error -->
        <div *ngIf="state === 'error'" class="state-card error-state">
          <div class="error-icon">⚠️</div>
          <h3>{{ errorTitle }}</h3>
          <p>{{ errorMessage }}</p>
          <button class="btn-start" (click)="resetScanner()">Try Again</button>
        </div>

        <!-- No Camera -->
        <div *ngIf="state === 'nocamera'" class="state-card">
          <div class="scan-icon-large">📵</div>
          <h3>Camera Not Available</h3>
          <p>Your device doesn't support camera access or it was denied. Use the manual entry below.</p>
          <div class="manual-entry-section" style="margin-top:0">
            <div class="manual-input-row">
              <input
                type="text"
                [(ngModel)]="manualId"
                placeholder="Paste vehicle URL or ID"
                class="manual-input"
                (keyup.enter)="goManual()"
              />
              <button class="btn-go" (click)="goManual()" [disabled]="!manualId.trim()">Go →</button>
            </div>
          </div>
        </div>

        <!-- How to scan info -->
        <div class="scan-tips" *ngIf="state === 'idle' || state === 'nocamera'">
          <h3>Other ways to scan</h3>
          <div class="tips-grid">
            <div class="tip-card">
              <span class="tip-icon">📱</span>
              <div>
                <strong>Phone Camera</strong>
                <p>Open camera app and point at QR — most phones scan automatically</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-icon">🔍</span>
              <div>
                <strong>Google Lens</strong>
                <p>Tap the Lens icon in Google app or Photos and point at QR sticker</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-icon">🌐</span>
              <div>
                <strong>WhatsApp Scanner</strong>
                <p>Open WhatsApp → QR icon → scan any MadadQR code</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .scanner-page {
      background: #0a0a14;
      min-height: calc(100vh - 64px);
      padding: 2.5rem 1.5rem;
    }
    .scanner-container {
      max-width: 560px;
      margin: 0 auto;
    }
    .scanner-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .scanner-header h1 {
      color: #fff;
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 0.3rem;
    }
    .scanner-header p { color: #64748b; font-size: 0.9rem; }

    /* State Cards */
    .state-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 20px;
      padding: 2.5rem 2rem;
      text-align: center;
      margin-bottom: 2rem;
    }
    .scan-icon-large { font-size: 3.5rem; margin-bottom: 1rem; }
    .state-card h3 { color: #e2e8f0; font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .state-card p { color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.6; }
    .state-card.success { border-color: rgba(74,222,128,0.3); background: rgba(34,197,94,0.05); }
    .state-card.success h3 { color: #4ade80; }
    .state-card.error-state { border-color: rgba(248,113,113,0.3); background: rgba(248,113,113,0.05); }
    .state-card.error-state h3 { color: #f87171; }
    .success-icon, .error-icon { font-size: 3rem; margin-bottom: 1rem; }
    .spinner-small {
      width: 28px; height: 28px;
      border: 3px solid rgba(74,222,128,0.2);
      border-top-color: #4ade80;
      border-radius: 50%;
      margin: 0 auto;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Buttons */
    .btn-start {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 0.85rem 2rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 20px rgba(99,102,241,0.35);
      margin-bottom: 1.5rem;
    }
    .btn-start:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.5); }
    .btn-stop {
      background: rgba(248,113,113,0.1);
      border: 1px solid rgba(248,113,113,0.3);
      color: #f87171;
      border-radius: 10px;
      padding: 0.6rem 1.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 1rem;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    .btn-stop:hover { background: rgba(248,113,113,0.2); }

    /* Manual Entry */
    .manual-entry-section { margin-top: 1.5rem; }
    .divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255,255,255,0.08);
    }
    .divider span { color: #334155; font-size: 0.78rem; font-weight: 600; text-transform: uppercase; }
    .manual-label { color: #475569; font-size: 0.82rem; margin-bottom: 0.6rem; }
    .manual-input-row { display: flex; gap: 0.5rem; }
    .manual-input {
      flex: 1;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 0.88rem;
      padding: 0.65rem 0.85rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .manual-input:focus { border-color: rgba(99,102,241,0.5); }
    .manual-input::placeholder { color: #334155; }
    .btn-go {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 0.65rem 1.1rem;
      font-size: 0.88rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .btn-go:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-go:not(:disabled):hover { opacity: 0.9; }

    /* Scanner active */
    .scanner-active { margin-bottom: 2rem; }
    .video-wrapper {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      border: 2px solid rgba(99,102,241,0.3);
      background: #000;
    }
    #qr-reader {
      width: 100% !important;
    }
    /* Override html5-qrcode default styles */
    :host ::ng-deep #qr-reader video {
      width: 100% !important;
      height: auto !important;
      max-height: 380px;
      object-fit: cover;
      border-radius: 18px;
    }
    :host ::ng-deep #qr-reader img { display: none; }
    :host ::ng-deep #qr-reader__scan_region { padding: 0 !important; border: none !important; }
    :host ::ng-deep #qr-reader__dashboard { display: none !important; }

    .scan-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .scan-frame {
      position: relative;
      width: 220px;
      height: 220px;
    }
    .corner {
      position: absolute;
      width: 28px;
      height: 28px;
      border-color: #6366f1;
      border-style: solid;
    }
    .tl { top: 0; left: 0; border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
    .tr { top: 0; right: 0; border-width: 3px 3px 0 0; border-radius: 0 4px 0 0; }
    .bl { bottom: 0; left: 0; border-width: 0 0 3px 3px; border-radius: 0 0 0 4px; }
    .br { bottom: 0; right: 0; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }
    .scan-line {
      position: absolute;
      left: 4px; right: 4px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #6366f1, transparent);
      animation: scanLine 2s linear infinite;
      top: 0;
    }
    @keyframes scanLine {
      0% { top: 4px; opacity: 1; }
      95% { top: calc(100% - 6px); opacity: 1; }
      100% { top: calc(100% - 6px); opacity: 0; }
    }
    .scan-hint {
      color: #94a3b8;
      font-size: 0.85rem;
      text-align: center;
      margin-top: 1rem;
    }

    /* Tips */
    .scan-tips {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.12);
      border-radius: 16px;
      padding: 1.5rem;
    }
    .scan-tips h3 { color: #e2e8f0; font-size: 0.95rem; font-weight: 700; margin-bottom: 1rem; }
    .tips-grid { display: flex; flex-direction: column; gap: 0.75rem; }
    .tip-card {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
    }
    .tip-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 0.1rem; }
    .tip-card strong { display: block; color: #cbd5e1; font-size: 0.88rem; margin-bottom: 0.2rem; }
    .tip-card p { color: #475569; font-size: 0.8rem; line-height: 1.5; margin: 0; }
  `]
})
export class ScannerComponent implements AfterViewInit, OnDestroy {
  state: ScanState = 'idle';
  errorTitle = '';
  errorMessage = '';
  manualId = '';
  private html5QrCode: Html5Qrcode | null = null;

  constructor(private router: Router, private ngZone: NgZone) {}

  ngAfterViewInit() {}

  async startScanner() {
    this.state = 'scanning';

    // Wait for DOM to render
    await new Promise(r => setTimeout(r, 100));

    try {
      this.html5QrCode = new Html5Qrcode('qr-reader');

      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        this.ngZone.run(() => {
          this.state = 'nocamera';
        });
        return;
      }

      // Prefer back camera
      const cameraId = devices.find(d =>
        d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear')
      )?.id || devices[devices.length - 1].id;

      await this.html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
          disableFlip: false
        },
        (decodedText) => this.onScanSuccess(decodedText),
        () => {} // ignore errors silently
      );
    } catch (err: any) {
      this.ngZone.run(() => {
        if (err?.name === 'NotAllowedError' || String(err).includes('Permission')) {
          this.state = 'error';
          this.errorTitle = 'Camera Permission Denied';
          this.errorMessage = 'Please allow camera access in your browser settings and try again.';
        } else {
          this.state = 'nocamera';
        }
      });
    }
  }

  private onScanSuccess(decodedText: string) {
    this.ngZone.run(async () => {
      this.state = 'success';
      await this.stopScanner();

      // Extract vehicleId from URL like https://domain.com/v/{id}
      const match = decodedText.match(/\/v\/([a-f0-9-]{36})/i);
      if (match) {
        setTimeout(() => this.router.navigate(['/v', match[1]]), 800);
        return;
      }

      // If it's a full URL pointing to our domain
      try {
        const url = new URL(decodedText);
        const path = url.pathname;
        const pathMatch = path.match(/\/v\/([a-f0-9-]{36})/i);
        if (pathMatch) {
          setTimeout(() => this.router.navigate(['/v', pathMatch[1]]), 800);
          return;
        }
      } catch {}

      // Not a valid MadadQR code
      this.state = 'error';
      this.errorTitle = 'Not a MadadQR Code';
      this.errorMessage = 'This QR code is not registered with MadadQR. Please scan a MadadQR vehicle sticker.';
    });
  }

  async stopScanner() {
    try {
      if (this.html5QrCode && this.html5QrCode.isScanning) {
        await this.html5QrCode.stop();
      }
    } catch {}
  }

  resetScanner() {
    this.state = 'idle';
    this.errorTitle = '';
    this.errorMessage = '';
  }

  goManual() {
    const input = this.manualId.trim();
    if (!input) return;

    // If it looks like a full URL
    const match = input.match(/\/v\/([a-f0-9-]{36})/i);
    if (match) {
      this.router.navigate(['/v', match[1]]);
      return;
    }

    // If it looks like a UUID directly
    const uuidMatch = input.match(/^([a-f0-9-]{36})$/i);
    if (uuidMatch) {
      this.router.navigate(['/v', uuidMatch[1]]);
      return;
    }

    this.state = 'error';
    this.errorTitle = 'Invalid ID';
    this.errorMessage = 'Please enter a valid MadadQR vehicle ID or URL.';
  }

  ngOnDestroy() {
    this.stopScanner();
  }
}
