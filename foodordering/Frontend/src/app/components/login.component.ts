import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="card" style="max-width: 400px; margin: 4rem auto;">
      <h2 style="margin-bottom: 1.5rem; text-align: center;">Login</h2>
      @if (error) {
        <div style="color: var(--danger); margin-bottom: 1rem;">{{ error }}</div>
      }
      
      <form (ngSubmit)="onSubmit()">
        <label style="display: block; margin-bottom: 0.5rem;">Username</label>
        <input type="text" [(ngModel)]="username" name="username" required>
        
        <label style="display: block; margin-bottom: 0.5rem;">Password</label>
        <input type="password" [(ngModel)]="password" name="password" required>
        
        <button type="submit" class="btn" style="width: 100%;">Login</button>
      </form>
      <div style="margin-top: 1rem; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
        Admin login? <a href="#" (click)="adminLogin($event)" style="color: var(--primary);">Click here</a>. Don't have an account? <a routerLink="/register" style="color: var(--primary);">Register</a>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.token, res.role);
        this.router.navigate(['/products']);
      },
      error: (err) => this.error = 'Invalid credentials'
    });
  }

  adminLogin(e: Event) {
    e.preventDefault();
    this.api.adminLogin({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.token, res.role);
        this.router.navigate(['/admin']);
      },
      error: (err) => this.error = 'Invalid admin credentials'
    });
  }
}
