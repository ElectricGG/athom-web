import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    DrawerModule,
    ButtonModule
  ],
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent {
  private router = inject(Router);

  sidebarVisible = signal(false);

  // Mock user data - esto vendría de un servicio de autenticación
  userName = 'Juan Pérez';
  userPlan: 'free' | 'premium' = 'premium';

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  closeSidebar(): void {
    this.sidebarVisible.set(false);
  }

  logout(): void {
    // Aquí iría la lógica de logout
    this.router.navigate(['/login']);
  }
}
