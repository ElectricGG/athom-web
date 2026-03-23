import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PresupuestoService } from '../../../services/presupuesto.service';
import { PerfilService } from '../../../services/perfil.service';
import { CurrencyService } from '../../../services/currency.service';
import {
  PresupuestoEstimado,
  PresupuestoCategoria,
  ResumenPresupuesto,
  CategoriaDisponible
} from '../../../models/presupuesto.model';

interface MesOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressBarModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './presupuestos.component.html'
})
export class PresupuestosComponent implements OnInit {
  protected readonly Math = Math;

  private readonly fb = inject(FormBuilder);
  private readonly presupuestoService = inject(PresupuestoService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly perfilService = inject(PerfilService);
  private readonly currencyService = inject(CurrencyService);

  // Moneda
  cs = 'S/';
  currencyCode = 'PEN';
  currencyLocale = 'es-PE';

  // Estado principal
  presupuestos = signal<PresupuestoEstimado[]>([]);
  presupuestoSeleccionado = signal<PresupuestoEstimado | null>(null);
  categorias = signal<PresupuestoCategoria[]>([]);
  resumen = signal<ResumenPresupuesto | null>(null);
  categoriasDisponibles = signal<CategoriaDisponible[]>([]);

  // Estado de carga
  isLoading = signal(false);
  isLoadingDetalle = signal(false);
  isSaving = signal(false);

  // Diálogos
  showDialogPresupuesto = signal(false);
  showDialogCategoria = signal(false);
  isEditingPresupuesto = signal(false);
  isEditingCategoria = signal(false);
  selectedCategoriaId = signal<number | null>(null);

  // Opciones de meses
  mesesOptions: MesOption[] = [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 }
  ];

  aniosOptions: number[] = [];

