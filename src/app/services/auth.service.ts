import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

interface AuthResponse {
  usuarioId: number;
  numeroWhatsapp: string;
  nombreUsuario: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:5041/api/Auth';
  private readonly isBrowser: boolean;

  private currentUserDataSubject: BehaviorSubject<AuthResponse | null>;
  public currentUserData: Observable<AuthResponse | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentUserDataSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUserData());
    this.currentUserData = this.currentUserDataSubject.asObservable();
  }

  login(credentials: { numeroWhatsapp: string; contrasena: string }, rememberMe: boolean): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => this.saveUserData(response, rememberMe))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const currentRefreshToken = this.getRefreshToken();
    const useLocalStorage = this.isUsingLocalStorage();

    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, {
      refreshToken: currentRefreshToken
    }).pipe(
      tap(response => this.saveUserData(response, useLocalStorage))
    );
  }

  logout(): void {
    if (!this.isBrowser) return;

    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.http.post(`${this.baseUrl}/logout`, { refreshToken }).pipe(
        finalize(() => this.clearSession())
      ).subscribe();
    } else {
      this.clearSession();
    }
  }

  clearSession(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userData');
    this.currentUserDataSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    const storage = this.getStorage();
    return storage ? storage.getItem('accessToken') : null;
  }

  getRefreshToken(): string | null {
    const userData = this.getStoredUserData();
    return userData?.refreshToken ?? null;
  }

  updateUserName(nombreUsuario: string): void {
    if (!this.isBrowser) return;

    const currentData = this.getStoredUserData();
    if (!currentData) return;

    const updatedData = { ...currentData, nombreUsuario };
    const storage = this.getStorage();

    if (storage) {
      storage.setItem('userData', JSON.stringify(updatedData));
      this.currentUserDataSubject.next(updatedData);
    }
  }

  private isUsingLocalStorage(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('accessToken');
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

  private getStoredUserData(): AuthResponse | null {
    const storage = this.getStorage();
    if (storage) {
      const userData = storage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  private saveUserData(data: AuthResponse, useLocalStorage: boolean): void {
    if (!this.isBrowser) return;

    const storage = useLocalStorage ? localStorage : sessionStorage;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userData');

    storage.setItem('accessToken', data.accessToken);
    storage.setItem('userData', JSON.stringify(data));
    this.currentUserDataSubject.next(data);
  }
}
