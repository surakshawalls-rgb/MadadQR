import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="home">

      <!-- HERO -->
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-content">
          <div class="hero-badge">🇮🇳 Made for India</div>
          <h1>
            MadadQR<br>
            <span class="gradient-text">Madad bas ek scan door</span>
          </h1>
          <p class="hero-subtitle">
            Accident, parking issue, ya emergency?<br>
            Ek simple QR scan se turant owner ya family tak pahunch.
          </p>
          <div class="hero-actions">
            <a routerLink="/register" class="btn-primary">
              <span>Get Your QR</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a routerLink="/scan-qr" class="btn-secondary">🔍 Scan a QR</a>
            <a href="#how-it-works" class="btn-secondary">See How It Works</a>
          </div>
          <div class="hero-stats">
            <div class="stat"><span class="stat-num">100%</span><span>Free</span></div>
            <div class="stat-divider"></div>
            <div class="stat"><span class="stat-num">No App</span><span>Required</span></div>
            <div class="stat-divider"></div>
            <div class="stat"><span class="stat-num">Works on</span><span>Any Phone</span></div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="phone-mockup">
            <div class="phone-screen">
              <div class="scan-demo">
                <div class="qr-placeholder">
                  <div class="qr-grid">
                    <div *ngFor="let i of qrDots" class="qr-dot" [class.filled]="i"></div>
                  </div>
                </div>
                <p class="scan-label">🔳 Scan QR</p>
              </div>
            </div>
          </div>
          <div class="float-card fc-1">🚨 Emergency Alert Sent!</div>
          <div class="float-card fc-2">📞 Connecting to Owner…</div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="section" id="how-it-works">
        <div class="section-container">
          <div class="section-header">
            <div class="section-badge">Simple Process</div>
            <h2>3 Steps to Safety</h2>
            <p>Setup in minutes. Works forever.</p>
          </div>
          <div class="steps">
            <div class="step">
              <div class="step-icon">📝</div>
              <div class="step-number">01</div>
              <h3>Register & Generate</h3>
              <p>Register your vehicle and generate a unique QR code instantly</p>
            </div>
            <div class="step-arrow">→</div>
            <div class="step">
              <div class="step-icon">🏷️</div>
              <div class="step-number">02</div>
              <h3>Stick on Vehicle</h3>
              <p>Download and stick the QR sticker on your vehicle's windshield</p>
            </div>
            <div class="step-arrow">→</div>
            <div class="step">
              <div class="step-icon">⚡</div>
              <div class="step-number">03</div>
              <h3>Get Instant Help</h3>
              <p>Anyone can scan and instantly reach you or your emergency contacts</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="section section-dark">
        <div class="section-container">
          <div class="section-header">
            <div class="section-badge">Features</div>
            <h2>Everything You Need</h2>
            <p>Designed to help fast, without any friction</p>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🚨</div>
              <h3>Emergency Alert</h3>
              <p>Ek click se family aur emergency contacts ko turant SMS alert bhejega</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📞</div>
              <h3>Direct Call</h3>
              <p>Owner ko directly call karo — bina kisi app ke, instantly</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🚗</div>
              <h3>Parking Solution</h3>
              <p>Vehicle block ho? Conflict nahi — directly owner ko message bhejo</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💬</div>
              <h3>WhatsApp Alert</h3>
              <p>WhatsApp pe direct message — bilkul simple aur fast</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3>Privacy First</h3>
              <p>Aapka data sirf emergency communication ke liye use hoga</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Works Everywhere</h3>
              <p>Koi bhi phone, koi bhi camera — koi app install karne ki zarurat nahi</p>
            </div>
          </div>
        </div>
      </section>

      <!-- WHY MADADQR -->
      <section class="section">
        <div class="section-container">
          <div class="why-grid">
            <div class="why-content">
              <div class="section-badge">Why MadadQR</div>
              <h2>Designed for <span class="gradient-text">Real India</span></h2>
              <ul class="why-list">
                <li><span class="check">✓</span> No app required — works with any camera</li>
                <li><span class="check">✓</span> Works on any phone, any network</li>
                <li><span class="check">✓</span> Fast & simple — no login for scanner</li>
                <li><span class="check">✓</span> Instant SMS & WhatsApp alerts</li>
                <li><span class="check">✓</span> Emergency contacts notified automatically</li>
                <li><span class="check">✓</span> Completely free for vehicle owners</li>
              </ul>
            </div>
            <div class="why-visual">
              <div class="testimonial-card">
                <div class="t-stars">★★★★★</div>
                <p>"Accident ke baad kisi ne QR scan kiya aur meri family ko turant message pahunch gaya. Life saver!"</p>
                <div class="t-author">— Vehicle Owner, Mumbai</div>
              </div>
              <div class="trust-badges">
                <div class="trust-badge">🛡️ Secure</div>
                <div class="trust-badge">⚡ Instant</div>
                <div class="trust-badge">🆓 Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DOWNLOAD APP SECTION -->
      <section class="section section-dark">
        <div class="section-container">
          <div class="download-grid">
            <div class="download-content">
              <div class="section-badge">📱 Mobile App</div>
              <h2>Download <span class="gradient-text">MadadQR App</span></h2>
              <p>Get the full experience — scan QR codes, manage your vehicles, and receive instant alerts — all in one app.</p>
              <ul class="download-features">
                <li>⚡ Fastest QR scanning with live camera</li>
                <li>🔔 Push notifications for alerts</li>
                <li>📊 Full dashboard on your phone</li>
                <li>🔒 Secure & lightweight</li>
              </ul>
              <div class="download-actions">
                <a href="/MadadQR.apk" download="MadadQR.apk" class="btn-download-apk">
                  <span class="apk-icon">🤖</span>
                  <div class="apk-text">
                    <span class="apk-sub">Download for</span>
                    <span class="apk-main">Android APK</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </a>
                <div class="apk-note">
                  <span>⚠️ Enable "Install from unknown sources" in your Android settings before installing.</span>
                </div>
              </div>
            </div>
            <div class="download-visual">
              <div class="app-preview-card">
                <img src="/MadadQRLogo.png" alt="MadadQR App" class="app-logo-large" />
                <div class="app-name">MadadQR</div>
                <div class="app-tagline">Madad bas ek scan door</div>
                <div class="app-rating">★★★★★ <span>India's Vehicle Safety App</span></div>
                <a href="/MadadQR.apk" download="MadadQR.apk" class="btn-download-inline">
                  📥 Download APK
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA SECTION -->
      <section class="section cta-section">
        <div class="section-container">
          <div class="cta-card">
            <div class="cta-glow"></div>
            <h2>Apni aur apno ki suraksha ke liye<br><span class="gradient-text">aaj hi MadadQR lagaye</span></h2>
            <p>Free registration. Takes less than 2 minutes.</p>
            <a routerLink="/register" class="btn-primary btn-large">
              <span>Register Now — It's Free</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .home { min-height: 100vh; }

    /* HERO */
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
      min-height: 90vh;
    }
    .hero-glow {
      position: absolute;
      top: -200px; left: -200px;
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-content { flex: 1; max-width: 580px; z-index: 1; }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.3);
      color: #a78bfa;
      padding: 0.35rem 0.9rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      letter-spacing: 0.05em;
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
      font-size: 1.1rem;
      color: #94a3b8;
      line-height: 1.7;
      margin-bottom: 2rem;
    }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      padding: 0.85rem 1.8rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.25s;
      box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.5); }
    .btn-primary.btn-large { padding: 1rem 2.2rem; font-size: 1.1rem; }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.12);
      color: #cbd5e1;
      padding: 0.85rem 1.8rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.25s;
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .hero-stats { display: flex; align-items: center; gap: 1.5rem; }
    .stat { display: flex; flex-direction: column; gap: 0.1rem; }
    .stat-num { font-size: 1.1rem; font-weight: 800; color: #fff; }
    .stat span:last-child { font-size: 0.75rem; color: #64748b; }
    .stat-divider { width: 1px; height: 30px; background: rgba(255,255,255,0.1); }
    .hero-visual { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; }
    .phone-mockup {
      width: 220px; height: 420px;
      background: linear-gradient(135deg, #1e1e2e, #16213e);
      border-radius: 36px;
      border: 2px solid rgba(99,102,241,0.3);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(99,102,241,0.1);
      position: relative;
      z-index: 2;
    }
    .phone-screen { padding: 1.5rem; text-align: center; width: 100%; }
    .qr-placeholder {
      background: #fff;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 0.75rem;
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
    .scan-label { color: #94a3b8; font-size: 0.8rem; font-weight: 600; }
    .float-card {
      position: absolute;
      background: rgba(16,16,32,0.95);
      border: 1px solid rgba(99,102,241,0.3);
      color: #fff;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      backdrop-filter: blur(8px);
      animation: floatBob 3s ease-in-out infinite;
    }
    .fc-1 { top: 20%; right: -10px; animation-delay: 0s; }
    .fc-2 { bottom: 25%; left: -20px; animation-delay: 1.5s; }
    @keyframes floatBob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    /* SECTIONS */
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

    /* STEPS */
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
    .step-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .step-number { font-size: 0.75rem; color: #6366f1; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: 0.1em; }
    .step h3 { color: #e2e8f0; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .step p { color: #64748b; font-size: 0.88rem; line-height: 1.6; margin: 0; }
    .step-arrow { font-size: 1.5rem; color: #334155; flex-shrink: 0; }

    /* FEATURES */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
    .feature-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .feature-card h3 { color: #e2e8f0; font-size: 1rem; font-weight: 700; margin-bottom: 0.4rem; }
    .feature-card p { color: #64748b; font-size: 0.875rem; line-height: 1.6; margin: 0; }

    /* WHY */
    .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    .why-content .section-badge { display: inline-block; }
    .why-content h2 { font-size: clamp(1.8rem, 3vw, 2.4rem); color: #fff; font-weight: 800; margin: 0.5rem 0 1.5rem; }
    .why-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.85rem; }
    .why-list li { display: flex; align-items: center; gap: 0.75rem; color: #cbd5e1; font-size: 0.95rem; }
    .check { color: #a78bfa; font-weight: 700; font-size: 1rem; flex-shrink: 0; }
    .testimonial-card {
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 1rem;
    }
    .t-stars { color: #f59e0b; font-size: 1rem; margin-bottom: 0.75rem; }
    .testimonial-card p { color: #cbd5e1; font-size: 0.9rem; line-height: 1.7; font-style: italic; margin-bottom: 0.75rem; }
    .t-author { color: #6366f1; font-size: 0.82rem; font-weight: 600; }
    .trust-badges { display: flex; gap: 0.75rem; }
    .trust-badge {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      color: #94a3b8;
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    /* DOWNLOAD APP */
    .download-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    .download-content h2 { font-size: clamp(1.8rem, 3vw, 2.4rem); color: #fff; font-weight: 800; margin: 0.5rem 0 1rem; }
    .download-content p { color: #94a3b8; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.25rem; }
    .download-features { list-style: none; padding: 0; margin: 0 0 1.75rem; display: flex; flex-direction: column; gap: 0.6rem; }
    .download-features li { color: #cbd5e1; font-size: 0.9rem; }
    .btn-download-apk { display: inline-flex; align-items: center; gap: 1rem; background: linear-gradient(135deg, #059669, #10b981); color: #fff; text-decoration: none; padding: 1rem 1.5rem; border-radius: 14px; font-weight: 700; transition: all 0.25s; box-shadow: 0 4px 20px rgba(16,185,129,0.3); margin-bottom: 0.75rem; }
    .btn-download-apk:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(16,185,129,0.5); }
    .apk-icon { font-size: 1.75rem; }
    .apk-text { display: flex; flex-direction: column; gap: 0.1rem; }
    .apk-sub { font-size: 0.72rem; opacity: 0.8; }
    .apk-main { font-size: 1rem; font-weight: 800; }
    .apk-note { color: #64748b; font-size: 0.78rem; line-height: 1.5; max-width: 320px; }
    .download-visual { display: flex; justify-content: center; }
    .app-preview-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(99,102,241,0.2); border-radius: 24px; padding: 2.5rem 2rem; text-align: center; max-width: 280px; width: 100%; }
    .app-logo-large { width: 100px; height: 100px; border-radius: 22px; object-fit: contain; margin-bottom: 1rem; box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
    .app-name { color: #fff; font-size: 1.2rem; font-weight: 800; margin-bottom: 0.2rem; }
    .app-tagline { color: #64748b; font-size: 0.8rem; margin-bottom: 0.75rem; }
    .app-rating { color: #f59e0b; font-size: 0.82rem; margin-bottom: 1.25rem; }
    .app-rating span { color: #64748b; }
    .btn-download-inline { display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: #fff; padding: 0.65rem 1.4rem; border-radius: 10px; font-weight: 700; font-size: 0.9rem; text-decoration: none; transition: all 0.2s; }
    .btn-download-inline:hover { opacity: 0.9; transform: translateY(-1px); }

    /* CTA */
    .cta-section { background: #06060f; }    .cta-card {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08));
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 24px;
      padding: 4rem 2rem;
      text-align: center;
    }
    .cta-glow {
      position: absolute;
      top: -100px; left: 50%; transform: translateX(-50%);
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .cta-card h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); color: #fff; font-weight: 800; line-height: 1.3; margin-bottom: 0.75rem; position: relative; z-index: 1; }
    .cta-card p { color: #94a3b8; margin-bottom: 2rem; position: relative; z-index: 1; }
    .cta-card .btn-primary { position: relative; z-index: 1; }

    @media (max-width: 1024px) {
      .hero { flex-direction: column; padding: 4rem 1.5rem; min-height: auto; }
      .hero-visual { display: none; }
      .why-grid { grid-template-columns: 1fr; }
      .download-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .step-arrow { display: none; }
      .steps { flex-direction: column; }
    }
  `]
})
export class HomeComponent {
  qrDots = Array.from({ length: 49 }, (_, i) =>
    [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,48,9,11,24,26,36,38].includes(i)
  );
}
