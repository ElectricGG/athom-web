import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

const PUBLIC_ENDPOINTS = ['/api/Auth/', '/api/Usuarios', '/api/auth/whatsapp/'];

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublicEndpoint(req.url)) {
        return handleUnauthorizedError(req, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function handleUnauthorizedError(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = authService.getRefreshToken();

    if (!refreshToken) {
      return handleRefreshFailure(authService, router);
    }

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken);
        return retryRequest(req, next, response.accessToken);
      }),
      catchError(() => {
        isRefreshing = false;
        return handleRefreshFailure(authService, router);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => retryRequest(req, next, token))
  );
}

function retryRequest(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  token: string
): Observable<any> {
  const clonedRequest = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(clonedRequest);
}

function handleRefreshFailure(authService: AuthService, router: Router): Observable<never> {
  authService.clearSession();
  router.navigate(['/login']);
  return throwError(() => new Error('Session expired'));
}

function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
}
