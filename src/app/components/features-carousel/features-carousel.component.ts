import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

export interface Feature {
  id: string;
  icon: string;
  label: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  description: string;
  bullets: { icon: string; iconColor: string; text: string }[];
  chatTitle: string;
  chatExamples: { message: string; response: string }[];
  extraChat?: string;
  bgGradient: string;
  tabActiveBg: string;
  tabActiveText: string;
}

@Component({
  selector: 'app-features-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-carousel.component.html'
})
export class FeaturesCarouselComponent implements OnInit, OnDestroy {
  features: Feature[] = [
    {
      id: 'gastos',
      icon: 'pi pi-arrow-down',
      label: 'Gastos',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-700',
      title: 'Registra gastos en segundos',
      description: 'Solo escribe lo que gastaste. Nuestra IA entiende el contexto y categoriza automáticamente.',
      bullets: [
        { icon: 'pi pi-check-circle', iconColor: 'text-green-500', text: 'Detecta montos automáticamente' },
        { icon: 'pi pi-check-circle', iconColor: 'text-green-500', text: 'Clasifica por categorías inteligentes' },
        { icon: 'pi pi-check-circle', iconColor: 'text-green-500', text: 'Funciona con texto, voz o fotos' }
      ],
      chatTitle: 'Ejemplos de mensajes',
      chatExamples: [
        { message: 'Gasté 35 soles en comida', response: '✅ Registrado: S/ 35.00 en Comida' },
        { message: 'Café 12 soles', response: '✅ Registrado: S/ 12.00 en Cafetería' },
        { message: 'Supermercado 180', response: '✅ Registrado: S/ 180.00 en Supermercado' }
      ],
      bgGradient: 'from-red-50 to-orange-50',
      tabActiveBg: 'bg-red-100',
      tabActiveText: 'text-red-700'
    },
    {
      id: 'ingresos',
      icon: 'pi pi-arrow-up',
      label: 'Ingresos',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-700',
      title: 'Registra tus ingresos fácilmente',
      description: 'Sueldo, freelance, ventas o cualquier ingreso extra. Mantenlos todos organizados.',
      bullets: [
        { icon: 'pi pi-check-circle', iconColor: 'text-green-500', text: 'Múltiples fuentes de ingreso' },
        { icon: 'pi pi-check-circle', iconColor: 'text-green-500', text: 'Historial completo de entradas' },
        { icon: 'pi pi-check-circle', iconColor: 'text-green-500', text: 'Balance actualizado en tiempo real' }
      ],
      chatTitle: 'Ejemplos de mensajes',
      chatExamples: [
        { message: 'Ingreso 1500 sueldo', response: '✅ Registrado ingreso: S/ 1,500.00 - Sueldo' },
        { message: 'Recibí 300 freelance', response: '✅ Registrado ingreso: S/ 300.00 - Freelance' },
        { message: 'Venta 250 hoy', response: '✅ Registrado ingreso: S/ 250.00 - Venta' }
      ],
      bgGradient: 'from-green-50 to-emerald-50',
      tabActiveBg: 'bg-green-100',
      tabActiveText: 'text-green-700'
    },
    {
      id: 'presupuestos',
      icon: 'pi pi-wallet',
      label: 'Presupuestos',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-700',
      title: 'Establece presupuestos mensuales',
      description: 'Define límites para cada categoría y recibe alertas automáticas cuando te acerques al tope.',
      bullets: [
        { icon: 'pi pi-bell', iconColor: 'text-blue-500', text: 'Alertas automáticas al 80% del límite' },
        { icon: 'pi pi-chart-pie', iconColor: 'text-blue-500', text: 'Seguimiento visual del progreso' },
        { icon: 'pi pi-refresh', iconColor: 'text-blue-500', text: 'Se reinician cada mes automáticamente' }
      ],
      chatTitle: 'Ejemplos de mensajes',
      chatExamples: [
        { message: 'Presupuesto comida 600 mensual', response: '✅ Presupuesto creado: Comida - S/ 600.00/mes' },
        { message: 'Límite transporte 200', response: '✅ Presupuesto creado: Transporte - S/ 200.00/mes' }
      ],
      extraChat: '⚠️ Alerta: Has usado el 85% de tu presupuesto de Comida (S/ 510 de S/ 600)',
      bgGradient: 'from-blue-50 to-indigo-50',
      tabActiveBg: 'bg-blue-100',
      tabActiveText: 'text-blue-700'
    },
    {
      id: 'categorias',
      icon: 'pi pi-tags',
      label: 'Categorías',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-700',
      title: 'Organiza con categorías inteligentes',
      description: 'Nuestro sistema clasifica automáticamente tus gastos. También puedes crear y editar categorías personalizadas.',
      bullets: [
        { icon: 'pi pi-check-circle', iconColor: 'text-purple-500', text: 'Clasificación automática con IA' },
        { icon: 'pi pi-check-circle', iconColor: 'text-purple-500', text: 'Crea categorías personalizadas' },
        { icon: 'pi pi-check-circle', iconColor: 'text-purple-500', text: 'Renombra y edita cuando quieras' }
      ],
      chatTitle: 'Gestión de categorías',
      chatExamples: [
        { message: 'Crear categoría Mascota', response: '✅ Categoría "Mascota" creada exitosamente' },
        { message: 'Ver mis categorías', response: '📂 Tus categorías:\n• Comida\n• Transporte\n• Mascota\n• Servicios' },
        { message: 'Renombrar Mascota a Veterinaria', response: '✅ Categoría actualizada: "Veterinaria"' }
      ],
      bgGradient: 'from-purple-50 to-fuchsia-50',
      tabActiveBg: 'bg-purple-100',
      tabActiveText: 'text-purple-700'
    },
    {
      id: 'reportes',
      icon: 'pi pi-chart-bar',
      label: 'Reportes',
      badgeBg: 'bg-slate-200',
      badgeText: 'text-slate-700',
      title: 'Reportes y resúmenes al instante',
      description: 'Pregunta lo que necesites saber. Obtén resúmenes diarios, semanales o mensuales en segundos.',
      bullets: [
        { icon: 'pi pi-calendar', iconColor: 'text-slate-600', text: 'Resúmenes por período' },
        { icon: 'pi pi-filter', iconColor: 'text-slate-600', text: 'Filtros por categoría' },
        { icon: 'pi pi-percentage', iconColor: 'text-slate-600', text: 'Comparativas y tendencias' },
        { icon: 'pi pi-file-excel', iconColor: 'text-slate-600', text: 'Exporta reportes diarios a Excel' }
      ],
      chatTitle: 'Consultas de reportes',
      chatExamples: [
        { message: 'Resumen del mes', response: '📊 Resumen Enero 2026\n\n💰 Ingresos: S/ 3,500.00\n💸 Gastos: S/ 2,180.00\n✅ Balance: +S/ 1,320.00' },
        { message: '¿Cuánto gasté en comida?', response: '🍔 Gastos en Comida (Enero):\nTotal: S/ 850.00\nTransacciones: 24' },
        { message: 'Reporte semanal', response: '📅 Semana del 6-12 Ene\nGastos: S/ 485.00\nIngresos: S/ 300.00' }
      ],
      bgGradient: 'from-slate-50 to-gray-100',
      tabActiveBg: 'bg-slate-200',
      tabActiveText: 'text-slate-700'
    },
    {
      id: 'productos',
      icon: 'pi pi-search',
      label: 'Precios',
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-700',
      title: 'Busca y compara precios al instante',
      description: 'Pregunta por cualquier producto y obtén precios actualizados de internet. Compara y ahorra sin salir del chat.',
      bullets: [
        { icon: 'pi pi-search', iconColor: 'text-cyan-500', text: 'Búsqueda de precios en tiempo real' },
        { icon: 'pi pi-arrows-h', iconColor: 'text-cyan-500', text: 'Compara con lo que pagaste antes' },
        { icon: 'pi pi-link', iconColor: 'text-cyan-500', text: 'Links directos para comprar' }
      ],
      chatTitle: 'Ejemplos de búsqueda',
      chatExamples: [
        { message: '¿Dónde compro pañales Huggies más baratos?', response: '🔍 Encontré 5 resultados:\n\n🏷️ Plaza Vea: S/ 62.90\n🏷️ Tottus: S/ 65.50\n🏷️ Wong: S/ 68.00' },
        { message: '¿Cuánto cuesta un aire acondicionado?', response: '🔍 Resultados para aire acondicionado:\n\n🏷️ Falabella: S/ 1,299.00\n🏷️ Promart: S/ 1,149.00' }
      ],
      extraChat: '💡 Te quedan 12 búsquedas este mes',
      bgGradient: 'from-cyan-50 to-teal-50',
      tabActiveBg: 'bg-cyan-100',
      tabActiveText: 'text-cyan-700'
    }
  ];

  activeIndex = 0;
  private intervalId: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
    }
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  get activeFeature(): Feature {
    return this.features[this.activeIndex];
  }

  setFeature(index: number) {
    this.activeIndex = index;
    this.stopAutoplay();
    this.startAutoplay();
  }

  private startAutoplay() {
    this.intervalId = setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.features.length;
    }, 6000);
  }

  private stopAutoplay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
