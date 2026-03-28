import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 style="margin-bottom: 1.5rem;">Your Orders</h2>
    @if (orders.length === 0) {
      <div class="card">You have no orders yet.</div>
    }
    
    @for (order of orders; track order.id) {
    <div class="card" style="margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
        <h3 style="margin: 0;">Order #{{ order.id }}</h3>
        <span class="badge" [style.background]="order.status === 'Delivered' ? 'var(--secondary)' : 'var(--primary)'">
          {{ order.status }}
        </span>
      </div>
      <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem;">Placed on: {{ order.createdAt | date }}</p>
      
      <div style="margin-bottom: 1rem;">
        @for (item of order.orderItems; track item.id) {
        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.25rem;">
          <span>{{ item.quantity }}x {{ item.product.name }}</span>
          <span>₹{{ item.price }}</span>
        </div>
        }
      </div>
      <hr style="border: none; border-top: 1px solid var(--border); margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; font-weight: 600;">
        <span>Total</span>
        <span>₹{{ order.totalAmount }}</span>
      </div>
    </div>
    }
  `
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}
  ngOnInit() { 
    this.api.getUserOrders().subscribe(res => {
      this.orders = res;
      this.cdr.detectChanges();
    }); 
  }
}
