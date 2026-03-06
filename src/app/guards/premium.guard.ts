import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PerfilService } from '../services/perfil.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const premiumGuard: CanActivateFn = () => {
  const perfilService = inject(PerfilService);
  const router = inject(Router);

  return perfilService.getPerfil().pipe(
    map(perfil => {
      const plan = perfil.planNombre?.toLowerCase();
      if (plan === 'premium' || plan === 'max') {
        return true;
      }
      router.navigate(['/dashboard']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/dashboard']);
      return of(false);
    })
  );
};
