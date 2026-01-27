import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/home/home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'ingresos',
        loadComponent: () => import('./pages/dashboard/ingresos/ingresos.component').then(m => m.IngresosComponent)
      },
      {
        path: 'gastos',
        loadComponent: () => import('./pages/dashboard/gastos/gastos.component').then(m => m.GastosComponent)
      },
      {
        path: 'presupuestos',
        loadComponent: () => import('./pages/dashboard/presupuestos/presupuestos.component').then(m => m.PresupuestosComponent)
      },
      {
        path: 'metas',
        loadComponent: () => import('./pages/dashboard/metas/metas.component').then(m => m.MetasComponent)
      },
      {
        path: 'recordatorios',
        loadComponent: () => import('./pages/dashboard/recordatorios/recordatorios.component').then(m => m.RecordatoriosComponent)
      },
      {
        path: 'asesoria-ia',
        loadComponent: () => import('./pages/dashboard/asesoria-ia/asesoria-ia.component').then(m => m.AsesoriaIaComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/dashboard/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
