import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './terms.component.html'
})
export class TermsComponent {}
