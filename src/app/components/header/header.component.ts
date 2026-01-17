import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonModule, DrawerModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  mobileMenuOpen = signal(false);
}
