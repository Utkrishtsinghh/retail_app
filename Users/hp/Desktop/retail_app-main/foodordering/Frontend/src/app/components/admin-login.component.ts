import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="card" style="max-width: 420px; margin: 4rem auto;">
      <h2 style="margin-bottom: 1.5rem; text-align: center;">Admin Login</h2>
      @if (error) {
        <div style="color: var(--danger); margin-bottom: 1rem;">{{ error }}</div>
      }
      <form (ngSubmit)="onSubmit()">
        <label style="display: block; margin-bottom: 0.5rem;">Username</label>
        <input type="text" [(ngModel)]="username" name="username" required>
        
        <label style="display: block; margin-bottom: 0.5rem;">Password</label>
        <input type="password" [(ngModel)]="password" name="password" required>
        
        <button type="submit" class="btn" style="width: 100%; margin-top: 1rem;">Login as Admin</button>
      </form>
      <div style="margin-top: 1rem; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
        Regular user? <a routerLink="/login" style="color: var(--primary);">Go to user login</a>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.api.adminLogin({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.token, res.role);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        if (err.status === 0) {
          this.error = 'API not reachable. Start backend on http://localhost:5196';
        } else {
          this.error = 'Invalid admin credentials';
        }
      }
    });
  }
}
