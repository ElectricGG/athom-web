import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html'
})
export class CategoriesComponent {
  defaultCategories = [
    { name: 'Comida', icon: '🍔' },
    { name: 'Transporte', icon: '🚗' },
    { name: 'Entretenimiento', icon: '🎬' },
    { name: 'Salud', icon: '💊' },
    { name: 'Educación', icon: '📚' },
    { name: 'Servicios', icon: '💡' }
  ];

  categoryExamples = [
    {
      message: 'Crear categoría Mascota',
      response: '✅ Categoría "Mascota" creada exitosamente'
    },
    {
      message: 'Ver mis categorías',
      response: '📂 Tus categorías:\n• Comida\n• Transporte\n• Mascota\n• Servicios\n• Entretenimiento'
    },
    {
      message: 'Renombrar Mascota a Veterinaria',
      response: '✅ Categoría actualizada: "Veterinaria"'
    }
  ];
}
