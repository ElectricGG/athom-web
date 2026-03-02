import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

export interface HeroSlide {
  badgeIcon: string;
  badgeText: string;
  title1: string;
  title2: string;
  description: string;
  bullets: string[];
  type: 'whatsapp' | 'web';
}
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, ButtonModule, CommonModule],
  templateUrl: './hero.component.html'
})
export class HeroComponent implements OnInit, OnDestroy {
  slides: HeroSlide[] = [
    {
      type: 'whatsapp',
      badgeIcon: 'pi pi-whatsapp',
      badgeText: '100% desde WhatsApp',
      title1: 'Registra tus finanzas',
      title2: 'hablando por chat',
      description: 'El asistente financiero más simple del mundo. Registra gastos, ingresos y presupuestos con solo enviar un mensaje de texto o audio.',
      bullets: [
        'Sin descargar ninguna app adicional',
        'Texto, audio o imágenes: tú eliges',
        'Categorización 100% automática con IA'
      ]
    },
    {
      type: 'web',
      badgeIcon: 'pi pi-desktop',
      badgeText: 'Dashboard Web Completo',
      title1: 'Analiza tu progreso',
      title2: 'con gráficas claras',
      description: 'Entra y visualiza tus finanzas, tendencias y descarga tu información personal a Excel cuando quieras.',
      bullets: [
        'Gráficos interactivos y filtros dinámicos',
        'Exporta tu historial con un solo clic',
        'Todo sincronizado con WhatsApp al instante'
      ]
    }
  ];

  activeIndex = 0;
  private intervalId: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
    }
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  startAutoplay() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 6000); // Change slide every 6 seconds
  }

  stopAutoplay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  setSlide(index: number) {
    this.activeIndex = index;
    this.stopAutoplay();
    this.startAutoplay(); // Reset timer
  }
}
