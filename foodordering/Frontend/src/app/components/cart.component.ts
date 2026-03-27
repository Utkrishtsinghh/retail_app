import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 style="margin-bottom: 1.5rem;">Shopping Cart</h2>
    @if (items.length === 0) {
      <div class="card">Your cart is empty.</div>
    }
    
    @if (items.length > 0) {
    <div class="grid">
      <div style="grid-column: span 2;">
        @for (item of items; track item.id) {
        <div class="card" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin-bottom: 0.25rem;">{{ item.product.name }}</h3>
            <p style="color: var(--text-muted);">₹{{ item.product.price }}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <input type="number" [(ngModel)]="item.quantity" (change)="updateItem(item)" style="width: 60px; margin-bottom: 0;" min="1" [max]="item.product.stock">
            <button class="btn btn-secondary btn-danger" (click)="removeItem(item.id)">Remove</button>
          </div>
        </div>
        }
      </div>
      
      <div>
        <div class="card">
          <h3 style="margin-bottom: 1rem;">Order Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-weight: 700; font-size: 1.25rem;">
            <span>Total:</span>
            <span>₹{{ total.toFixed(2) }}</span>
          </div>
          <hr style="margin-bottom: 1rem; border: none; border-top: 1px solid var(--border);">
          <label style="display: block; margin-bottom: 0.5rem;">Delivery Address</label>
          <input type="text" [(ngModel)]="address" placeholder="Enter full address">
          <button class="btn" style="width: 100%;" [disabled]="!address" (click)="checkout()">Checkout</button>
        </div>
      </div>
    </div>
    }
  `
})
export class CartComponent implements OnInit {
  items: any[] = [];
  address = '';

  get total() { return this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0); }

  constructor(private api: ApiService, private cart: CartService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() { 
    this.api.getCart().subscribe({
      next: res => {
        this.items = res;
        this.cdr.detectChanges();
      },
      error: err => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    }); 
  }

  updateItem(item: any) {
    this.api.updateCart(item.productId, item.quantity).subscribe(() => { this.load(); this.cart.refreshCart(); });
  }

  removeItem(id: number) {
    this.api.removeFromCart(id).subscribe(() => { this.load(); this.cart.refreshCart(); });
  }

  checkout() {
    this.api.placeOrder(this.address).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.cart.refreshCart();
        this.router.navigate(['/orders']);
      },
      error: () => alert('Failed to place order.')
    });
  }
}
