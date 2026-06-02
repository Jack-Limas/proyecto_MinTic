// MODULARIDAD — este componente tiene una sola responsabilidad:
// gestionar Huéspedes. La lógica de negocio está
// en el backend (Service), el acceso a datos en Repository,
// este componente solo presenta y recoge datos del usuario

// ENCAPSULAMIENTO — los datos se manejan mediante métodos
// públicos del service. El componente no accede directamente
// a la BD ni al token JWT

import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HuespedService } from '../../services/huesped.service';
import { Huesped } from '../../models/huesped.model';

@Component({
  selector: 'app-huespedes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './huespedes.component.html',
  styleUrl: './huespedes.component.scss'
})
export class HuespedesComponent implements OnInit {
  private readonly huespedService = inject(HuespedService);
  private readonly cdr = inject(ChangeDetectorRef);

  huespedes: Huesped[] = [];
  editando = false;
  loading = false;
  error = '';
  exito = '';

  huespedForm: Huesped = this.formVacio();

  private formVacio(): Huesped {
    return { nombre: '', correo: '', telefono: '', tipoDocumento: 'CEDULA', numeroDocumento: '', activo: true };
  }

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading = true;
    this.huespedService.listar().pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (data) => { this.huespedes = data; this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al cargar huéspedes.'; this.cdr.detectChanges(); }
    });
  }

  guardar(): void {
    this.error = ''; this.exito = '';
    if (this.editando && this.huespedForm.idHuesped) {
      this.huespedService.actualizar(this.huespedForm.idHuesped, this.huespedForm).subscribe({
        next: () => { this.exito = 'Huésped actualizado.'; this.cancelar(); this.cargar(); this.cdr.detectChanges(); },
        error: () => { this.error = 'Error al actualizar.'; this.cdr.detectChanges(); }
      });
    } else {
      // ENCAPSULAMIENTO — enviamos el objeto exacto que el backend espera
      const payload: Huesped = {
        nombre: this.huespedForm.nombre,
        correo: this.huespedForm.correo,
        telefono: this.huespedForm.telefono,
        tipoDocumento: this.huespedForm.tipoDocumento,
        numeroDocumento: this.huespedForm.numeroDocumento,
        activo: true
      };
      this.huespedService.crear(payload).subscribe({
        next: () => { this.exito = 'Huésped creado.'; this.cancelar(); this.cargar(); this.cdr.detectChanges(); },
        error: () => { this.error = 'Error al crear.'; this.cdr.detectChanges(); }
      });
    }
  }

  editar(h: Huesped): void {
    this.huespedForm = { ...h };
    this.editando = true;
    this.error = ''; this.exito = '';
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este huésped?')) return;
    this.huespedService.eliminar(id).subscribe({
      next: () => { this.exito = 'Huésped eliminado.'; this.cargar(); this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al eliminar.'; this.cdr.detectChanges(); }
    });
  }

  cancelar(): void {
    this.huespedForm = this.formVacio();
    this.editando = false;
  }
}
