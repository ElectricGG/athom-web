import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './privacy.component.html'
})
export class PrivacyComponent {}
