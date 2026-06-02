import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  remainingTime = 0;
  renovando = false;
  private timerInterval: any;

  ngOnInit(): void {
    this.remainingTime = this.authService.getRemainingTime();
    this.timerInterval = setInterval(() => {
      this.remainingTime = this.authService.getRemainingTime();
      this.cdr.detectChanges();
      if (this.remainingTime <= 0) {
        this.logout();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  get username(): string {
    return this.authService.getUsername() ?? 'Usuario';
  }

  get timerClass(): string {
    const minutes = this.remainingTime / 60000;
    if (minutes < 2) return 'text-red-500 animate-pulse font-bold';
    if (minutes < 5) return 'text-yellow-500 font-semibold';
    return 'text-green-600 font-semibold';
  }

  formatTime(ms: number): string {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  renovarSesion(): void {
    this.renovando = true;
    this.authService.renovarSesion().subscribe({
      next: (response) => {
        this.authService.saveSession(response);
        this.remainingTime = this.authService.getRemainingTime();
        this.renovando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.renovando = false;
        this.cdr.detectChanges();
        alert('No se pudo renovar la sesión. Por favor inicia sesión nuevamente.');
        this.logout();
      }
    });
  }

  logout(): void {
    clearInterval(this.timerInterval);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
