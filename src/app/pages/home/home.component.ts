import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="home">
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-content">
          <div class="hero-badge">Vehicle Emergency QR</div>
          <h1>Get your QR sticker. Let people reach you in seconds.</h1>
          <p class="hero-subtitle">
            Register your vehicle, generate a QR code, and keep it visible on the vehicle.
            Anyone can scan it when help is needed, when a vehicle is blocking access, or when quick contact is required.
          </p>
          <div class="hero-actions-grid">
            <a routerLink="/register" class="action-tile action-tile-primary">
              <span class="tile-icon tile-icon-primary">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 8V4a1 1 0 0 1 1-1h4"/>
                  <path d="M21 8V4a1 1 0 0 0-1-1h-4"/>
                  <path d="M3 16v4a1 1 0 0 0 1 1h4"/>
                  <path d="M21 16v4a1 1 0 0 1-1 1h-4"/>
                  <path d="M12 9v6M9 12h6"/>
                </svg>
              </span>
              <span class="tile-label">Get QR</span>
              <span class="tile-sub">Register vehicle</span>
            </a>
            <a routerLink="/scan-qr" class="action-tile">
              <span class="tile-icon tile-icon-square">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 8V4a1 1 0 0 1 1-1h4"/>
                  <path d="M21 8V4a1 1 0 0 0-1-1h-4"/>
                  <path d="M3 16v4a1 1 0 0 0 1 1h4"/>
                  <path d="M21 16v4a1 1 0 0 1-1 1h-4"/>
                  <path d="M2 12h20"/>
                </svg>
              </span>
              <span class="tile-label">Scan QR</span>
              <span class="tile-sub">Open camera flow</span>
            </a>
          </div>
          <a href="#how-it-works" class="hero-link">How it works</a>
          <div class="hero-notes">
            <span>No app required</span>
            <span>Simple for any phone camera</span>
            <span>Built for quick action</span>
          </div>
        </div>

        <div class="hero-visual">
          <div class="phone-mockup">
            <div class="phone-screen">
              <div class="qr-card">
                <div class="qr-grid">
                  <div *ngFor="let i of qrDots" class="qr-dot" [class.filled]="i"></div>
                </div>
              </div>
              <div class="visual-caption">
                <div class="visual-title">Scan QR</div>
                <div class="visual-subtitle">Quick contact access</div>
              </div>
            </div>
          </div>
          <div class="float-card fc-1">Open owner contact instantly</div>
          <div class="float-card fc-2">Works with a normal camera</div>
        </div>
      </section>

      <section class="section" id="how-it-works">
        <div class="section-container">
          <div class="section-header">
            <div class="section-badge">How it works</div>
            <h2>Designed for fast, simple use</h2>
            <p>Keep the flow clear. Generate once, place the QR, and let anyone scan when needed.</p>
          </div>
          <div class="steps">
            <div class="step">
              <div class="step-number">01</div>
              <h3>Register your vehicle</h3>
              <p>Add the vehicle details and create your QR code in a few minutes.</p>
            </div>
            <div class="step-arrow">→</div>
            <div class="step">
              <div class="step-number">02</div>
              <h3>Place the QR sticker</h3>
              <p>Print or download the code and keep it visible on the vehicle.</p>
            </div>
            <div class="step-arrow">→</div>
            <div class="step">
              <div class="step-number">03</div>
              <h3>Scan when needed</h3>
              <p>Anyone can scan it to quickly reach the right contact.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-dark">
        <div class="section-container">
          <div class="section-header">
            <div class="section-badge">Benefits</div>
            <h2>Clear actions, no extra clutter</h2>
            <p>Everything on the page should help the user act quickly without reading twice.</p>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <h3>Fast access</h3>
              <p>Keep the QR visible so the right person can contact you immediately.</p>
            </div>
            <div class="feature-card">
              <h3>Easy to use</h3>
              <p>No app flow to understand. Open, scan, and move on.</p>
            </div>
            <div class="feature-card">
              <h3>Better parking support</h3>
              <p>Useful when a vehicle needs to be moved quickly.</p>
            </div>
            <div class="feature-card">
              <h3>Works on any phone</h3>
              <p>Use the normal camera or any QR scanner.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section cta-section">
        <div class="section-container">
          <div class="cta-card">
            <h2>Ready to create your QR?</h2>
            <p>Keep the first action easy: register the vehicle and generate the code now.</p>
            <a routerLink="/register" class="btn-primary btn-large">
              <span>Get QR Now</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .home { min-height: 100vh; }
    .hero {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #0a0a14 0%, #0f0f1e 50%, #0d0d1a 100%);
      padding: 6rem 1.5rem 5rem;
      display: flex;
      align-items: center;
      gap: 4rem;
      max-width: 1200px;
      margin: 0 auto;
      min-height: 86vh;
    }
    .hero-glow {
      position: absolute;
      top: -180px; left: -180px;
      width: 560px; height: 560px;
      background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-content { flex: 1; max-width: 620px; z-index: 1; }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.3);
      color: #a78bfa;
      padding: 0.35rem 0.9rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .hero-content h1 {
      font-size: clamp(2.5rem, 5vw, 3.8rem);
      font-weight: 900;
      line-height: 1.1;
      color: #fff;
      margin-bottom: 1.25rem;
    }
    .gradient-text {
      background: linear-gradient(135deg, #6366f1, #a78bfa, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.08rem;
      color: #94a3b8;
      line-height: 1.75;
      margin-bottom: 1.75rem;
      max-width: 56ch;
    }
    .hero-actions-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
      max-width: 360px;
      margin-bottom: 1rem;
    }
    .action-tile {
      aspect-ratio: 1;
      min-height: 124px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.55rem;
      padding: 1rem 0.85rem;
      border-radius: 20px;
      text-decoration: none;
      color: #e2e8f0;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
      text-align: center;
      transition: transform 0.2s, background 0.2s, border-color 0.2s;
    }
    .action-tile:hover { transform: translateY(-2px); border-color: rgba(99,102,241,0.35); background: rgba(99,102,241,0.08); }
    .action-tile-primary {
      background: linear-gradient(135deg, rgba(99,102,241,0.95), rgba(139,92,246,0.92));
      border-color: rgba(167,139,250,0.4);
      color: #fff;
      box-shadow: 0 12px 30px rgba(99,102,241,0.25);
    }
    .action-tile-primary:hover { background: linear-gradient(135deg, rgba(99,102,241,1), rgba(139,92,246,1)); }
    .tile-icon {
      width: 58px;
      height: 58px;
      border-radius: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.12);
      font-size: 1.35rem;
      flex-shrink: 0;
    }
    .action-tile:not(.action-tile-primary) .tile-icon { background: rgba(255,255,255,0.08); }
    .tile-icon-primary { background: rgba(255,255,255,0.18); }
    .tile-icon-square svg, .tile-icon-primary svg { display: block; width: 28px; height: 28px; }
    .tile-label { font-size: 1rem; font-weight: 800; line-height: 1.1; }
    .tile-sub { font-size: 0.78rem; color: inherit; opacity: 0.82; }
    .hero-link {
      display: inline-flex;
      align-items: center;
      color: #a78bfa;
      text-decoration: none;
      font-size: 0.92rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
    }
    .hero-link:hover { text-decoration: underline; }
    .hero-actions { display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff;
      padding: 0.95rem 1.5rem;
      border-radius: 16px;
      font-weight: 800;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.25s;
      box-shadow: 0 10px 28px rgba(79,70,229,0.32);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(79,70,229,0.44); }
    .btn-primary.btn-large { padding: 1rem 2rem; font-size: 1.02rem; }
    .scan-button {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.12);
      color: #e2e8f0;
      text-decoration: none;
      transition: all 0.25s;
    }
    .scan-button:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(148,163,184,0.22);
      color: #dbe4f0;
      padding: 0.95rem 1.5rem;
      border-radius: 16px;
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.25s;
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(167,139,250,0.28); }
    .hero-notes {
      display: flex;
      gap: 0.85rem;
      flex-wrap: wrap;
      color: #94a3b8;
      font-size: 0.85rem;
    }
    .hero-notes span {
      padding: 0.42rem 0.75rem;
      border-radius: 999px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .hero-visual { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; }
    .phone-mockup {
      width: 240px; height: 420px;
      background: linear-gradient(135deg, #1e1e2e, #16213e);
      border-radius: 36px;
      border: 2px solid rgba(99,102,241,0.3);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(99,102,241,0.1);
      position: relative;
      z-index: 2;
    }
    .phone-screen { padding: 1.5rem; text-align: center; width: 100%; }
    .qr-card {
      background: #fff;
      border-radius: 18px;
      padding: 1rem;
      margin-bottom: 1rem;
      box-shadow: inset 0 0 0 1px rgba(15,23,42,0.06);
    }
    .qr-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 3px;
    }
    .qr-dot {
      width: 14px; height: 14px;
      border-radius: 2px;
      background: #e2e8f0;
    }
    .qr-dot.filled { background: #1e293b; }
    .visual-caption { display: flex; flex-direction: column; gap: 0.15rem; }
    .visual-title { color: #fff; font-size: 1rem; font-weight: 700; }
    .visual-subtitle { color: #94a3b8; font-size: 0.8rem; }
    .float-card {
      position: absolute;
      background: rgba(16,16,32,0.95);
      border: 1px solid rgba(99,102,241,0.3);
      color: #fff;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      font-size: 0.78rem;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      backdrop-filter: blur(8px);
      animation: floatBob 3s ease-in-out infinite;
    }
    .fc-1 { top: 18%; right: -20px; animation-delay: 0s; }
    .fc-2 { bottom: 22%; left: -28px; animation-delay: 1.5s; }
    @keyframes floatBob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .section { padding: 5rem 1.5rem; background: #0a0a14; }
    .section-dark { background: #06060f; }
    .section-container { max-width: 1200px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 3.5rem; }
    .section-badge {
      display: inline-block;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.3);
      color: #a78bfa;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      margin-bottom: 0.8rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .section-header h2 { font-size: clamp(1.8rem, 3vw, 2.4rem); color: #fff; font-weight: 800; margin-bottom: 0.5rem; }
    .section-header p { color: #64748b; font-size: 1rem; }
    .steps { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
    .step {
      flex: 1; min-width: 220px; max-width: 300px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 16px;
      padding: 2rem 1.5rem;
      text-align: center;
      transition: transform 0.2s, border-color 0.2s;
    }
    .step:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.4); }
    .step-number { font-size: 0.78rem; color: #6366f1; font-weight: 700; margin-bottom: 0.7rem; letter-spacing: 0.12em; }
    .step h3 { color: #e2e8f0; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .step p { color: #64748b; font-size: 0.88rem; line-height: 1.6; margin: 0; }
    .step-arrow { font-size: 1.5rem; color: #334155; flex-shrink: 0; }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    .feature-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(99,102,241,0.12);
      border-radius: 16px;
      padding: 1.75rem;
      transition: all 0.25s;
    }
    .feature-card:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.3); transform: translateY(-3px); }
    .feature-card h3 { color: #e2e8f0; font-size: 1rem; font-weight: 700; margin-bottom: 0.45rem; }
    .feature-card p { color: #64748b; font-size: 0.875rem; line-height: 1.6; margin: 0; }
    .cta-section { background: #06060f; }
    .cta-card {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08));
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 24px;
      padding: 3.5rem 2rem;
      text-align: center;
    }
    .cta-card h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); color: #fff; font-weight: 800; line-height: 1.3; margin-bottom: 0.75rem; }
    .cta-card p { color: #94a3b8; margin-bottom: 2rem; }
    @media (max-width: 1024px) {
      .hero { flex-direction: column; padding: 4rem 1.5rem; min-height: auto; }
      .hero-visual { display: none; }
    }
    @media (max-width: 640px) {
      .hero-content h1 { font-size: clamp(2.2rem, 12vw, 2.9rem); }
      .step-arrow { display: none; }
      .steps { flex-direction: column; }
      .hero-actions-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: none; }
      .hero-notes { flex-direction: column; }
    }
  `]
})
export class HomeComponent {
  qrDots = Array.from({ length: 49 }, (_, i) =>
    [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,48,9,11,24,26,36,38].includes(i)
  );
}
