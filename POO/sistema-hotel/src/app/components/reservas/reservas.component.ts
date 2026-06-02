// MODULARIDAD — este componente tiene una sola responsabilidad:
// gestionar Reservas. La lógica de negocio está
// en el backend (Service), el acceso a datos en Repository,
// este componente solo presenta y recoge datos del usuario

// ENCAPSULAMIENTO — los datos se manejan mediante métodos
// públicos del service. El componente no accede directamente
// a la BD ni al token JWT

import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ReservaService } from '../../services/reserva.service';
import { HuespedService } from '../../services/huesped.service';
import { HabitacionService } from '../../services/habitacion.service';
import { AuthService } from '../../services/auth.service';
import { Reserva, ReservaRequest } from '../../models/reserva.model';
import { Huesped } from '../../models/huesped.model';
import { Habitacion } from '../../models/habitacion.model';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.scss'
})
export class ReservasComponent implements OnInit {
  private readonly reservaService = inject(ReservaService);
  private readonly huespedService = inject(HuespedService);
  private readonly habitacionService = inject(HabitacionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  reservas: Reserva[] = [];
  huespedes: Huesped[] = [];
  habitacionesDisponibles: Habitacion[] = [];

  // Control del formulario
  mostrarFormulario = false;
  readonly today = new Date().toISOString().split('T')[0];
  loading = false;
  error = '';
  exito = '';

  // Campos del formulario de nueva reserva
  idHuespedSeleccionado: number = 0;
  idHabitacionSeleccionada: number = 0;
  fechaInicio: string = '';
  fechaFin: string = '';
  totalEstimado: number = 0;

  ngOnInit(): void {
    // Auto-mostrar formulario si la URL incluye /nueva
    if (this.router.url.includes('/nueva')) {
      this.mostrarFormulario = true;
    }

    this.loading = true;

    // Carga huéspedes y habitaciones disponibles en paralelo
    forkJoin({
      huespedes: this.huespedService.listar(),
      habitaciones: this.habitacionService.listarDisponibles()
    }).pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (data) => {
        this.huespedes = data.huespedes;
        this.habitacionesDisponibles = data.habitaciones;
        this.cdr.detectChanges();

        // PROBLEMA 3 — Si el usuario es HUESPED, preselecciona su propio registro
        const rol = this.authService.getRol();
        const username = this.authService.getUsername() ?? '';
        if (rol === 'HUESPED' && this.huespedes.length > 0 && username) {
          const encontrado = this.huespedes.find(h =>
            h.nombre.toLowerCase().includes(username.toLowerCase()) ||
            (h.correo ?? '').toLowerCase().split('@')[0] === username.toLowerCase()
          );
          if (encontrado?.idHuesped) {
            this.idHuespedSeleccionado = encontrado.idHuesped;
          }
        }

        // Carga las reservas existentes después
        this.cargarReservas();
      },
      error: (e) => {
        this.error = 'Error al cargar datos: ' + (e.message ?? 'Error desconocido');
        this.cdr.detectChanges();
      }
    });
  }

  cargarReservas(): void {
    this.reservaService.listar().pipe(
      finalize(() => { this.cdr.detectChanges(); })
    ).subscribe({
      next: (data) => { this.reservas = data; this.cdr.detectChanges(); },
      error: (e) => {
        this.error = 'Error al cargar reservas: ' + (e.message ?? 'Error desconocido');
        this.cdr.detectChanges();
      }
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.error = '';
    this.exito = '';
  }

  onHabitacionChange(): void {
    this.calcularTotal();
  }

  calcularTotal(): void {
    if (!this.fechaInicio || !this.fechaFin || !this.idHabitacionSeleccionada) {
      this.totalEstimado = 0;
      return;
    }
    const hab = this.habitacionesDisponibles.find(h => h.idHabitacion === +this.idHabitacionSeleccionada);
    if (!hab) { this.totalEstimado = 0; return; }
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    const noches = Math.max(1, Math.ceil((fin.getTime() - inicio.getTime()) / 86400000));
    this.totalEstimado = noches * (hab.precioBase ?? 0);
    this.cdr.detectChanges();
  }

  calcularNoches(r: Reserva): number {
    if (!r.fechaInicio || !r.fechaFin) return 0;
    const inicio = new Date(r.fechaInicio);
    const fin = new Date(r.fechaFin);
    return Math.max(1, Math.ceil((fin.getTime() - inicio.getTime()) / 86400000));
  }

  guardar(): void {
    this.error = ''; this.exito = '';

    if (!this.idHuespedSeleccionado || !this.idHabitacionSeleccionada || !this.fechaInicio || !this.fechaFin) {
      this.error = 'Completa todos los campos del formulario.';
      this.cdr.detectChanges();
      return;
    }

    if (new Date(this.fechaFin) <= new Date(this.fechaInicio)) {
      this.error = 'La fecha de fin debe ser posterior a la fecha de inicio.';
      this.cdr.detectChanges();
      return;
    }

    // ENCAPSULAMIENTO — construimos el DTO con solo los datos necesarios
    const request: ReservaRequest = {
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      idHuesped: this.idHuespedSeleccionado,
      idHabitacion: this.idHabitacionSeleccionada
    };

    this.loading = true;
    this.reservaService.crearConDTO(request).pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        this.exito = 'Reserva creada correctamente.';
        // Resetear formulario
        this.idHabitacionSeleccionada = 0;
        this.fechaInicio = '';
        this.fechaFin = '';
        this.totalEstimado = 0;
        this.mostrarFormulario = false;
        // Recargar lista y habitaciones disponibles (una ya fue ocupada)
        this.habitacionService.listarDisponibles().subscribe({
          next: (d) => { this.habitacionesDisponibles = d; this.cdr.detectChanges(); }
        });
        this.cargarReservas();
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.error = 'Error al crear reserva: ' + (e.error?.message ?? e.message ?? 'Error desconocido');
        this.cdr.detectChanges();
      }
    });
  }

  checkin(id: number): void {
    this.reservaService.hacerCheckin(id).subscribe({
      next: () => { this.exito = 'Check-in realizado.'; this.cargarReservas(); this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al hacer check-in.'; this.cdr.detectChanges(); }
    });
  }

  checkout(id: number): void {
    this.reservaService.hacerCheckout(id).subscribe({
      next: () => { this.exito = 'Check-out realizado.'; this.cargarReservas(); this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al hacer check-out.'; this.cdr.detectChanges(); }
    });
  }

  cancelarReserva(id: number): void {
    if (!confirm('¿Cancelar esta reserva?')) return;
    this.reservaService.cancelar(id).subscribe({
      next: () => { this.exito = 'Reserva cancelada.'; this.cargarReservas(); this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al cancelar.'; this.cdr.detectChanges(); }
    });
  }

  estadoBadge(estado: string | undefined): string {
    const map: Record<string, string> = {
      'CONFIRMADA': 'bg-green-100 text-green-700',
      'CHECKIN': 'bg-blue-100 text-blue-700',
      'CHECKOUT': 'bg-gray-100 text-gray-600',
      'CANCELADA': 'bg-red-100 text-red-700',
      'PENDIENTE': 'bg-yellow-100 text-yellow-700',
    };
    return map[estado ?? ''] ?? 'bg-gray-100 text-gray-600';
  }
}
