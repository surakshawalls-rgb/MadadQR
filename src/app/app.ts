import { Component, Inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp, type BackButtonListenerEvent } from '@capacitor/app';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="app-splash" *ngIf="showSplash()" role="status" aria-live="polite" aria-label="MadadQR is loading">
      <div class="splash-glow splash-glow-one"></div><div class="splash-glow splash-glow-two"></div>
      <div class="splash-content">
        <img src="/MadadQRLogo.png" alt="" class="splash-logo" />
        <div class="splash-name">Madad<span>QR</span></div>
        <p>Scan. Connect. Help.</p>
        <div class="splash-progress"><span></span></div>
        <small>Preparing a safer way to stay connected</small>
      </div>
    </div>
    <div class="route-progress" [class.visible]="navigating()" aria-hidden="true"><span></span></div>
    <div class="app-shell" [class.app-ready]="!showSplash()">
      <app-navbar></app-navbar>
      <main><router-outlet></router-outlet></main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    main { flex: 1; }
    .app-shell { display: flex; flex-direction: column; min-height: 100vh; opacity: 0; }
    .app-shell.app-ready { opacity: 1; transition: opacity 0.35s ease; }
    .app-splash { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; overflow: hidden; background: #080811; color: #fff; }
    .splash-content { position: relative; z-index: 1; width: min(86vw, 420px); text-align: center; animation: splashIn 0.65s ease both; }
    .splash-logo { width: 82px; height: 82px; padding: 8px; object-fit: contain; border-radius: 22px; background: rgba(255,255,255,0.06); border: 1px solid rgba(167,139,250,0.25); box-shadow: 0 18px 55px rgba(99,102,241,0.28); margin-bottom: 1.1rem; }
    .splash-name { font-size: clamp(2.8rem, 11vw, 4.6rem); font-weight: 900; line-height: 1; letter-spacing: -0.065em; }
    .splash-name span { color: #a78bfa; text-shadow: 0 0 32px rgba(139,92,246,0.5); }
    .splash-content p { margin: 0.75rem 0 1.75rem; color: #cbd5e1; font-size: 1rem; font-weight: 650; letter-spacing: 0.12em; text-transform: uppercase; }
    .splash-content small { display: block; margin-top: 0.8rem; color: #64748b; font-size: 0.75rem; }
    .splash-progress { width: min(240px, 70vw); height: 3px; margin: auto; overflow: hidden; border-radius: 99px; background: rgba(255,255,255,0.08); }
    .splash-progress span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg,#6366f1,#a78bfa,#22d3ee); animation: splashLoad 1.4s cubic-bezier(.2,.8,.2,1) both; }
    .splash-glow { position: absolute; width: 45vw; height: 45vw; border-radius: 50%; filter: blur(90px); opacity: 0.18; }
    .splash-glow-one { top: -20%; left: -12%; background: #6366f1; } .splash-glow-two { right: -16%; bottom: -24%; background: #7c3aed; }
    .route-progress { position: fixed; z-index: 10000; top: env(safe-area-inset-top, 0px); left: 0; right: 0; height: 3px; opacity: 0; pointer-events: none; transition: opacity .2s; }
    .route-progress.visible { opacity: 1; } .route-progress span { display: block; width: 40%; height: 100%; background: linear-gradient(90deg,#6366f1,#a78bfa,#22d3ee); animation: routeLoad 1s ease-in-out infinite; }
    @keyframes splashIn { from { opacity: 0; transform: translateY(10px) scale(.97); } }
    @keyframes splashLoad { from { width: 0; } to { width: 100%; } }
    @keyframes routeLoad { from { transform: translateX(-110%); } to { transform: translateX(260%); } }
    @media (prefers-reduced-motion: reduce) { .splash-content, .splash-progress span, .route-progress span { animation: none; } .splash-progress span { width: 100%; } }
  `]
})
export class App implements OnDestroy {
  readonly showSplash = signal(false);
  readonly navigating = signal(false);
  private navigationSubscription?: Subscription;
  private backButtonListener?: Promise<{ remove: () => Promise<void> }>;

  constructor(@Inject(PLATFORM_ID) platformId: object, router: Router) {
    if (!isPlatformBrowser(platformId)) return;

    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
      document.body.classList.add('native-android');
      this.backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }: BackButtonListenerEvent) => {
        if (canGoBack) {
          window.history.back();
          return;
        }

        if (window.confirm('Do you want to close MadadQR?')) {
          CapacitorApp.exitApp();
        }
      });
    }

    this.showSplash.set(true);
    window.setTimeout(() => this.showSplash.set(false), 1550);
    this.navigationSubscription = router.events.subscribe(event => {
      if (event instanceof NavigationStart && !this.showSplash()) this.navigating.set(true);
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) this.navigating.set(false);
    });
  }

  ngOnDestroy() {
    this.navigationSubscription?.unsubscribe();
    if (this.backButtonListener) {
      this.backButtonListener.then(listener => listener.remove());
    }
  }
}
