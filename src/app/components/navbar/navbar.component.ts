import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-brand">
          <span class="brand-icon">🔳</span>
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
          <li><a routerLink="/register" class="nav-cta" (click)="closeMenu()">Get Your QR</a></li>
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
    .brand-icon { font-size: 1.4rem; }
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
export class NavbarComponent {
  menuOpen = false;
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
}
