import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <div class="privacy-page">
      <div class="page-container">
        <div class="page-header">
          <div class="page-badge">Legal</div>
          <h1>Privacy Policy</h1>
          <p class="last-updated">Last updated: April 2026</p>
        </div>
        <div class="content-card">
          <div class="privacy-summary">
            <span class="shield">🔒</span>
            <p>We do not share your personal data publicly. Information is used only for emergency communication.</p>
          </div>

          <h2>Information We Collect</h2>
          <p>When you register on MadadQR, we collect:</p>
          <ul>
            <li>Your name and mobile number</li>
            <li>Vehicle registration number</li>
            <li>Emergency contact names and mobile numbers</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>Display vehicle number and owner name on the public scan page</li>
            <li>Enable emergency alert communication via WhatsApp/SMS</li>
            <li>Allow direct calling through the tel: protocol</li>
          </ul>

          <h2>What Is Publicly Visible</h2>
          <p>
            When someone scans your QR code, they can see your <strong>vehicle number</strong> and <strong>owner name</strong>.
            Your full mobile number is not displayed publicly on the scan page — it is only accessible through the
            direct call or WhatsApp button actions.
          </p>

          <h2>Data Storage & Security</h2>
          <p>
            All data is stored on Supabase (hosted in a secure cloud environment). We use industry-standard
            security practices to protect your data. We do not sell or share your data with third parties.
          </p>

          <h2>Your Rights</h2>
          <p>
            You can request deletion or modification of your data at any time by contacting us at
            <a href="mailto:madadqr@gmail.com">madadqr&#64;gmail.com</a>.
          </p>

          <h2>Contact</h2>
          <p>
            For any privacy-related queries, email us at
            <a href="mailto:madadqr@gmail.com">madadqr&#64;gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .privacy-page { background: #0a0a14; min-height: calc(100vh - 64px); padding: 3rem 1.5rem; }
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
    .page-header h1 { color: #fff; font-size: 2rem; font-weight: 800; margin-bottom: 0.3rem; }
    .last-updated { color: #475569; font-size: 0.82rem; }
    .content-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 20px;
      padding: 2.5rem;
    }
    .privacy-summary {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 2rem;
    }
    .shield { font-size: 1.5rem; flex-shrink: 0; }
    .privacy-summary p { color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0; }
    h2 { color: #e2e8f0; font-size: 1.05rem; font-weight: 700; margin: 1.75rem 0 0.6rem; }
    p { color: #94a3b8; font-size: 0.92rem; line-height: 1.75; margin-bottom: 0.5rem; }
    strong { color: #e2e8f0; }
    a { color: #6366f1; text-decoration: none; }
    a:hover { color: #a78bfa; }
    ul { padding-left: 1.25rem; margin: 0 0 0.5rem; }
    li { color: #94a3b8; font-size: 0.92rem; line-height: 1.75; }
  `]
})
export class PrivacyComponent {}
