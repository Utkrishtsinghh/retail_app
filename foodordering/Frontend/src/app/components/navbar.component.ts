import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <header>
      <div style="font-weight: 700; font-size: 1.25rem; color: var(--primary);">
        Foodie Ordering
      </div>
      <nav class="nav-links">
        <a routerLink="/products">Menu</a>
        
        @if (!(authService.authStatus | async)) {
          <a routerLink="/login" class="btn btn-secondary">Login</a>
          <a routerLink="/register" class="btn">Register</a>
        }

        @if ((authService.authStatus | async)) {
          @if (!(authService.adminStatus | async)) {
            <a routerLink="/cart">Cart <span class="badge" style="margin-left: 0.25rem; font-size: 0.75rem;">{{ cartService.cartCount | async }}</span></a>
            <a routerLink="/orders">Orders</a>
          }
          @if ((authService.adminStatus | async)) {
            <a routerLink="/admin">Admin Dashboard</a>
          }
          <button class="btn btn-secondary" (click)="logout()">Logout</button>
        }
      </nav>
    </header>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService, public cartService: CartService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.cartService.cartCount.next(0);
    this.router.navigate(['/login']);
  }
}
