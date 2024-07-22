import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedOut()) {
    router.navigate(['/home']);
    return false;
  } else {
    const userRole = authService.getUserInfo()?.role;
    if (userRole != "Administrator") {
      router.navigate(['/home']);
      return false;
    }
    return true;
  }
};
