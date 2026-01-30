import { Component, signal, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common'; // Import AsyncPipe
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    DrawerModule,
    ButtonModule,
    AsyncPipe // Add AsyncPipe
  ],
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);

  sidebarVisible = signal(false);
  userMenuVisible = signal(false);

  userPlan: 'free' | 'premium' = 'premium';

  userName$: Observable<string> = this.authService.currentUserData.pipe(
    map(user => user ? user.nombreUsuario : 'Invitado')
  );

  userPhone$: Observable<string> = this.authService.currentUserData.pipe(
    map(user => user ? user.numeroWhatsapp : '')
  );

  userInitial$: Observable<string> = this.userName$.pipe(
    map(name => name ? name.charAt(0).toUpperCase() : '?')
  );

  closeSidebar(): void {
    this.sidebarVisible.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuVisible.update(v => !v);
  }

  closeUserMenu(): void {
    this.userMenuVisible.set(false);
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout();
  }
}
