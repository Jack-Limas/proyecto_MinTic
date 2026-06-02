import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { FacturaService } from '../../services/factura.service';
import { ReservaService } from '../../services/reserva.service';
import { Factura, Pago } from '../../models/factura.model';
import { Reserva } from '../../models/reserva.model';

// MODULARIDAD — responsabilidad única: gestionar facturas y pagos
// ENCAPSULAMIENTO — acceso a datos solo mediante FacturaService y ReservaService

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.scss'
})
export class FacturasComponent implements OnInit {

  // Reservas listas para facturar (estado CHECKOUT sin factura)
  reservasParaFacturar: Reserva[] = [];

  // Facturas ya generadas
  facturas: Factura[] = [];

  // Factura seleccionada para ver detalle
  facturaSeleccionada: Factura | null = null;

  // Formulario de pago
  pagoForm = {
    monto: 0,
    metodoPago: 'EFECTIVO' as 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'
  };

  loading = false;
  loadingPago = false;
  error = '';
  exito = '';

  constructor(
    private facturaService: FacturaService,
    private reservaService: ReservaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.error = '';

    // Carga reservas en CHECKOUT
    this.reservaService.listar().pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (reservas) => {
        // Filtra solo las que están en CHECKOUT
        this.reservasParaFacturar = reservas.filter(r => r.estado === 'CHECKOUT');
        this.cdr.detectChanges();
        // Después carga las facturas existentes
        this.cargarFacturas();
      },
      error: (e) => {
        this.error = 'Error al cargar reservas: ' + (e.message ?? 'Error desconocido');
        this.cdr.detectChanges();
      }
    });
  }

  cargarFacturas() {
    this.facturas = [];
    // Busca facturas por ID del 1 al 50 (workaround sin endpoint listar)
    const ids = Array.from({ length: 50 }, (_, i) => i + 1);
    ids.forEach(id => {
      this.facturaService.obtener(id).subscribe({
        next: (f) => {
          if (f && !this.facturas.find(fa => fa.idFactura === f.idFactura)) {
            this.facturas.push(f);
            // Ordena por ID descendente para mostrar las más recientes primero
            this.facturas.sort((a, b) => (b.idFactura ?? 0) - (a.idFactura ?? 0));
            this.cdr.detectChanges();
          }
        },
        error: () => {} // silencia 404 de facturas que no existen
      });
    });
  }

  generarFactura(idReserva: number) {
    this.loading = true;
    this.error = '';
    this.exito = '';

    this.facturaService.generar(idReserva).pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (factura) => {
        this.exito = 'Factura #' + factura.idFactura +
          ' generada exitosamente. Total: $' + (factura.total?.toLocaleString() ?? 0);
        this.facturaSeleccionada = factura;
        this.pagoForm.monto = factura.total ?? 0;
        // Remueve la reserva de la lista de pendientes
        this.reservasParaFacturar = this.reservasParaFacturar.filter(
          r => r.idReserva !== idReserva
        );
        // Agrega la factura a la lista
        if (!this.facturas.find(f => f.idFactura === factura.idFactura)) {
          this.facturas.unshift(factura);
        }
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.error = 'Error al generar factura: ' + (e.error?.message ?? e.message ?? 'Error desconocido');
        this.cdr.detectChanges();
      }
    });
  }

  verDetalle(factura: Factura) {
    this.facturaSeleccionada = factura;
    this.pagoForm.monto = factura.total ?? 0;
    this.error = '';
    this.exito = '';
    this.cdr.detectChanges();
  }

  registrarPago() {
    if (!this.facturaSeleccionada?.idFactura) return;

    this.loadingPago = true;
    this.error = '';

    const pago: Pago = {
      monto: this.pagoForm.monto,
      metodoPago: this.pagoForm.metodoPago
    };

    this.facturaService.registrarPago(this.facturaSeleccionada.idFactura, pago).pipe(
      finalize(() => { this.loadingPago = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (facturaActualizada) => {
        this.exito = 'Pago registrado. Factura PAGADA.';
        this.facturaSeleccionada = facturaActualizada;
        // Actualiza en la lista
        const idx = this.facturas.findIndex(f => f.idFactura === facturaActualizada.idFactura);
        if (idx >= 0) this.facturas[idx] = facturaActualizada;
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.error = 'Error al registrar pago: ' + (e.message ?? 'Error desconocido');
        this.cdr.detectChanges();
      }
    });
  }

  cerrarDetalle() {
    this.facturaSeleccionada = null;
    this.error = '';
    this.exito = '';
    this.cdr.detectChanges();
  }

  getEstadoBadge(estado: string): string {
    switch (estado) {
      case 'PAGADA': return 'bg-green-100 text-green-800';
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ANULADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
