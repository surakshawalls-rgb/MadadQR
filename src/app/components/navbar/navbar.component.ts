import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-brand">
          <img src="/MadadQRLogo.png" alt="MadadQR" class="brand-logo-img" />
          <span class="brand-name">MadadQR</span>
        </a>
        <button class="nav-toggle" (click)="toggleMenu()" aria-label="Toggle navigation menu" [attr.aria-expanded]="menuOpen">
          <span></span><span></span><span></span>
        </button>
        <button
          *ngIf="menuOpen"
          class="nav-backdrop"
          type="button"
          aria-label="Close navigation menu"
          (click)="closeMenu()"
        ></button>
        <ul class="nav-links" [class.open]="menuOpen">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMenu()">Home</a></li>
          <li><a routerLink="/register" routerLinkActive="active" (click)="closeMenu()">Register Vehicle</a></li>
          <li><a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">Dashboard</a></li>
          <li><a routerLink="/about" routerLinkActive="active" (click)="closeMenu()">About</a></li>
          <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Support</a></li>
          <li><a routerLink="/scan-qr" class="nav-scan" routerLinkActive="active" (click)="closeMenu()" aria-label="Scan QR" title="Scan QR">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 8V4a1 1 0 0 1 1-1h4"/>
              <path d="M21 8V4a1 1 0 0 0-1-1h-4"/>
              <path d="M3 16v4a1 1 0 0 0 1 1h4"/>
              <path d="M21 16v4a1 1 0 0 1-1 1h-4"/>
              <path d="M2 12h20"/>
            </svg><span class="scan-label">Scan QR</span>
          </a></li>
          <li><a routerLink="/all-vehicles" routerLinkActive="active" (click)="closeMenu()">Vehicles</a></li>
          <li *ngIf="!isLoggedIn"><a routerLink="/login" routerLinkActive="active" (click)="closeMenu()">Login</a></li>
          <li *ngIf="isLoggedIn"><button class="nav-logout" (click)="logout()">Logout</button></li>
          <li *ngIf="!isLoggedIn"><a routerLink="/register" class="nav-cta" (click)="closeMenu()">Get My QR</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(10, 10, 20, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
      padding: 0 1rem;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.4rem;
      font-weight: 800;
      color: #fff;
    }
    .brand-logo-img {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      object-fit: contain;
    }
    .brand-name {
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .nav-links a {
      color: #cbd5e1;
      text-decoration: none;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { color: #fff; background: rgba(99,102,241,0.15); }
    .nav-cta {
      background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
      color: #fff !important;
      padding: 0.45rem 1.1rem !important;
      border-radius: 20px !important;
      font-weight: 600 !important;
      margin-left: 0.5rem;
    }
    .nav-cta:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 15px rgba(99,102,241,0.4); }
    .nav-scan {
      width: 40px;
      height: 40px;
      padding: 0 !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(99,102,241,0.12) !important;
      border: 1px solid rgba(99,102,241,0.28) !important;
      color: #a78bfa !important;
      border-radius: 12px !important;
      font-weight: 700 !important;
    }
    .nav-scan:hover { background: rgba(99,102,241,0.2) !important; color: #fff !important; }
    .scan-label { display: none; }
    .nav-logout {
      background: transparent;
      border: 1px solid rgba(248,113,113,0.3);
      color: #f87171;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .nav-logout:hover { background: rgba(248,113,113,0.1); }
    .nav-toggle { display: none; flex-direction: column; gap: 5px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); cursor: pointer; padding: 10px; border-radius: 12px; }
    .nav-toggle span { display: block; width: 22px; height: 2px; background: #cbd5e1; border-radius: 2px; transition: 0.3s; }
    .nav-backdrop { display: none; }
    @media (max-width: 768px) {
      .nav-toggle { display: flex; }
      .nav-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        top: calc(64px + env(safe-area-inset-top, 0px));
        background: rgba(0,0,0,0.28);
        border: 0;
        margin: 0;
        padding: 0;
        z-index: 998;
      }
      .nav-links {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 64px;
        left: 0; right: 0;
        background: rgba(10,10,20,0.98);
        border-bottom: 1px solid rgba(99,102,241,0.2);
        padding: 0.75rem 1rem 1rem;
        gap: 0.25rem;
        max-height: calc(100dvh - 64px);
        overflow-y: auto;
        box-shadow: 0 18px 40px rgba(0,0,0,0.35);
        z-index: 999;
      }
      .nav-links.open { display: flex; }
      .nav-links li { width: 100%; }
      .nav-links a { display: flex; align-items: center; min-height: 44px; padding: 0.65rem 1rem; }
      .nav-scan { width: auto; height: auto; padding: 0.65rem 1rem !important; border-radius: 8px !important; justify-content: flex-start; }
      .scan-label { display: inline; margin-left: 0.65rem; }
      .nav-cta { text-align: center; margin-left: 0 !important; }
      .nav-logout { width: 100%; min-height: 44px; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  isLoggedIn = false;

  constructor(
    private supa: SupabaseService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check initial state
    this.isLoggedIn = !!localStorage.getItem('mq_userId');
    // Subscribe to auth changes
    this.supa.onAuthStateChange(session => {
      this.isLoggedIn = !!session || !!localStorage.getItem('mq_userId');
    });
  }

  async logout() {
    await this.supa.signOut();
    this.supa.clearRegistrationSessions();
    this.isLoggedIn = false;
    this.closeMenu();
    this.router.navigate(['/']);
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
}
