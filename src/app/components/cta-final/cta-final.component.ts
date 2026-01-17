import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cta-final',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  templateUrl: './cta-final.component.html'
})
export class CtaFinalComponent {}
