import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    AOS.init({
      once: true,
      offset: 50,
      duration: 600,
      easing: 'ease-out-cubic',
    });
  }
}
