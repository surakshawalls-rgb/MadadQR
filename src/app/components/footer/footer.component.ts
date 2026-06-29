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
          <span class="brand-logo"><img src="/MadadQRLogo.png" alt="MadadQR" style="width:28px;height:28px;border-radius:6px;object-fit:contain;vertical-align:middle;margin-right:6px;" /> MadadQR</span>
          <p>Helping people reach vehicle owners when it matters.</p>
        </div>
        <div class="footer-links">
          <a routerLink="/about">About</a>
          <a routerLink="/contact">Contact</a>
          <a routerLink="/privacy">Privacy</a>
          <a routerLink="/register">Get QR</a>
          <a href="/MadadQR.apk" download="MadadQR.apk">Download App</a>
        </div>
        <div class="footer-copy">
          <p>© 2026 MadadQR. Built for reliable everyday use.</p>
          <p><a href="mailto:madadqr@gmail.com">madadqr@gmail.com</a></p>
          <p class="footer-credit">Designed and developed by <a href="https://www.surakshawalls.space/software" target="_blank" rel="noopener noreferrer">Suraksha Software</a></p>
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
    .footer-credit { color: #64748b; }
    .footer-credit a { color: #a78bfa; font-weight: 700; }
    @media (max-width: 640px) {
      .footer { padding: 2rem 1rem 1.25rem; }
      .footer-container { flex-direction: column; align-items: center; gap: 1.5rem; text-align: center; }
      .footer-brand { max-width: 320px; }
      .footer-links { justify-content: center; gap: 0.75rem 1.25rem; }
      .footer-links a { min-height: 36px; display: inline-flex; align-items: center; }
      .footer-copy { width: 100%; text-align: center; }
    }
  `]
})
export class FooterComponent {}
