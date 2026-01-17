import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  time: string;
}

@Component({
  selector: 'app-asesoria-ia',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule],
  templateUrl: './asesoria-ia.component.html'
})
export class AsesoriaIaComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  newMessage = '';
  isTyping = false;

  quickActions = [
    '¿Cómo van mis gastos?',
    'Dame consejos de ahorro',
    'Analiza mi mes',
    '¿Cuánto puedo gastar?',
    'Resumen financiero'
  ];

  messages: Message[] = [
    {
      id: 1,
      type: 'user',
      content: '¿Cómo van mis gastos este mes?',
      time: 'Hace 1 min'
    },
    {
      id: 2,
      type: 'assistant',
      content: `Analizando tus gastos de enero 2026:

📊 Resumen:
• Total gastado: S/ 1,250.00
• Presupuesto mensual: S/ 2,000.00
• Disponible: S/ 750.00

📈 Distribución:
• Alimentación: S/ 450 (36%)
• Transporte: S/ 280 (22%)
• Entretenimiento: S/ 200 (16%)
• Servicios: S/ 180 (14%)
• Otros: S/ 140 (12%)

💡 Observación: Tus gastos en alimentación están un poco elevados comparado con el mes anterior (+15%). Te sugiero revisar si hay compras que puedas optimizar.`,
      time: 'Hace 1 min'
    }
  ];

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const userMessage: Message = {
      id: this.messages.length + 1,
      type: 'user',
      content: this.newMessage,
      time: 'Ahora'
    };

    this.messages.push(userMessage);
    this.newMessage = '';
    this.isTyping = true;

    setTimeout(() => this.scrollToBottom(), 100);

    // Simular respuesta de IA
    setTimeout(() => {
      this.isTyping = false;
      const assistantMessage: Message = {
        id: this.messages.length + 1,
        type: 'assistant',
        content: this.getAIResponse(userMessage.content),
        time: 'Ahora'
      };
      this.messages.push(assistantMessage);
      setTimeout(() => this.scrollToBottom(), 100);
    }, 1500);
  }

  sendQuickAction(action: string): void {
    this.newMessage = action;
    this.sendMessage();
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  private getAIResponse(message: string): string {
    const responses: { [key: string]: string } = {
      'dame consejos de ahorro': `¡Claro! Aquí tienes algunos consejos personalizados basados en tu historial:

💰 Consejos de ahorro:

1. Meal prep semanal
   Podrías ahorrar ~S/ 150/mes preparando comidas en casa.

2. Transporte compartido
   Considera usar carpooling 2-3 veces por semana.

3. Revisar suscripciones
   Tienes 3 servicios de streaming. ¿Los usas todos?

4. Regla 50/30/20
   • 50% necesidades: S/ 2,750
   • 30% deseos: S/ 1,650
   • 20% ahorro: S/ 1,100

¿Te gustaría que profundice en alguno de estos puntos?`,
      'analiza mi mes': `📊 Análisis completo de Enero 2026:

✅ Lo positivo:
• Cumpliste el 85% de tu meta de ahorro
• Redujiste gastos en entretenimiento un 10%
• Tus ingresos aumentaron un 8.2%

⚠️ Áreas de mejora:
• Gastos en alimentación +15% vs mes anterior
• 2 pagos de servicios vencidos

📈 Proyección:
Si mantienes este ritmo, a fin de año habrás ahorrado aproximadamente S/ 12,000.

¿Quieres que te ayude a crear un plan para mejorar en las áreas pendientes?`,
      '¿cuánto puedo gastar?': `Basándome en tu situación actual:

💵 Disponible para gastar:
• Hoy: S/ 50.00 (promedio diario)
• Esta semana: S/ 350.00
• Este mes: S/ 750.00

🎯 Recomendación:
Para cumplir tu meta de ahorro de S/ 1,000, te sugiero limitar los gastos no esenciales a S/ 500 durante las próximas 2 semanas.

¿Te ayudo a categorizar qué gastos son prioritarios?`
    };

    const lowerMessage = message.toLowerCase();
    for (const key in responses) {
      if (lowerMessage.includes(key)) {
        return responses[key];
      }
    }

    return `Gracias por tu pregunta. Estoy analizando tu información financiera para darte la mejor respuesta.

Basándome en tus datos:
• Balance actual: S/ 4,250.00
• Ingresos del mes: S/ 5,500.00
• Gastos del mes: S/ 1,250.00

¿Hay algo específico que te gustaría saber sobre tus finanzas?`;
  }
}
