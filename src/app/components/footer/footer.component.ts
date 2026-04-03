import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <span class="brand-logo">🔳 MadadQR</span>
          <p>Madad bas ek scan door</p>
        </div>
        <div class="footer-links">
          <a routerLink="/about">About</a>
          <a routerLink="/contact">Contact</a>
          <a routerLink="/privacy">Privacy</a>
          <a routerLink="/register">Get QR</a>
        </div>
        <div class="footer-copy">
          <p>© 2026 MadadQR. Designed for India 🇮🇳</p>
          <p><a href="mailto:madadqr@gmail.com">madadqr@gmail.com</a></p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #06060f;
      border-top: 1px solid rgba(99,102,241,0.15);
      padding: 2.5rem 1rem 1.5rem;
      margin-top: auto;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      align-items: flex-start;
      justify-content: space-between;
    }
    .footer-brand .brand-logo {
      font-size: 1.2rem;
      font-weight: 800;
      color: #fff;
    }
    .footer-brand p {
      color: #64748b;
      margin-top: 0.3rem;
      font-size: 0.85rem;
    }
    .footer-links {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
    }
    .footer-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    .footer-links a:hover { color: #a78bfa; }
    .footer-copy { text-align: right; }
    .footer-copy p { color: #475569; font-size: 0.82rem; margin: 0.15rem 0; }
    .footer-copy a { color: #6366f1; text-decoration: none; }
    @media (max-width: 640px) {
      .footer-copy { text-align: left; }
    }
  `]
})
export class FooterComponent {}
