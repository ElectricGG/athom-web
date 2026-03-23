import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recordatorio } from '../../../../../models/recordatorio.model';
import { PerfilService } from '../../../../../services/perfil.service';
import { CurrencyService } from '../../../../../services/currency.service';

interface CalendarDay {
  date: number;
  currentMonth: boolean;
  today: boolean;
  reminders: Recordatorio[];
}

interface CalendarWeek {
  days: CalendarDay[];
}

@Component({
  selector: 'app-recordatorios-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recordatorios-calendar.component.html'
})
export class RecordatoriosCalendarComponent implements OnChanges, OnInit {
  private readonly perfilService = inject(PerfilService);
  private readonly currencyService = inject(CurrencyService);

  cs = 'S/';

  @Input() reminders: Recordatorio[] = [];
  @Output() toggle = new EventEmitter<Recordatorio>();
  @Output() edit = new EventEmitter<Recordatorio>();
  @Output() delete = new EventEmitter<Recordatorio>();

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  weeks: CalendarWeek[] = [];
  selectedDay: CalendarDay | null = null;
  togglingId: number | null = null;

  readonly weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  readonly monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  get monthLabel(): string {
    return `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
  }

  get isToday(): boolean {
    const now = new Date();
    return this.currentMonth === now.getMonth() && this.currentYear === now.getFullYear();
  }

  ngOnInit(): void {
    this.perfilService.getPerfil().subscribe(perfil => {
      const config = this.currencyService.getConfig(perfil.codigoPais);
      this.cs = config.symbol;
    });
  }

  ngOnChanges(): void {
    const selectedDate = this.selectedDay?.date ?? null;
    this.togglingId = null;
    this.buildCalendar();

    if (selectedDate !== null) {
      this.selectedDay = this.weeks
        .flatMap(w => w.days)
        .find(d => d.currentMonth && d.date === selectedDate) ?? null;
    }

    // Si no hay dia seleccionado, seleccionar hoy si esta en el mes actual, o el dia 1
    if (!this.selectedDay) {
      this.selectDefaultDay();
    }
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.buildCalendar();
    this.selectDefaultDay();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.buildCalendar();
    this.selectDefaultDay();
  }

  goToToday(): void {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();
    this.buildCalendar();
    this.selectDefaultDay();
  }

  selectDay(day: CalendarDay): void {
    if (!day.currentMonth) return;
    this.selectedDay = day;
  }

  private selectDefaultDay(): void {
    const today = new Date();
    const isCurrentMonth = today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear;

    // Buscar el dia actual si es el mes corriente, sino el dia 1
    const targetDate = isCurrentMonth ? today.getDate() : 1;

    this.selectedDay = this.weeks
      .flatMap(w => w.days)
      .find(d => d.currentMonth && d.date === targetDate) ?? null;
  }

  onToggle(reminder: Recordatorio): void {
    this.togglingId = reminder.recordatorioId;
    this.toggle.emit(reminder);
  }

  onEdit(reminder: Recordatorio): void {
    this.edit.emit(reminder);
  }

  onDelete(reminder: Recordatorio): void {
    this.delete.emit(reminder);
  }

  getStatusColor(estado: string): string {
    switch (estado) {
      case 'overdue': return 'bg-red-400';
      case 'upcoming': return 'bg-amber-400';
      case 'completed': return 'bg-green-400';
      default: return 'bg-blue-400';
    }
  }

  getStatusBorder(estado: string): string {
    switch (estado) {
      case 'overdue': return 'border-l-red-400';
      case 'upcoming': return 'border-l-amber-400';
      case 'completed': return 'border-l-green-400';
      default: return 'border-l-blue-400';
    }
  }

  getStatusBadgeClass(estado: string): string {
    switch (estado) {
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'upcoming': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  }

  getStatusLabel(estado: string): string {
    switch (estado) {
      case 'overdue': return 'Vencido';
      case 'upcoming': return 'Proximo';
      case 'completed': return 'Completado';
      default: return 'Pendiente';
    }
  }

  private buildCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Monday = 0, Sunday = 6
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const daysInMonth = lastDay.getDate();
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear;

    const remindersByDay = this.buildReminderMap();

    const cells: CalendarDay[] = [];

    // Previous month trailing days
    for (let i = startDow - 1; i >= 0; i--) {
      cells.push({
        date: prevMonthLastDay - i,
        currentMonth: false,
        today: false,
        reminders: []
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        date: d,
        currentMonth: true,
        today: isCurrentMonth && d === today.getDate(),
        reminders: remindersByDay.get(d) ?? []
      });
    }

    // Next month leading days
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        cells.push({
          date: d,
          currentMonth: false,
          today: false,
          reminders: []
        });
      }
    }

    // Split into weeks
    this.weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      this.weeks.push({ days: cells.slice(i, i + 7) });
    }
  }

  private buildReminderMap(): Map<number, Recordatorio[]> {
    const map = new Map<number, Recordatorio[]>();

    for (const r of this.reminders) {
      const date = new Date(r.fechaVencimiento);
      if (date.getMonth() === this.currentMonth && date.getFullYear() === this.currentYear) {
        const day = date.getDate();
        if (!map.has(day)) {
          map.set(day, []);
        }
        map.get(day)!.push(r);
      }
    }

    return map;
  }
}
