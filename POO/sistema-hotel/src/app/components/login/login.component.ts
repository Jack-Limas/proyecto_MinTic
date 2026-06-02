import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  loading = false;
  error = '';

  login(): void {
    if (!this.username || !this.password) {
      this.error = 'Por favor ingresa usuario y contraseña.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        this.authService.saveSession(response);
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.error = 'Credenciales inválidas. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }
}
