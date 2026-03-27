import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 style="margin-bottom: 1.5rem;">Food Menu</h2>
    <div class="grid">
      @for (p of products; track p.id) {
        <div class="card">
          <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">{{ p.name }}</h3>
          <p style="color: var(--text-muted); margin-bottom: 1rem;">{{ p.description }}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span style="font-weight: 700; font-size: 1.25rem; color: var(--text-main);">₹{{ p.price }}</span>
            <span class="badge" [style.background]="p.stock < 5 ? 'var(--danger)' : 'var(--primary)'">
              {{ p.stock }} left
            </span>
          </div>
          <button class="btn" style="width: 100%;" [disabled]="p.stock === 0" (click)="addToCart(p)">
            {{ p.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
          </button>
        </div>
      }
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private api: ApiService, private auth: AuthService, private cart: CartService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getProducts().subscribe({
      next: res => {
        this.products = res;
        this.cdr.detectChanges();
      },
      error: err => console.error('Failed to fetch products', err)
    });
  }

  addToCart(product: any) {
    if (!this.auth.isAuthenticated()) {
      alert('Please login to add items to cart.');
      return;
    }
    this.api.addToCart(product.id, 1).subscribe({
      next: () => {
        this.cart.refreshCart();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.auth.logout();
          alert('Session expired or database reset. Please login again.');
        } else {
          alert('Failed to add to cart.');
        }
        this.cdr.detectChanges();
      }
    });
  }
}
