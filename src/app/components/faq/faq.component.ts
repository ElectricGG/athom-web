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
      answer: 'Tenemos 3 planes: El plan Gratis incluye registro de gastos por texto, reportes básicos y 20 mensajes diarios. El plan Premium (S/ 9.90/mes) agrega registro por foto y audio, reportes exportables, memoria inteligente, búsqueda de precios y miembros familiares. El plan Max (S/ 24.90/mes) incluye todo lo de Premium más un agente de compras con IA que recuerda tus compras, predice cuándo necesitas recomprar y te avisa cuando encuentra mejores precios.'
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
      answer: 'Ofrecemos un plan gratuito con funciones básicas. El plan Premium cuesta S/ 9.90/mes y el plan Max S/ 24.90/mes. También hay precios anuales con descuento. Puedes cancelar en cualquier momento sin compromiso.'
    },
    {
      question: '¿Puedo exportar mis datos?',
      answer: 'Sí, los usuarios premium pueden exportar sus datos en formato Excel. Solo escribe "exportar datos" en el chat y recibirás un archivo con todo tu historial financiero.'
    }
  ];
}
