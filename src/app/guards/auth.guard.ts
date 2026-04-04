import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async () => {
  const supa = inject(SupabaseService);
  const router = inject(Router);

  // Check Supabase session first
  const session = await supa.getSession();
  if (session) return true;

  // Fall back to localStorage session (for users who registered without OTP)
  const userId = localStorage.getItem('mq_userId');
  if (userId) return true;

  router.navigate(['/login']);
  return false;
};
