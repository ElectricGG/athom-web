import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { IngresoService } from '../../../services/ingreso.service';
import {
  Ingreso,
  CategoriaIngreso,
  ResumenIngresos
} from '../../../models/ingreso.model';

interface MesOption {
  label: string;
  mes: number;
  anio: number;
}

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    InputNumberModule,
    DatePickerModule,
    ToastModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './ingresos.component.html'
})
export class IngresosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ingresoService = inject(IngresoService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Estado
  ingresos: Ingreso[] = [];
  categorias: CategoriaIngreso[] = [];
  resumen: ResumenIngresos | null = null;
  isLoading = false;
  isSaving = false;
  showDialog = false;
  isEditing = false;
  selectedIngresoId: number | null = null;

  // Filtros
  searchTerm = '';
  selectedCategoriaId: number | null = null;
  selectedMes: MesOption | null = null;

  // Opciones de filtro
  mesesOptions: MesOption[] = [];
  today = new Date();

  // Formulario
  ingresoForm: FormGroup = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    monto: [null, [Validators.required, Validators.min(0.01)]],
    categoriaId: [null],
    categoriaNombre: [''],
    fechaRegistro: [new Date()]
  });

  // Getters para filtros
  get ingresosFiltrados(): Ingreso[] {
    let resultado = this.ingresos;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(i =>
        i.descripcion.toLowerCase().includes(term) ||
        i.categoriaNombre.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategoriaId) {
      resultado = resultado.filter(i => i.categoriaId === this.selectedCategoriaId);
    }

    return resultado;
  }

  ngOnInit(): void {
    this.inicializarMeses();
    this.cargarDatos();
  }

  private inicializarMeses(): void {
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const fecha = new Date(now.getFullYear(), now.getMonth() - i, 1);
      this.mesesOptions.push({
        label: this.formatearMes(fecha),
        mes: fecha.getMonth() + 1,
        anio: fecha.getFullYear()
      });
    }
    this.selectedMes = this.mesesOptions[0];
  }

  private formatearMes(fecha: Date): string {
    return fecha.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
  }

  cargarDatos(): void {
    this.isLoading = true;
    const mes = this.selectedMes?.mes;
    const anio = this.selectedMes?.anio;

    // Cargar ingresos, categorías y resumen en paralelo
    Promise.all([
      this.ingresoService.getIngresos(mes, anio).toPromise(),
      this.ingresoService.getCategorias().toPromise(),
      this.ingresoService.getResumen().toPromise()
    ]).then(([ingresos, categorias, resumen]) => {
      this.ingresos = ingresos || [];
      this.categorias = categorias || [];
      this.resumen = resumen || null;
      this.isLoading = false;
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los datos'
      });
      this.isLoading = false;
    });
  }

  onMesChange(): void {
    this.cargarDatos();
  }

  abrirDialogoNuevo(): void {
    this.isEditing = false;
    this.selectedIngresoId = null;
    this.ingresoForm.reset({
      descripcion: '',
      monto: null,
      categoriaId: null,
      categoriaNombre: '',
      fechaRegistro: new Date()
    });
    this.showDialog = true;
  }

  abrirDialogoEditar(ingreso: Ingreso): void {
    this.isEditing = true;
    this.selectedIngresoId = ingreso.ingresoId;
    this.ingresoForm.patchValue({
      descripcion: ingreso.descripcion,
      monto: ingreso.monto,
      categoriaId: ingreso.categoriaId,
      categoriaNombre: '',
      fechaRegistro: new Date(ingreso.fechaRegistro)
    });
    this.showDialog = true;
  }

  guardarIngreso(): void {
    if (this.ingresoForm.invalid) {
      this.ingresoForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.ingresoForm.value;

    if (this.isEditing && this.selectedIngresoId) {
      // Actualizar
      this.ingresoService.actualizar(this.selectedIngresoId, {
        descripcion: formValue.descripcion,
        monto: formValue.monto,
        categoriaId: formValue.categoriaId,
        fechaRegistro: formValue.fechaRegistro?.toISOString()
      }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Ingreso actualizado correctamente'
          });
          this.showDialog = false;
          this.isSaving = false;
          this.cargarDatos();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'No se pudo actualizar el ingreso'
          });
          this.isSaving = false;
        }
      });
    } else {
      // Crear
      this.ingresoService.crear({
        descripcion: formValue.descripcion,
        monto: formValue.monto,
        categoriaId: formValue.categoriaId || undefined,
        categoriaNombre: formValue.categoriaNombre || undefined,
        fechaRegistro: formValue.fechaRegistro?.toISOString()
      }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Ingreso registrado correctamente'
          });
          this.showDialog = false;
          this.isSaving = false;
          this.cargarDatos();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'No se pudo registrar el ingreso'
          });
          this.isSaving = false;
        }
      });
    }
  }

  confirmarEliminar(ingreso: Ingreso): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar "${ingreso.descripcion}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminarIngreso(ingreso)
    });
  }

  eliminarIngreso(ingreso: Ingreso): void {
    this.ingresoService.eliminar(ingreso.ingresoId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Ingreso eliminado correctamente'
        });
        this.cargarDatos();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo eliminar el ingreso'
        });
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.selectedCategoriaId = null;
  }
}
