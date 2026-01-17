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
      answer: 'No, Athom funciona completamente desde WhatsApp. Solo necesitas tener WhatsApp instalado en tu celular, que probablemente ya tienes. No hay ninguna app adicional que descargar.'
    },
    {
      question: '¿Qué diferencia hay entre el plan gratis y premium?',
      answer: 'El plan gratis te permite hasta 5 mensajes diarios con funciones básicas de registro y reportes. El plan premium ofrece mensajes ilimitados, inteligencia avanzada, categorías personalizadas sin límite, reportes exportables y acceso exclusivo a ofertas de establecimientos aliados.'
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
      answer: 'Ofrecemos un plan gratuito con funciones básicas. El plan premium tiene un costo de S/ 19.90 al mes y puedes cancelar en cualquier momento sin compromiso.'
    },
    {
      question: '¿Puedo exportar mis datos?',
      answer: 'Sí, los usuarios premium pueden exportar sus datos en formato Excel o PDF. Solo escribe "exportar datos" en el chat y recibirás un archivo con todo tu historial financiero.'
    }
  ];
}
