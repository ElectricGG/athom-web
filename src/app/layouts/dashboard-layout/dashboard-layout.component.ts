import { Component, signal, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common'; // Import AsyncPipe
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';
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
  private perfilService = inject(PerfilService);
  private router = inject(Router);

  sidebarVisible = signal(false);
  userMenuVisible = signal(false);

  userPlan: 'free' | 'premium' = 'free';

  constructor() {
    this.perfilService.getPerfil().subscribe({
      next: (perfil) => {
        this.userPlan = perfil.planNombre?.toLowerCase() === 'premium' ? 'premium' : 'free';
      },
      error: () => {
        this.userPlan = 'free';
      }
    });
  }

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
    this.router.navigate(['/login']);
  }
}
