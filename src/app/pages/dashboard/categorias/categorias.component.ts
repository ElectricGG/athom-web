import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';
import { IconSelectorComponent } from '../../../shared/components/icon-selector/icon-selector.component';

@Component({
    selector: 'app-categorias',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        TableModule,
        ToastModule,
        ConfirmDialogModule,
        TagModule,
        IconSelectorComponent,
        IconFieldModule,
        InputIconModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './categorias.component.html'
})
export class CategoriasComponent implements OnInit {
    private fb = inject(FormBuilder);
    private categoriaService = inject(CategoriaService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    categorias: Categoria[] = [];
    isLoading = false;
    isSaving = false;
    showDialog = false;
    isEditing = false;
    selectedId: number | null = null;

    // Formulario
    form: FormGroup = this.fb.group({
        nombreCategoria: ['', [Validators.required, Validators.maxLength(50)]],
        tipoCategoria: ['Gasto', [Validators.required]],
        color: ['#3b82f6'],
        icono: ['🏷️'],
        etiqueta: ['']
    });

    // Opciones
    tipos = [
        { label: 'Gasto', value: 'Gasto' },
        { label: 'Ingreso', value: 'Ingreso' },
        { label: 'Ahorro', value: 'Ahorro' }
    ];

    colors = ['#3b82f6', '#ef4444', '#22c55e', '#facc15', '#a855f7', '#ec4899', '#64748b', '#f97316'];

    ngOnInit(): void {
        this.cargarCategorias();
    }

    cargarCategorias(): void {
        this.isLoading = true;
        this.categoriaService.getAll().subscribe({
            next: (data) => {
                this.categorias = data;
                this.isLoading = false;
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las categorías'
                });
                this.isLoading = false;
            }
        });
    }

    abrirDialogoNuevo(): void {
        this.isEditing = false;
        this.selectedId = null;
        this.form.reset({
            nombreCategoria: '',
            tipoCategoria: 'Gasto',
            color: '#3b82f6',
            icono: '🏷️',
            etiqueta: ''
        });
        this.showDialog = true;
    }

    abrirDialogoEditar(categoria: Categoria): void {
        this.isEditing = true;
        this.selectedId = categoria.categoriaId;
        this.form.patchValue({
            nombreCategoria: categoria.nombreCategoria,
            tipoCategoria: categoria.tipoCategoria,
            color: categoria.color || '#3b82f6',
            icono: categoria.icono || '🏷️',
            etiqueta: categoria.etiqueta || ''
        });
        this.showDialog = true;
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSaving = true;
        const request = this.form.value;

        const operacion = this.isEditing && this.selectedId
            ? this.categoriaService.actualizar(this.selectedId, request)
            : this.categoriaService.crear(request);

        operacion.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: this.isEditing ? 'Categoría actualizada' : 'Categoría creada'
                });
                this.showDialog = false;
                this.isSaving = false;
                this.cargarCategorias();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'No se pudo guardar la categoría'
                });
                this.isSaving = false;
            }
        });
    }

    confirmarEliminar(categoria: Categoria): void {
        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar "${categoria.nombreCategoria}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.eliminar(categoria.categoriaId)
        });
    }

    eliminar(id: number): void {
        this.categoriaService.eliminar(id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Categoría eliminada'
                });
                this.cargarCategorias();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'No se pudo eliminar la categoría'
                });
            }
        });
    }

    seleccionarColor(color: string): void {
        this.form.patchValue({ color });
    }



    getBadgeSeverity(tipo: string): 'success' | 'danger' | 'info' | 'warn' | 'secondary' | 'contrast' | undefined {
        if (tipo === 'Ingreso') return 'success';
        if (tipo === 'Ahorro') return 'info';
        return 'danger';
    }
}
