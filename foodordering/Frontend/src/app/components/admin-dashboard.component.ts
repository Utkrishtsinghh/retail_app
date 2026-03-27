import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 style="margin-bottom: 1.5rem;">Admin Dashboard</h2>
    
    @if (stats) {
    <div class="grid" style="margin-bottom: 2rem;">
      <div class="card" style="text-align: center;">
        <div style="color: var(--text-muted); font-size: 0.875rem; text-transform: uppercase;">Total Revenue</div>
        <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">₹{{ stats.totalRevenue }}</div>
      </div>
      <div class="card" style="text-align: center;">
        <div style="color: var(--text-muted); font-size: 0.875rem; text-transform: uppercase;">Total Orders</div>
        <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">{{ stats.totalOrders }}</div>
      </div>
      <div class="card" style="text-align: center;">
        <div style="color: var(--text-muted); font-size: 0.875rem; text-transform: uppercase;">Total Users</div>
        <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">{{ stats.totalUsers }}</div>
      </div>
    </div>
    }

    <h3 style="margin-bottom: 1rem;">Manage Orders</h3>
    <div class="card" style="overflow-x: auto; margin-bottom: 2rem;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid var(--border);">
            <th style="padding: 0.75rem 0.5rem;">ID</th>
            <th style="padding: 0.75rem 0.5rem;">User</th>
            <th style="padding: 0.75rem 0.5rem;">Total</th>
            <th style="padding: 0.75rem 0.5rem;">Status</th>
            <th style="padding: 0.75rem 0.5rem;">Action</th>
          </tr>
        </thead>
        <tbody>
          @for (o of orders; track o.id) {
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 0.75rem 0.5rem;">#{{ o.id }}</td>
            <td style="padding: 0.75rem 0.5rem;">{{ o.user?.username }}</td>
            <td style="padding: 0.75rem 0.5rem;">₹{{ o.totalAmount }}</td>
            <td style="padding: 0.75rem 0.5rem;">{{ o.status }}</td>
            <td style="padding: 0.75rem 0.5rem;">
              <select [value]="o.status" (change)="updateStatus(o.id, $any($event.target).value)" style="padding: 0.25rem;">
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: any;
  orders: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDashboard().subscribe(res => this.stats = res);
    this.api.getAllOrders().subscribe(res => this.orders = res);
  }

  updateStatus(id: number, status: string) {
    this.api.updateOrderStatus(id, status).subscribe();
  }
}
