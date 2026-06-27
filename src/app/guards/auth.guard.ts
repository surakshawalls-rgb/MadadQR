import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = async () => {
  const supa = inject(SupabaseService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check Supabase session first
  const session = await supa.getSession();
  if (session) return true;

  // Fall back to localStorage session (for users who registered without OTP)
  if (!isPlatformBrowser(platformId)) {
    return false;
  }
  const userId = localStorage.getItem('mq_userId');
  if (userId) return true;

  router.navigate(['/login']);
  return false;
};
