import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <div class="contact-page">
      <div class="page-container">
        <div class="page-header">
          <div class="page-badge">Get in Touch</div>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-icon">📧</div>
            <h3>Email Us</h3>
            <p>For support, feedback, or partnership queries</p>
            <a href="mailto:madadqr@gmail.com" class="contact-link">madadqr&#64;gmail.com</a>
          </div>
          <div class="contact-card">
            <div class="contact-icon">⏱️</div>
            <h3>Response Time</h3>
            <p>We typically respond within 24-48 hours on working days</p>
          </div>
          <div class="contact-card">
            <div class="contact-icon">🇮🇳</div>
            <h3>Based in India</h3>
            <p>Serving vehicle owners across India with pride</p>
          </div>
        </div>
        <div class="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-item" *ngFor="let faq of faqs">
            <h4>{{ faq.q }}</h4>
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule],
  styles: [`
    .contact-page { background: #0a0a14; min-height: calc(100vh - 64px); padding: 3rem 1.5rem; }
    .page-container { max-width: 840px; margin: 0 auto; }
    .page-header { text-align: center; margin-bottom: 3rem; }
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
    .page-header p { color: #64748b; }
    .contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 3rem; }
    .contact-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 16px;
      padding: 1.75rem;
      text-align: center;
      transition: all 0.2s;
    }
    .contact-card:hover { border-color: rgba(99,102,241,0.35); transform: translateY(-3px); }
    .contact-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .contact-card h3 { color: #e2e8f0; font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .contact-card p { color: #64748b; font-size: 0.85rem; line-height: 1.6; margin-bottom: 0.75rem; }
    .contact-link { color: #6366f1; font-weight: 600; text-decoration: none; font-size: 0.9rem; }
    .contact-link:hover { color: #a78bfa; }
    .faq-section h2 { color: #fff; font-size: 1.3rem; font-weight: 800; margin-bottom: 1.5rem; }
    .faq-item {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(99,102,241,0.12);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 0.75rem;
    }
    .faq-item h4 { color: #e2e8f0; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.4rem; }
    .faq-item p { color: #64748b; font-size: 0.88rem; line-height: 1.6; margin: 0; }
    @media (max-width: 640px) { .contact-grid { grid-template-columns: 1fr; } }
  `]
})
export class ContactComponent {
  faqs = [
    { q: 'Is MadadQR free to use?', a: 'Yes! MadadQR is completely free for vehicle owners. Register your vehicle and get your QR code at no cost.' },
    { q: 'Does the scanner need to download an app?', a: 'No. Anyone with a smartphone camera can scan the QR code. No app installation required.' },
    { q: 'How secure is my data?', a: 'Your data is stored securely and is only used for emergency communication. We never publicly display your full mobile number.' },
    { q: 'Can I register multiple vehicles?', a: 'Yes! You can register multiple vehicles. Each vehicle gets its own unique QR code.' },
    { q: 'What happens when someone scans my QR?', a: 'They see your vehicle number and owner name, and can choose to call you, send an emergency alert, or report a parking issue.' }
  ];
}
