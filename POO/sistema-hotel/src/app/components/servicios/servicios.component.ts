// MODULARIDAD — este componente tiene una sola responsabilidad:
// gestionar Servicios. La lógica de negocio está
// en el backend (Service), el acceso a datos en Repository,
// este componente solo presenta y recoge datos del usuario

// ENCAPSULAMIENTO — los datos se manejan mediante métodos
// públicos del service. El componente no accede directamente
// a la BD ni al token JWT

import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ServicioService } from '../../services/servicio.service';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})
export class ServiciosComponent implements OnInit {
  private readonly servicioService = inject(ServicioService);
  private readonly cdr = inject(ChangeDetectorRef);

  servicios: Servicio[] = [];
  editando = false;
  loading = false;
  error = '';
  exito = '';

  servicioForm: Servicio = this.formVacio();

  private formVacio(): Servicio {
    return { nombre: '', descripcion: '', precio: 0, activo: true };
  }

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading = true;
    this.servicioService.listar().pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (data) => { this.servicios = data; this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al cargar servicios.'; this.cdr.detectChanges(); }
    });
  }

  guardar(): void {
    this.error = ''; this.exito = '';
    this.servicioService.crear(this.servicioForm).subscribe({
      next: () => { this.exito = 'Servicio creado.'; this.cancelar(); this.cargar(); this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al crear servicio.'; this.cdr.detectChanges(); }
    });
  }

  cancelar(): void {
    this.servicioForm = this.formVacio();
    this.editando = false;
  }
}
