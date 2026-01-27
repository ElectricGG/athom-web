import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MetaAhorroService } from '../../../services/meta-ahorro.service';
import { MetaAhorro, EstadoMeta } from '../../../models/meta-ahorro.model';

interface MetaEstadisticas {
  totalAhorrado: number;
  metasActivas: number;
  metasCompletadas: number;
}

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    TextareaModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './metas.component.html'
})
export class MetasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private metaAhorroService = inject(MetaAhorroService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // Estado
  metas: MetaAhorro[] = [];
  isLoading = false;
  isSaving = false;
  showDialog = false;
  isEditing = false;
  selectedMetaId: number | null = null;

  // Formulario
  metaForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    montoObjetivo: [null, [Validators.required, Validators.min(0.01)]],
    descripcion: ['', [Validators.maxLength(500)]],
    fechaLimite: [null],
    prioridad: [1, [Validators.min(1), Validators.max(10)]],
    color: ['#22c55e'],
    icono: ['']
  });

  // Opciones
  colors = ['#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#eab308', '#14b8a6', '#ef4444'];
  iconos = ['🎯', '🏠', '✈️', '🚗', '💻', '📚', '🛡️', '💰', '🎓', '💍', '🏥', '🎁'];
  today = new Date();

  // Estadísticas calculadas
  get estadisticas(): MetaEstadisticas {
    return {
      totalAhorrado: this.metas.reduce((sum, m) => sum + m.montoActual, 0),
      metasActivas: this.metas.filter(m => m.estado === EstadoMeta.Activa).length,
      metasCompletadas: this.metas.filter(m => m.estado === EstadoMeta.Completada).length
    };
  }

  get metasActivas(): MetaAhorro[] {
    return this.metas.filter(m => m.estado === EstadoMeta.Activa);
  }

  get metasPausadas(): MetaAhorro[] {
    return this.metas.filter(m => m.estado === EstadoMeta.Pausada);
  }

  get metasCompletadas(): MetaAhorro[] {
    return this.metas.filter(m => m.estado === EstadoMeta.Completada);
  }

  ngOnInit(): void {
    this.cargarMetas();
  }

  cargarMetas(): void {
    this.isLoading = true;
    this.metaAhorroService.getAll().subscribe({
      next: (metas) => {
        this.metas = metas;
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las metas'
        });
        this.isLoading = false;
      }
    });
  }

  abrirDialogoNuevo(): void {
    this.isEditing = false;
    this.selectedMetaId = null;
    this.metaForm.reset({
      nombre: '',
      montoObjetivo: null,
      descripcion: '',
      fechaLimite: null,
      prioridad: 1,
      color: '#22c55e',
      icono: ''
    });
    this.showDialog = true;
  }

  abrirDialogoEditar(meta: MetaAhorro): void {
    this.isEditing = true;
    this.selectedMetaId = meta.metaAhorroId;
    this.metaForm.patchValue({
      nombre: meta.nombre,
      montoObjetivo: meta.montoObjetivo,
      descripcion: meta.descripcion || '',
      fechaLimite: meta.fechaLimite ? new Date(meta.fechaLimite) : null,
      prioridad: meta.prioridad,
      color: meta.color || '#22c55e',
      icono: meta.icono || ''
    });
    this.showDialog = true;
  }

  guardarMeta(): void {
    if (this.metaForm.invalid) {
      this.metaForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.metaForm.value;

    const request = {
      nombre: formValue.nombre,
      montoObjetivo: formValue.montoObjetivo,
      descripcion: formValue.descripcion || undefined,
      fechaLimite: formValue.fechaLimite?.toISOString() || undefined,
      prioridad: formValue.prioridad,
      color: formValue.color,
      icono: formValue.icono || undefined
    };

    const operacion = this.isEditing && this.selectedMetaId
      ? this.metaAhorroService.actualizar(this.selectedMetaId, request)
      : this.metaAhorroService.crear(request);

    operacion.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.isEditing ? 'Meta actualizada correctamente' : 'Meta creada correctamente'
        });
        this.showDialog = false;
        this.isSaving = false;
        this.cargarMetas();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo guardar la meta'
        });
        this.isSaving = false;
      }
    });
  }

  confirmarEliminar(meta: MetaAhorro): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la meta "${meta.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminarMeta(meta)
    });
  }

  eliminarMeta(meta: MetaAhorro): void {
    this.metaAhorroService.eliminar(meta.metaAhorroId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Meta eliminada correctamente'
        });
        this.cargarMetas();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo eliminar la meta'
        });
      }
    });
  }

  completarMeta(meta: MetaAhorro): void {
    this.metaAhorroService.completar(meta.metaAhorroId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Felicidades!',
          detail: `Has completado la meta "${meta.nombre}"`
        });
        this.cargarMetas();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo completar la meta'
        });
      }
    });
  }

  pausarMeta(meta: MetaAhorro): void {
    this.metaAhorroService.pausar(meta.metaAhorroId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Meta pausada',
          detail: `La meta "${meta.nombre}" ha sido pausada`
        });
        this.cargarMetas();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo pausar la meta'
        });
      }
    });
  }

  reactivarMeta(meta: MetaAhorro): void {
    this.metaAhorroService.reactivar(meta.metaAhorroId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Meta reactivada',
          detail: `La meta "${meta.nombre}" está activa nuevamente`
        });
        this.cargarMetas();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo reactivar la meta'
        });
      }
    });
  }

  seleccionarColor(color: string): void {
    this.metaForm.patchValue({ color });
  }

  seleccionarIcono(icono: string): void {
    const currentIcono = this.metaForm.get('icono')?.value;
    this.metaForm.patchValue({ icono: currentIcono === icono ? '' : icono });
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return 'Sin fecha límite';
    return new Date(fecha).toLocaleDateString('es-PE', {
      month: 'short',
      year: 'numeric'
    });
  }

  getProgressColor(meta: MetaAhorro): string {
    if (meta.porcentaje >= 100) return '#22c55e';
    return meta.color || '#22c55e';
  }

  esMetaActiva(meta: MetaAhorro): boolean {
    return meta.estado === EstadoMeta.Activa;
  }

  esMetaPausada(meta: MetaAhorro): boolean {
    return meta.estado === EstadoMeta.Pausada;
  }

  esMetaCompletada(meta: MetaAhorro): boolean {
    return meta.estado === EstadoMeta.Completada;
  }
}
