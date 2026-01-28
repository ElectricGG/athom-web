import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { RecordatorioService } from '../../../services/recordatorio.service';
import {
  Recordatorio,
  ResumenRecordatorios,
  CrearRecordatorioRequest,
  ActualizarRecordatorioRequest,
  FrecuenciaRecordatorio
} from '../../../models/recordatorio.model';

interface FrecuenciaOption {
  label: string;
  value: FrecuenciaRecordatorio;
}

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule
  ],
  templateUrl: './recordatorios.component.html'
})
export class RecordatoriosComponent implements OnInit {
  private recordatorioService = inject(RecordatorioService);

  allReminders: Recordatorio[] = [];
  resumen: ResumenRecordatorios = { vencidos: 0, proximosSieteDias: 0, completadosEsteMes: 0 };
  isLoading = false;
  isLoadingResumen = false;
  showCompletados = false;

  get reminders(): Recordatorio[] {
    return this.showCompletados
      ? this.allReminders
      : this.allReminders.filter(r => !r.completado);
  }

  // Dialog
  showDialog = false;
  isEditing = false;
  editingId: number | null = null;
  isSaving = false;

  // Form
  formTitulo = '';
  formDescripcion = '';
  formMonto: number | null = null;
  formFechaVencimiento: Date | null = null;
  formFrecuencia: FrecuenciaOption | null = null;
  formIcono = '';

  frecuenciaOptions: FrecuenciaOption[] = [
    { label: 'No repetir', value: FrecuenciaRecordatorio.Ninguna },
    { label: 'Diario', value: FrecuenciaRecordatorio.Diario },
    { label: 'Semanal', value: FrecuenciaRecordatorio.Semanal },
    { label: 'Mensual', value: FrecuenciaRecordatorio.Mensual },
    { label: 'Anual', value: FrecuenciaRecordatorio.Anual }
  ];

  // Delete confirmation
  showDeleteDialog = false;
  deletingId: number | null = null;
  isDeleting = false;

  ngOnInit(): void {
    this.loadData();
  }

  toggleCompletados(): void {
    this.showCompletados = !this.showCompletados;
  }

  toggleReminder(reminder: Recordatorio): void {
    this.recordatorioService.toggleCompletado(reminder.recordatorioId).subscribe({
      next: () => this.loadData(),
      error: () => this.loadData()
    });
  }

  openCreateDialog(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingId = null;
    this.showDialog = true;
  }

  openEditDialog(reminder: Recordatorio): void {
    this.isEditing = true;
    this.editingId = reminder.recordatorioId;
    this.formTitulo = reminder.titulo;
    this.formDescripcion = reminder.descripcion ?? '';
    this.formMonto = reminder.monto;
    this.formFechaVencimiento = new Date(reminder.fechaVencimiento);
    this.formFrecuencia = this.frecuenciaOptions.find(o => o.value === reminder.frecuencia) ?? this.frecuenciaOptions[0];
    this.formIcono = reminder.icono ?? '';
    this.showDialog = true;
  }

  saveReminder(): void {
    if (!this.formTitulo.trim() || this.formMonto === null || !this.formFechaVencimiento) return;

    this.isSaving = true;

    if (this.isEditing && this.editingId !== null) {
      const request: ActualizarRecordatorioRequest = {
        titulo: this.formTitulo.trim(),
        monto: this.formMonto,
        fechaVencimiento: this.formFechaVencimiento.toISOString(),
        descripcion: this.formDescripcion.trim() || undefined,
        icono: this.formIcono.trim() || undefined,
        frecuencia: this.formFrecuencia?.value ?? FrecuenciaRecordatorio.Ninguna
      };

      this.recordatorioService.actualizar(this.editingId, request).subscribe({
        next: () => {
          this.showDialog = false;
          this.isSaving = false;
          this.loadData();
        },
        error: () => { this.isSaving = false; }
      });
    } else {
      const request: CrearRecordatorioRequest = {
        titulo: this.formTitulo.trim(),
        monto: this.formMonto,
        fechaVencimiento: this.formFechaVencimiento.toISOString(),
        descripcion: this.formDescripcion.trim() || undefined,
        icono: this.formIcono.trim() || undefined,
        frecuencia: this.formFrecuencia?.value ?? FrecuenciaRecordatorio.Ninguna
      };

      this.recordatorioService.crear(request).subscribe({
        next: () => {
          this.showDialog = false;
          this.isSaving = false;
          this.loadData();
        },
        error: () => { this.isSaving = false; }
      });
    }
  }

  confirmDelete(reminder: Recordatorio): void {
    this.deletingId = reminder.recordatorioId;
    this.showDeleteDialog = true;
  }

  deleteReminder(): void {
    if (this.deletingId === null) return;

    this.isDeleting = true;
    this.recordatorioService.eliminar(this.deletingId).subscribe({
      next: () => {
        this.showDeleteDialog = false;
        this.isDeleting = false;
        this.deletingId = null;
        this.loadData();
      },
      error: () => { this.isDeleting = false; }
    });
  }

  private loadData(): void {
    this.isLoading = true;
    this.isLoadingResumen = true;

    this.recordatorioService.getAll().subscribe({
      next: (data) => {
        this.allReminders = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });

    this.recordatorioService.getResumen().subscribe({
      next: (data) => {
        this.resumen = data;
        this.isLoadingResumen = false;
      },
      error: () => { this.isLoadingResumen = false; }
    });
  }

  private resetForm(): void {
    this.formTitulo = '';
    this.formDescripcion = '';
    this.formMonto = null;
    this.formFechaVencimiento = null;
    this.formFrecuencia = null;
    this.formIcono = '';
  }
}
