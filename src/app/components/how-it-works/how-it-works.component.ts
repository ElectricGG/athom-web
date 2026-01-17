import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CardModule],
  templateUrl: './how-it-works.component.html'
})
export class HowItWorksComponent {}
