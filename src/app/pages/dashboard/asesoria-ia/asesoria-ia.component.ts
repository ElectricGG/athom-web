import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MarkdownModule } from 'ngx-markdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ChatService } from '../../../services/chat.service';
import { ChatMessage, ChatHistoryItem } from '../../../models/chat.model';

@Component({
  selector: 'app-asesoria-ia',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, MarkdownModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './asesoria-ia.component.html'
})
export class AsesoriaIaComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  newMessage = '';
  isTyping = false;
  isError = false;
  isLoadingHistory = true;

  quickActions = [
    '¿Cómo van mis gastos?',
    'Dame consejos de ahorro',
    'Analiza mi mes',
    '¿Cuánto puedo gastar?',
    'Resumen financiero'
  ];

  messages: ChatMessage[] = [];

  private readonly welcomeMessage: ChatMessage = {
    id: 0,
    type: 'assistant',
    content: `¡Hola! 👋 Soy tu asistente financiero personal.

Puedo ayudarte con:
• 📊 Analizar tus gastos e ingresos
• 💰 Revisar tu presupuesto
• 🎯 Ver el progreso de tus metas de ahorro
• 📈 Mostrarte tendencias y estadísticas
• 💡 Darte consejos personalizados

¿En qué puedo ayudarte hoy?`,
    time: 'Ahora'
  };

  constructor(
    private chatService: ChatService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.isLoadingHistory = true;
    this.chatService.getHistory(50).subscribe({
      next: (history) => {
        if (history.length > 0) {
          // Convert history items to ChatMessage format
          this.messages = history.map((item, index) => ({
            id: index + 1,
            type: item.role === 'user' ? 'user' : 'assistant' as const,
            content: item.content,
            time: this.formatTime(new Date(item.timestamp))
          }));
        } else {
          // No history, show welcome message
          this.messages = [{ ...this.welcomeMessage, time: this.formatTime(new Date()) }];
        }
        this.isLoadingHistory = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error loading history:', error);
        // On error, show welcome message
        this.messages = [{ ...this.welcomeMessage, time: this.formatTime(new Date()) }];
        this.isLoadingHistory = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || this.isTyping) return;

    const userMessage: ChatMessage = {
      id: this.messages.length + 1,
      type: 'user',
      content: this.newMessage,
      time: this.formatTime(new Date())
    };

    this.messages.push(userMessage);
    const messageToSend = this.newMessage;
    this.newMessage = '';
    this.isTyping = true;
    this.isError = false;

    setTimeout(() => this.scrollToBottom(), 100);

    // Build history from last messages (excluding the welcome message)
    const history = this.buildHistory();

    this.chatService.sendMessage({
      message: messageToSend,
      history: history
    }).subscribe({
      next: (response) => {
        this.isTyping = false;
        const assistantMessage: ChatMessage = {
          id: this.messages.length + 1,
          type: 'assistant',
          content: response.message,
          time: this.formatTime(new Date(response.timestamp)),
          toolsUsed: response.toolsUsed
        };
        this.messages.push(assistantMessage);
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.isTyping = false;
        this.isError = true;

        const errorMessage: ChatMessage = {
          id: this.messages.length + 1,
          type: 'assistant',
          content: `Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.

Si el problema persiste, verifica tu conexión a internet o intenta más tarde.`,
          time: this.formatTime(new Date())
        };
        this.messages.push(errorMessage);
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  sendQuickAction(action: string): void {
    this.newMessage = action;
    this.sendMessage();
  }

  retryLastMessage(): void {
    if (this.messages.length < 2) return;

    // Find the last user message
    const lastUserMessage = [...this.messages]
      .reverse()
      .find(m => m.type === 'user');

    if (lastUserMessage) {
      // Remove the error message
      if (this.messages[this.messages.length - 1].type === 'assistant') {
        this.messages.pop();
      }
      this.newMessage = lastUserMessage.content;
      // Remove the last user message to avoid duplicates
      const index = this.messages.lastIndexOf(lastUserMessage);
      if (index > -1) {
        this.messages.splice(index, 1);
      }
      this.sendMessage();
    }
  }

  confirmClearChat(): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas borrar todo el historial del chat?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, borrar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.clearChat()
    });
  }

  clearChat(): void {
    this.chatService.clearHistory().subscribe({
      next: () => {
        this.messages = [{ ...this.welcomeMessage, time: this.formatTime(new Date()) }];
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error clearing chat:', error);
      }
    });
  }

  private buildHistory(): ChatHistoryItem[] {
    // Get last 10 messages for context, excluding welcome message (id: 0)
    return this.messages
      .filter(m => m.id !== 0)
      .slice(-10)
      .map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant' as const,
        content: m.content,
        timestamp: new Date()
      }));
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  formatToolName(tool: string): string {
    const toolNames: Record<string, string> = {
      'get_balance_summary': 'Balance',
      'get_expense_distribution': 'Distribución de gastos',
      'get_expense_summary': 'Resumen de gastos',
      'get_income_summary': 'Resumen de ingresos',
      'get_budget_status': 'Presupuesto',
      'get_savings_goals': 'Metas de ahorro',
      'get_recent_transactions': 'Transacciones',
      'get_monthly_trends': 'Tendencias',
      'get_upcoming_reminders': 'Recordatorios'
    };
    return toolNames[tool] || tool;
  }

  private formatTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins === 1) return 'Hace 1 min';
    if (diffMins < 60) return `Hace ${diffMins} min`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return 'Hace 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;

    return date.toLocaleDateString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
