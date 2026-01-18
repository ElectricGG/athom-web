import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:5041/api/Auth/login';
  private userData$ = new BehaviorSubject<any>(this.getUserDataFromStorage());
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private saveUserData(data: any): void {
    if (this.isBrowser) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userData', JSON.stringify(data));
      this.userData$.next(data);
    }
  }

  private getUserDataFromStorage(): any {
    if (this.isBrowser) {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  login(credentials: { email: string; contrasena: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap(response => {
        this.saveUserData(response);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
    }
    this.userData$.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    const token = localStorage.getItem('accessToken');
    // Aquí podrías agregar lógica para verificar la expiración del token
    return !!token;
  }

  getUserData(): Observable<any> {
    return this.userData$.asObservable();
  }

  getAccessToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('accessToken');
  }
}
