// RECURSIVIDAD — el menú se construye recursivamente:
// NIVEL 1 (raíz): opciones sin padre — ej: "Sistema Hotel"
// NIVEL 2 (hijos): opciones con padre nivel 1 — ej: "Gestión"
// NIVEL 3 (nietos): opciones con padre nivel 2 — ej: "Huéspedes"
// El componente renderiza cada nivel consultando opcion.hijos
// Si un nodo tiene hijos se muestra expandible con flecha
// tieneHijos(opcion) es el caso base de la recursividad:
// si no tiene hijos retorna false y no renderiza subnivel

// FLUJO COMPLETO DE RECURSIVIDAD:
// 1. Backend: OpcionMenuRepository busca opciones raíz por rol
// 2. Backend: MenuService.construirHijos() recorre árbol recursivo
// 3. Backend: MenuController expone GET /api/menu con JWT
// 4. Frontend: MenuService llama GET /api/menu
// 5. Frontend: SidebarComponent recibe List<OpcionMenu> con hijos
// 6. Frontend: template renderiza nivel 1, dentro nivel 2,
//    dentro nivel 3 — estructura de árbol completa

import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { OpcionMenu } from '../../models/menu.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  @Input() open = true;

  private readonly menuService = inject(MenuService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  opciones: OpcionMenu[] = [];
  expandidos = new Set<number>();

  // Menú de respaldo cuando el backend no responde
  defaultMenu: OpcionMenu[] = [
    {
      id: 0, nombre: 'SISTEMA HOTEL', ruta: null as any,
      icono: '', orden: 0, activo: true, rol: 'ADMIN',
      hijos: [
        { id: 1, nombre: 'Dashboard', ruta: '/admin/dashboard', icono: '📊', orden: 1, activo: true, rol: 'ADMIN' },
        {
          id: 10, nombre: 'Gestión', ruta: null as any, icono: '', orden: 2, activo: true, rol: 'ADMIN',
          hijos: [
            { id: 2, nombre: 'Huéspedes', ruta: '/admin/huespedes', icono: '', orden: 1, activo: true, rol: 'ADMIN' },
            { id: 3, nombre: 'Habitaciones', ruta: '/admin/habitaciones', icono: '', orden: 2, activo: true, rol: 'ADMIN' },
            { id: 4, nombre: 'Reservas', ruta: '/admin/reservas', icono: '', orden: 3, activo: true, rol: 'ADMIN' },
            { id: 5, nombre: 'Servicios', ruta: '/admin/servicios', icono: '', orden: 4, activo: true, rol: 'ADMIN' },
            { id: 6, nombre: 'Facturas', ruta: '/admin/facturas', icono: '', orden: 5, activo: true, rol: 'ADMIN' },
          ]
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.menuService.getMenu().subscribe({
      next: (data) => {
        this.opciones = data && data.length > 0 ? data : this.defaultMenu;
        this.cdr.detectChanges();
      },
      error: () => {
        this.opciones = this.defaultMenu;
        this.cdr.detectChanges();
      }
    });
  }

  toggleExpand(id: number): void {
    if (this.expandidos.has(id)) {
      this.expandidos.delete(id);
    } else {
      this.expandidos.add(id);
    }
  }

  isExpanded(id: number): boolean {
    return this.expandidos.has(id);
  }

  // CASO BASE RECURSIVIDAD: si no tiene hijos retorna false y no renderiza subnivel
  tieneHijos(opcion: OpcionMenu): boolean {
    return !!(opcion.hijos && opcion.hijos.length > 0);
  }

  isActive(ruta: string | null): boolean {
    if (!ruta) return false;
    return this.router.url === ruta || this.router.url.startsWith(ruta);
  }

  getUsername(): string {
    return this.authService.getUsername() || 'Usuario';
  }

  getInitial(): string {
    return this.getUsername().charAt(0).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
