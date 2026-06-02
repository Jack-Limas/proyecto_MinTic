import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { HuespedService } from '../../services/huesped.service';
import { HabitacionService } from '../../services/habitacion.service';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly huespedService = inject(HuespedService);
  private readonly habitacionService = inject(HabitacionService);
  private readonly reservaService = inject(ReservaService);
  private readonly cdr = inject(ChangeDetectorRef);

  totalHuespedes = 0;
  totalHabitaciones = 0;
  habitacionesDisponibles = 0;
  totalReservas = 0;
  ultimasReservas: any[] = [];
  loading = true;

  ngOnInit(): void {
    forkJoin({
      huespedes: this.huespedService.listar(),
      habitaciones: this.habitacionService.listar(),
      disponibles: this.habitacionService.listarDisponibles(),
      reservas: this.reservaService.listar()
    }).subscribe({
      next: (data) => {
        this.totalHuespedes = data.huespedes.length;
        this.totalHabitaciones = data.habitaciones.length;
        this.habitacionesDisponibles = data.disponibles.length;
        this.totalReservas = data.reservas.length;
        this.ultimasReservas = data.reservas.slice(0, 5);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }
}
