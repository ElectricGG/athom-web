import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:5041/api/Auth/login';
  private logoutUrl = 'http://localhost:5041/api/Auth/logout';
  private isBrowser: boolean;

  private currentUserDataSubject: BehaviorSubject<any | null>;
  public currentUserData: Observable<any | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentUserDataSubject = new BehaviorSubject<any | null>(this.getStoredUserData());
    this.currentUserData = this.currentUserDataSubject.asObservable();
  }

  private getStorage(): Storage | null {
    if (!this.isBrowser) return null;
    if (localStorage.getItem('accessToken')) {
      return localStorage;
    }
    if (sessionStorage.getItem('accessToken')) {
      return sessionStorage;
    }
    return null;
  }

  private getStoredUserData(): any | null {
    const storage = this.getStorage();
    if (storage) {
      const userData = storage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  private saveUserData(data: any, rememberMe: boolean): void {
    if (!this.isBrowser) return;

    const storage = rememberMe ? localStorage : sessionStorage;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userData');

    storage.setItem('accessToken', data.accessToken);
    storage.setItem('userData', JSON.stringify(data));
    this.currentUserDataSubject.next(data);
  }

  login(credentials: { numeroWhatsapp: string; contrasena: string }, rememberMe: boolean): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap(response => {
        this.saveUserData(response, rememberMe);
      })
    );
  }

  logout(): void {
    if (!this.isBrowser) return;

    const userData = this.getStoredUserData();
    const refreshToken = userData?.refreshToken;

    const cleanup = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userData');
      this.currentUserDataSubject.next(null);
      this.router.navigate(['/login']);
    };

    if (refreshToken) {
      this.http.post(this.logoutUrl, { refreshToken }).pipe(
        finalize(cleanup)
      ).subscribe({
        next: () => console.log('Successfully logged out on server.'),
        error: (err) => console.error('Server logout failed, but logging out client-side.', err)
      });
    } else {
      cleanup();
    }
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    const storage = this.getStorage();
    return storage ? storage.getItem('accessToken') : null;
  }
}
