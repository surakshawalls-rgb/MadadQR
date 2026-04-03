import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="about-page">
      <div class="page-container">
        <div class="page-header">
          <div class="page-badge">About Us</div>
          <h1>About MadadQR</h1>
        </div>
        <div class="content-card">
          <p class="lead">
            MadadQR is a simple safety solution designed to help people connect during emergencies.
            With just one scan, anyone can inform the vehicle owner or their family quickly.
          </p>
          <h2>Our Mission</h2>
          <p>
            In India, thousands of vehicles face emergencies every day — accidents, breakdowns, or even parking disputes.
            MadadQR bridges the gap between a stranded vehicle and its owner, using the simplest technology available: a QR code.
          </p>
          <h2>How We Help</h2>
          <ul>
            <li>🚨 Instant emergency alerts to owner and family</li>
            <li>📞 Direct call to vehicle owner without app</li>
            <li>🚗 Parking dispute resolution without confrontation</li>
            <li>💬 WhatsApp alerts for quick communication</li>
            <li>🔒 Privacy-first — no data shared publicly</li>
          </ul>
          <h2>Our Philosophy</h2>
          <p>
            <strong>Simple. Fast. No login friction. Mobile-first.</strong><br>
            We believe safety tools should work for everyone — regardless of tech literacy, phone model, or network speed.
            MadadQR works on any camera-equipped smartphone, without installing any app.
          </p>
          <div class="cta-section">
            <a routerLink="/register" class="btn-cta">Get Your Free QR Code →</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-page { background: #0a0a14; min-height: calc(100vh - 64px); padding: 3rem 1.5rem; }
    .page-container { max-width: 720px; margin: 0 auto; }
    .page-header { text-align: center; margin-bottom: 2.5rem; }
    .page-badge {
      display: inline-block;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.3);
      color: #a78bfa;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.75rem;
    }
    .page-header h1 { color: #fff; font-size: 2rem; font-weight: 800; }
    .content-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 20px;
      padding: 2.5rem;
    }
    .lead { color: #cbd5e1; font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; }
    h2 { color: #e2e8f0; font-size: 1.15rem; font-weight: 700; margin: 1.75rem 0 0.75rem; }
    p { color: #94a3b8; font-size: 0.95rem; line-height: 1.75; margin-bottom: 0.5rem; }
    strong { color: #e2e8f0; }
    ul { padding-left: 0; list-style: none; margin: 0 0 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; }
    li { color: #94a3b8; font-size: 0.92rem; }
    .cta-section { margin-top: 2rem; text-align: center; }
    .btn-cta {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      padding: 0.8rem 1.8rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.95rem;
      display: inline-block;
      transition: all 0.2s;
    }
    .btn-cta:hover { opacity: 0.9; transform: translateY(-2px); }
  `]
})
export class AboutComponent {}
