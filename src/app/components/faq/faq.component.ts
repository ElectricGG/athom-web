import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [AccordionModule],
  templateUrl: './faq.component.html'
})
export class FaqComponent {
  faqItems = [
    {
      question: '¿Necesito instalar algo?',
      answer: 'No, Mia funciona completamente desde WhatsApp. Solo necesitas tener WhatsApp instalado en tu celular, que probablemente ya tienes. No hay ninguna app adicional que descargar.'
    },
    {
      question: '¿Qué diferencia hay entre los planes?',
      answer: 'Tenemos 2 planes disponibles: El plan Gratis incluye registro de gastos por texto, reportes básicos y 50 mensajes semanales. El plan Premium (S/ 4.90/mes - precio de lanzamiento) agrega registro por foto y audio, reportes exportables, memoria inteligente, búsqueda de precios y miembros familiares. Pronto lanzaremos el plan Max con agente de compras inteligente.'
    },
    {
      question: '¿Funciona con audios e imágenes?',
      answer: 'Sí, puedes registrar gastos de tres formas: escribiendo un mensaje de texto, enviando un audio describiendo tu gasto, o enviando una foto de tu ticket o recibo. Nuestra IA procesa todo automáticamente.'
    },
    {
      question: '¿Es seguro?',
      answer: 'Absolutamente. Utilizamos encriptación de extremo a extremo y seguimos las mejores prácticas de seguridad. Tus datos financieros están protegidos y nunca los compartimos con terceros.'
    },
    {
      question: '¿Tiene costo?',
      answer: 'Ofrecemos un plan gratuito con funciones básicas. El plan Premium tiene un precio de lanzamiento de S/ 4.90/mes. Puedes cancelar en cualquier momento sin compromiso.'
    },
    {
      question: '¿Puedo exportar mis datos?',
      answer: 'Sí, los usuarios premium pueden exportar sus datos en formato Excel. Solo escribe "exportar datos" en el chat y recibirás un archivo con todo tu historial financiero.'
    }
  ];
}