  // Formularios
  presupuestoForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    mes: [null, Validators.required],
    anio: [null, Validators.required]
  });

  categoriaForm: FormGroup = this.fb.group({
    categoriaId: [null, Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    monto: [null, [Validators.required, Validators.min(1)]]
  });

  // Computed
  categoriasOrdenadas = computed(() => {
    return [...this.categorias()].sort((a, b) => {
      const porcentajeA = a.monto > 0 ? (a.montoGastado / a.monto) * 100 : 0;
      const porcentajeB = b.monto > 0 ? (b.montoGastado / b.monto) * 100 : 0;
      return porcentajeB - porcentajeA;
    });
  });

  categoriasSinPresupuesto = computed(() => {
    return this.categoriasDisponibles().filter(c => !c.tienePresupuesto);
  });

  ngOnInit(): void {
    this.perfilService.getPerfil().subscribe(perfil => {
      const config = this.currencyService.getConfig(perfil.codigoPais);
      this.cs = config.symbol;
      this.currencyCode = config.code;
      this.currencyLocale = config.locale;
    });

    this.inicializarAnios();
    this.cargarPresupuestos();
  }

  private inicializarAnios(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      this.aniosOptions.push(i);
    }
  }

  // =====================
  // PRESUPUESTOS MENSUALES
  // =====================

  cargarPresupuestos(): void {
    this.isLoading.set(true);
    this.presupuestoService.getPresupuestos().subscribe({
      next: (data) => {
        this.presupuestos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los presupuestos'
        });
        this.isLoading.set(false);
      }
    });
  }

  seleccionarPresupuesto(presupuesto: PresupuestoEstimado): void {
    this.presupuestoSeleccionado.set(presupuesto);
    this.cargarDetallePresupuesto(presupuesto.presupuestoId);
  }

  volverALista(): void {
    this.presupuestoSeleccionado.set(null);
    this.categorias.set([]);
    this.resumen.set(null);
  }

  cargarDetallePresupuesto(presupuestoId: number): void {
    this.isLoadingDetalle.set(true);

    Promise.all([
      this.presupuestoService.getCategoriasPresupuesto(presupuestoId).toPromise(),
      this.presupuestoService.getResumen(presupuestoId).toPromise(),
      this.presupuestoService.getCategoriasDisponibles(presupuestoId).toPromise()
    ]).then(([categorias, resumen, disponibles]) => {
      this.categorias.set(categorias || []);
      this.resumen.set(resumen || null);
      this.categoriasDisponibles.set(disponibles || []);
      this.isLoadingDetalle.set(false);
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar el detalle del presupuesto'
      });
      this.isLoadingDetalle.set(false);
    });
  }

  abrirDialogoNuevoPresupuesto(): void {
    this.isEditingPresupuesto.set(false);
    const now = new Date();
    this.presupuestoForm.reset({
      nombre: '',
      mes: now.getMonth() + 1,
      anio: now.getFullYear()
    });
    this.showDialogPresupuesto.set(true);
  }

  abrirDialogoEditarPresupuesto(presupuesto: PresupuestoEstimado, event: Event): void {
    event.stopPropagation();
    this.isEditingPresupuesto.set(true);
    this.presupuestoForm.patchValue({
      nombre: presupuesto.nombre,
      mes: presupuesto.mes,
      anio: presupuesto.anio
    });
    this.showDialogPresupuesto.set(true);
  }

  guardarPresupuesto(): void {
    if (this.presupuestoForm.invalid) {
      this.presupuestoForm.markAllAsTouched();
      return;
    }

    const formValue = this.presupuestoForm.value;
    this.isSaving.set(true);

    if (this.isEditingPresupuesto()) {
      const presupuesto = this.presupuestoSeleccionado();
      if (!presupuesto) return;

      this.presupuestoService.actualizarPresupuesto(presupuesto.presupuestoId, {
        nombre: formValue.nombre,
        mes: formValue.mes,
        anio: formValue.anio
      }).subscribe({
        next: (updated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Presupuesto actualizado correctamente'
          });
          this.presupuestoSeleccionado.set(updated);
          this.showDialogPresupuesto.set(false);
          this.isSaving.set(false);
          this.cargarPresupuestos();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el presupuesto'
          });
          this.isSaving.set(false);
        }
      });
    } else {
      this.presupuestoService.crearPresupuesto({
        nombre: formValue.nombre,
        mes: formValue.mes,
        anio: formValue.anio
      }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Presupuesto creado correctamente'
          });
          this.showDialogPresupuesto.set(false);
          this.isSaving.set(false);
          this.cargarPresupuestos();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el presupuesto'
          });
          this.isSaving.set(false);
        }
      });
    }
  }

  confirmarEliminarPresupuesto(presupuesto: PresupuestoEstimado, event: Event): void {
    event.stopPropagation();
    this.confirmationService.confirm({
      message: `¿Eliminar "${presupuesto.nombre}"? Se eliminarán también todas las categorías asociadas.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminarPresupuesto(presupuesto)
    });
  }

  eliminarPresupuesto(presupuesto: PresupuestoEstimado): void {
    this.presupuestoService.eliminarPresupuesto(presupuesto.presupuestoId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Presupuesto eliminado correctamente'
        });
        if (this.presupuestoSeleccionado()?.presupuestoId === presupuesto.presupuestoId) {
          this.volverALista();
        }
        this.cargarPresupuestos();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el presupuesto'
        });
      }
    });
  }

  // =====================
  // CATEGORÍAS
  // =====================

  abrirDialogoNuevaCategoria(): void {
    this.isEditingCategoria.set(false);
    this.selectedCategoriaId.set(null);
    this.categoriaForm.reset({
      categoriaId: null,
      descripcion: '',
      monto: null
    });
    this.showDialogCategoria.set(true);
  }

  abrirDialogoAgregarRapida(categoria: CategoriaDisponible): void {
    this.isEditingCategoria.set(false);
    this.selectedCategoriaId.set(null);
    this.categoriaForm.reset({
      categoriaId: categoria.categoriaId,
      descripcion: `Presupuesto para ${categoria.nombreCategoria}`,
      monto: null
    });
    this.showDialogCategoria.set(true);
  }

  abrirDialogoEditarCategoria(cat: PresupuestoCategoria): void {
    this.isEditingCategoria.set(true);
    this.selectedCategoriaId.set(cat.presupuestoCategoriaId);
    this.categoriaForm.patchValue({
      categoriaId: cat.categoriaId,
      descripcion: cat.descripcion,
      monto: cat.monto
    });
    this.showDialogCategoria.set(true);
  }

  guardarCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    const presupuesto = this.presupuestoSeleccionado();
    if (!presupuesto) return;

    const formValue = this.categoriaForm.value;
    this.isSaving.set(true);

    if (this.isEditingCategoria() && this.selectedCategoriaId()) {
      this.presupuestoService.actualizarCategoria(
        presupuesto.presupuestoId,
        this.selectedCategoriaId()!,
        {
          descripcion: formValue.descripcion,
          monto: formValue.monto
        }
      ).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Categoría actualizada correctamente'
          });
          this.showDialogCategoria.set(false);
          this.isSaving.set(false);
          this.cargarDetallePresupuesto(presupuesto.presupuestoId);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la categoría'
          });
          this.isSaving.set(false);
        }
      });
    } else {
      this.presupuestoService.agregarCategoria(presupuesto.presupuestoId, {
        categoriaId: formValue.categoriaId,
        descripcion: formValue.descripcion,
        monto: formValue.monto
      }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Agregado',
            detail: 'Categoría agregada al presupuesto'
          });
          this.showDialogCategoria.set(false);
          this.isSaving.set(false);
          this.cargarDetallePresupuesto(presupuesto.presupuestoId);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo agregar la categoría'
          });
          this.isSaving.set(false);
        }
      });
    }
  }

  confirmarEliminarCategoria(cat: PresupuestoCategoria): void {
    this.confirmationService.confirm({
      message: `¿Eliminar el presupuesto de "${cat.categoriaNombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminarCategoria(cat)
    });
  }

  eliminarCategoria(cat: PresupuestoCategoria): void {
    const presupuesto = this.presupuestoSeleccionado();
    if (!presupuesto) return;

    this.presupuestoService.eliminarCategoria(presupuesto.presupuestoId, cat.presupuestoCategoriaId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Categoría eliminada del presupuesto'
        });
        this.cargarDetallePresupuesto(presupuesto.presupuestoId);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la categoría'
        });
      }
    });
  }

  // =====================
  // UTILIDADES
  // =====================

  getPorcentaje(cat: PresupuestoCategoria): number {
    if (cat.monto <= 0) return 0;
    return Math.round((cat.montoGastado / cat.monto) * 100);
  }

  getColorBarra(porcentaje: number): string {
    if (porcentaje >= 100) return '#ef4444';
    if (porcentaje >= 80) return '#f59e0b';
    return '#22c55e';
  }

  getEstadoCategoria(cat: PresupuestoCategoria): { label: string; class: string } {
    const porcentaje = this.getPorcentaje(cat);
    if (porcentaje >= 100) {
      return { label: 'Excedido', class: 'bg-red-100 text-red-700' };
    }
    if (porcentaje >= 80) {
      return { label: 'Cerca del límite', class: 'bg-amber-100 text-amber-700' };
    }
    return { label: 'En control', class: 'bg-green-100 text-green-700' };
  }

  getTotalPresupuesto(presupuesto: PresupuestoEstimado): number {
    return presupuesto.totalPresupuestado ?? 0;
  }

  getTotalGastado(presupuesto: PresupuestoEstimado): number {
    return presupuesto.totalGastado ?? 0;
  }

  getCantidadCategorias(presupuesto: PresupuestoEstimado): number {
    return presupuesto.cantidadCategorias ?? 0;
  }

  getPorcentajePresupuesto(presupuesto: PresupuestoEstimado): number {
    const total = presupuesto.totalPresupuestado ?? 0;
    const gastado = presupuesto.totalGastado ?? 0;
    if (total <= 0) return 0;
    return Math.round((gastado / total) * 100);
  }

  formatearMesAnio(mes: number, anio: number): string {
    const fecha = new Date(anio, mes - 1, 1);
    return fecha.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  }

  esMesActual(presupuesto: PresupuestoEstimado): boolean {
    const now = new Date();
    return presupuesto.mes === now.getMonth() + 1 && presupuesto.anio === now.getFullYear();
  }
}
