// MODULARIDAD — este componente tiene una sola responsabilidad:
// gestionar Habitaciones. La lógica de negocio está
// en el backend (Service), el acceso a datos en Repository,
// este componente solo presenta y recoge datos del usuario

// ENCAPSULAMIENTO — los datos se manejan mediante métodos
// públicos del service. El componente no accede directamente
// a la BD ni al token JWT

import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HabitacionService } from '../../services/habitacion.service';
import { Habitacion } from '../../models/habitacion.model';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.scss'
})
export class HabitacionesComponent implements OnInit {
  private readonly habitacionService = inject(HabitacionService);
  private readonly cdr = inject(ChangeDetectorRef);

  habitaciones: Habitacion[] = [];
  editando = false;
  loading = false;
  error = '';
  exito = '';

  habitacionForm: Habitacion = this.formVacio();

  private formVacio(): Habitacion {
    return {
      numero: '', piso: 1, capacidad: 2, descripcion: '',
      disponible: true, tipo: 'ESTANDAR', precioBase: 0
    };
  }

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading = true;
    this.habitacionService.listar().pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (data) => { this.habitaciones = data; this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al cargar habitaciones.'; this.cdr.detectChanges(); }
    });
  }

  guardar(): void {
    this.error = ''; this.exito = '';
    if (this.editando && this.habitacionForm.idHabitacion) {
      this.habitacionService.actualizar(this.habitacionForm.idHabitacion, this.habitacionForm).subscribe({
        next: () => { this.exito = 'Habitación actualizada.'; this.cancelar(); this.cargar(); this.cdr.detectChanges(); },
        error: () => { this.error = 'Error al actualizar.'; this.cdr.detectChanges(); }
      });
    } else {
      this.habitacionService.crear(this.habitacionForm).subscribe({
        next: () => { this.exito = 'Habitación creada.'; this.cancelar(); this.cargar(); this.cdr.detectChanges(); },
        error: () => { this.error = 'Error al crear.'; this.cdr.detectChanges(); }
      });
    }
  }

  editar(h: Habitacion): void {
    this.habitacionForm = { ...h };
    this.editando = true;
    this.error = ''; this.exito = '';
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta habitación?')) return;
    this.habitacionService.eliminar(id).subscribe({
      next: () => { this.exito = 'Habitación eliminada.'; this.cargar(); this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al eliminar.'; this.cdr.detectChanges(); }
    });
  }

  cancelar(): void {
    this.habitacionForm = this.formVacio();
    this.editando = false;
  }

  tipoBadgeClass(tipo: string): string {
    const map: Record<string, string> = {
      'SUITE': 'bg-purple-100 text-purple-700',
      'ESTANDAR': 'bg-blue-100 text-blue-700',
      'FAMILIAR': 'bg-green-100 text-green-700',
      'EJECUTIVA': 'bg-yellow-100 text-yellow-700',
    };
    return map[tipo] ?? 'bg-gray-100 text-gray-600';
  }
}
