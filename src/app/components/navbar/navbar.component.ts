import { Component, OnInit } from '@angular/core';
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
        <button class="nav-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links" [class.open]="menuOpen">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMenu()">Home</a></li>
          <li><a routerLink="/register" routerLinkActive="active" (click)="closeMenu()">Register</a></li>
          <li><a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">Dashboard</a></li>
          <li><a routerLink="/about" routerLinkActive="active" (click)="closeMenu()">About</a></li>
          <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Contact</a></li>
          <li><a routerLink="/scan-qr" class="nav-scan" routerLinkActive="active" (click)="closeMenu()">🔍 Scan QR</a></li>
          <li><a routerLink="/all-vehicles" routerLinkActive="active" (click)="closeMenu()">📋 All Vehicles</a></li>
          <li *ngIf="!isLoggedIn"><a routerLink="/login" routerLinkActive="active" (click)="closeMenu()">Login</a></li>
          <li *ngIf="isLoggedIn"><a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">My Dashboard</a></li>
          <li *ngIf="isLoggedIn"><button class="nav-logout" (click)="logout()">Logout</button></li>
          <li *ngIf="!isLoggedIn"><a routerLink="/register" class="nav-cta" (click)="closeMenu()">Get Your QR</a></li>
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
      background: rgba(99,102,241,0.1) !important;
      border: 1px solid rgba(99,102,241,0.3) !important;
      color: #a78bfa !important;
      border-radius: 20px !important;
      font-weight: 600 !important;
    }
    .nav-scan:hover { background: rgba(99,102,241,0.2) !important; color: #fff !important; }
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
    .nav-toggle { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
    .nav-toggle span { display: block; width: 22px; height: 2px; background: #cbd5e1; border-radius: 2px; transition: 0.3s; }
    @media (max-width: 768px) {
      .nav-toggle { display: flex; }
      .nav-links {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 64px;
        left: 0; right: 0;
        background: rgba(10,10,20,0.98);
        border-bottom: 1px solid rgba(99,102,241,0.2);
        padding: 1rem;
        gap: 0.25rem;
      }
      .nav-links.open { display: flex; }
      .nav-links a { display: block; padding: 0.65rem 1rem; }
      .nav-cta { text-align: center; margin-left: 0 !important; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  isLoggedIn = false;

  constructor(private supa: SupabaseService, private router: Router) {}

  ngOnInit() {
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
