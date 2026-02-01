import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GastoService } from '../../../services/gasto.service';
import {
  Gasto,
  CategoriaGasto,
  ResumenGastos
} from '../../../models/gasto.model';

interface MesOption {
  label: string;
  mes: number;
  anio: number;
}

@Component({
  selector: 'app-gastos',
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
    TextareaModule,
    IconFieldModule,
    InputIconModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './gastos.component.html'
})
export class GastosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly gastoService = inject(GastoService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Estado
  gastos: Gasto[] = [];
  categorias: CategoriaGasto[] = [];
  resumen: ResumenGastos | null = null;
  isLoading = false;
  isSaving = false;
  showDialog = false;
  isEditing = false;
  selectedGastoId: number | null = null;

  // Filtros
  searchTerm = '';
  selectedCategoriaId: number | null = null;
  selectedMes: MesOption | null = null;

  // Opciones de filtro
  mesesOptions: MesOption[] = [];
  today = new Date(); // Se ajustará en el constructor o ngOnInit

  // Formulario
  gastoForm: FormGroup = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    monto: [null, [Validators.required, Validators.min(0.01)]],
    categoriaId: [null],
    categoriaNombre: [''],
    fechaGasto: [new Date()],
    notas: ['']
  });

  // Getters para filtros
  get gastosFiltrados(): Gasto[] {
    let resultado = this.gastos;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(g =>
        g.descripcion.toLowerCase().includes(term) ||
        g.categoriaNombre.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategoriaId) {
      resultado = resultado.filter(g => g.categoriaId === this.selectedCategoriaId);
    }

    return resultado;
  }

  ngOnInit(): void {
    // Ajustar today al final del día para permitir seleccionar cualquier hora de hoy
    this.today.setHours(23, 59, 59, 999);

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

    // Cargar gastos, categorías y resumen en paralelo
    Promise.all([
      this.gastoService.getGastos(mes, anio).toPromise(),
      this.gastoService.getCategorias().toPromise(),
      this.gastoService.getResumen().toPromise()
    ]).then(([gastos, categorias, resumen]) => {
      this.gastos = gastos || [];
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
    this.selectedGastoId = null;
    this.gastoForm.reset({
      descripcion: '',
      monto: null,
      categoriaId: null,
      categoriaNombre: '',
      fechaGasto: new Date(),
      notas: ''
    });
    this.showDialog = true;
  }

  abrirDialogoEditar(gasto: Gasto): void {
    this.isEditing = true;
    this.selectedGastoId = gasto.gastoRealId;
    // Asegurar que la fecha sea un objeto Date válido
    let fecha = new Date();
    if (gasto.fechaGasto) {
      // Intentar parsear la fecha directamente
      const parsedDate = new Date(gasto.fechaGasto);
      if (!isNaN(parsedDate.getTime())) {
        fecha = parsedDate;
      }
    }

    this.gastoForm.patchValue({
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      categoriaId: gasto.categoriaId,
      categoriaNombre: '',
      fechaGasto: fecha,
      notas: gasto.notas || ''
    });
    this.showDialog = true;
  }

  guardarGasto(): void {
    if (this.gastoForm.invalid) {
      this.gastoForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.gastoForm.value;

    if (this.isEditing && this.selectedGastoId) {
      // Actualizar
      this.gastoService.actualizar(this.selectedGastoId, {
        descripcion: formValue.descripcion,
        monto: formValue.monto,
        categoriaId: formValue.categoriaId,
        fechaGasto: formValue.fechaGasto?.toISOString(),
        notas: formValue.notas || undefined
      }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Gasto actualizado correctamente'
          });
          this.showDialog = false;
          this.isSaving = false;
          this.cargarDatos();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'No se pudo actualizar el gasto'
          });
          this.isSaving = false;
        }
      });
    } else {
      // Crear
      this.gastoService.crear({
        descripcion: formValue.descripcion,
        monto: formValue.monto,
        categoriaId: formValue.categoriaId || undefined,
        categoriaNombre: formValue.categoriaNombre || undefined,
        fechaGasto: formValue.fechaGasto?.toISOString(),
        notas: formValue.notas || undefined
      }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Gasto registrado correctamente'
          });
          this.showDialog = false;
          this.isSaving = false;
          this.cargarDatos();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'No se pudo registrar el gasto'
          });
          this.isSaving = false;
        }
      });
    }
  }

  confirmarEliminar(gasto: Gasto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar "${gasto.descripcion}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminarGasto(gasto)
    });
  }

  eliminarGasto(gasto: Gasto): void {
    this.gastoService.eliminar(gasto.gastoRealId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Gasto eliminado correctamente'
        });
        this.cargarDatos();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo eliminar el gasto'
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
