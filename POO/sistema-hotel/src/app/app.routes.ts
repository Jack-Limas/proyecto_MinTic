import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HuespedesComponent } from './components/huespedes/huespedes.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'huespedes', component: HuespedesComponent },
      { path: 'habitaciones', component: HabitacionesComponent },
      { path: 'reservas', component: ReservasComponent },
      { path: 'reservas/nueva', component: ReservasComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'facturas', component: FacturasComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
