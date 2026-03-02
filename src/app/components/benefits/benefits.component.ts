import { Component } from '@angular/core';

@Component({
  selector: 'app-benefits',
  standalone: true,
  templateUrl: './benefits.component.html'
})
export class BenefitsComponent {
  benefits = [
    {
      icon: 'pi pi-download',
      title: 'Sin instalar apps',
      description: 'No necesitas descargar nada. Usa el WhatsApp que ya tienes instalado.',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: 'pi pi-whatsapp',
      title: 'WhatsApp como interfaz',
      description: 'La app que usas todos los días. Sin curva de aprendizaje.',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: 'pi pi-microphone',
      title: 'Texto, audio e imágenes',
      description: 'Registra gastos como prefieras. Escribe, habla o envía una foto del ticket.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: 'pi pi-lock',
      title: 'Seguro y privado',
      description: 'Tus datos están protegidos. Encriptación de extremo a extremo.',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Ideal para uso diario',
      description: 'Registra gastos en segundos. Rápido, simple y efectivo.',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      icon: 'pi pi-desktop',
      title: 'WhatsApp + Dashboard Web',
      description: 'Registra rápido desde WhatsApp en la calle. Analiza profundo en tu PC cuando quieras.',
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    }
  ];
}
