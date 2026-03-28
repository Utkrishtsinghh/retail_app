import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="card" style="max-width: 400px; margin: 4rem auto;">
      <h2 style="margin-bottom: 1.5rem; text-align: center;">Create an Account</h2>
      @if (error) {
        <div style="color: var(--danger); margin-bottom: 1rem;">{{ error }}</div>
      }
      
      <form (ngSubmit)="onSubmit()">
        <label style="display: block; margin-bottom: 0.5rem;">Username</label>
        <input type="text" [(ngModel)]="username" name="username" required>
        
        <label style="display: block; margin-bottom: 0.5rem;">Password</label>
        <input type="password" [(ngModel)]="password" name="password" required>
        
        <button type="submit" class="btn" style="width: 100%;">Register</button>
      </form>
      <div style="margin-top: 1rem; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
        Already have an account? <a routerLink="/login" style="color: var(--primary);">Login</a>
      </div>
    </div>
  `
})
export class RegisterComponent {
  username = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  onSubmit() {
    this.api.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => this.error = err.error?.message || 'Registration failed'
    });
  }
}
