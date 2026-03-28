import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 1rem; flex-wrap: wrap;">
      <h3 style="margin: 0;">Manage Products</h3>
      <button class="btn" type="button" (click)="startAdd()">Add New Item</button>
    </div>
    <div class="card" style="overflow-x: auto; margin-bottom: 1.5rem;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid var(--border);">
            <th style="padding: 0.75rem 0.5rem;">Name</th>
            <th style="padding: 0.75rem 0.5rem;">Price</th>
            <th style="padding: 0.75rem 0.5rem;">Stock</th>
            <th style="padding: 0.75rem 0.5rem;">Action</th>
          </tr>
        </thead>
        <tbody>
          @for (p of products; track p.id) {
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 0.75rem 0.5rem; font-weight: 600;">{{ p.name }}</td>
            <td style="padding: 0.75rem 0.5rem;">₹{{ p.price }}</td>
            <td style="padding: 0.75rem 0.5rem;">{{ p.stock }} left</td>
            <td style="padding: 0.75rem 0.5rem;">
              <button class="btn btn-secondary" (click)="startEdit(p)">Edit</button>
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>

    @if (addingProduct) {
    <div class="card" style="margin-bottom: 2rem;">
      <h4 style="margin-bottom: 1rem;">Add Product</h4>
      <form (ngSubmit)="createProduct()" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Name</label>
          <input type="text" [(ngModel)]="addingProduct.name" name="newName" required>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Description</label>
          <input type="text" [(ngModel)]="addingProduct.description" name="newDescription">
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Price (₹)</label>
          <input type="number" min="0" step="0.01" [(ngModel)]="addingProduct.price" name="newPrice" required>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Stock</label>
          <input type="number" min="0" step="1" [(ngModel)]="addingProduct.stock" name="newStock" required>
        </div>
        <div style="grid-column: 1 / -1; display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem;">
          <button type="button" class="btn btn-secondary" (click)="cancelAdd()">Cancel</button>
          <button type="submit" class="btn">Create Product</button>
        </div>
      </form>
    </div>
    }

    @if (editingProduct) {
    <div class="card" style="margin-bottom: 2rem;">
      <h4 style="margin-bottom: 1rem;">Edit Product</h4>
      <form (ngSubmit)="saveProduct()" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Name</label>
          <input type="text" [(ngModel)]="editingProduct.name" name="editName" required>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Description</label>
          <input type="text" [(ngModel)]="editingProduct.description" name="editDescription">
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Price (₹)</label>
          <input type="number" min="0" step="0.01" [(ngModel)]="editingProduct.price" name="editPrice" required>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Stock</label>
          <input type="number" min="0" step="1" [(ngModel)]="editingProduct.stock" name="editStock" required>
        </div>
        <div style="grid-column: 1 / -1; display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem;">
          <button type="button" class="btn btn-secondary" (click)="cancelEdit()">Cancel</button>
          <button type="submit" class="btn">Save Changes</button>
        </div>
      </form>
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
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats: any;
  orders: any[] = [];
  products: any[] = [];
  editingProduct: any | null = null;
  addingProduct: any | null = null;
  private destroy$ = new Subject<void>();

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadAll();
    // In case backend was still starting on first hit, retry once shortly after
    setTimeout(() => {
      if (!this.stats || this.products.length === 0) {
        this.loadAll();
      }
    }, 500);

    // Reload when navigating back to /admin to ensure fresh data shows immediately
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: any) => event.urlAfterRedirects?.startsWith('/admin')),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadAll();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAll() {
    this.api.getDashboard().subscribe({
      next: res => this.stats = res,
      error: err => {
        console.error('Failed to load dashboard stats', err);
        if (err.status === 401 || err.status === 403) {
          alert('Session expired or unauthorized. Please login as admin again.');
        }
      }
    });
    this.api.getAllOrders().subscribe({
      next: res => this.orders = res,
      error: err => {
        console.error('Failed to load orders', err);
        if (err.status === 401 || err.status === 403) {
          alert('Session expired or unauthorized. Please login as admin again.');
        }
      }
    });
    this.refreshProducts();
  }

  updateStatus(id: number, status: string) {
    this.api.updateOrderStatus(id, status).subscribe();
  }

  refreshProducts() {
    this.api.getProducts().subscribe({
      next: res => this.products = res,
      error: err => console.error('Failed to load products', err)
    });
  }

  startEdit(product: any) {
    this.addingProduct = null;
    this.editingProduct = { ...product };
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  startAdd() {
    this.editingProduct = null;
    this.addingProduct = { name: '', description: '', price: 0, stock: 0 };
  }

  cancelAdd() {
    this.addingProduct = null;
  }

  createProduct() {
    if (!this.addingProduct) return;

    const payload = {
      ...this.addingProduct,
      price: Number(this.addingProduct.price),
      stock: Number(this.addingProduct.stock)
    };

    this.api.addProduct(payload).subscribe(() => {
      this.refreshProducts();
      this.addingProduct = null;
    });
  }

  saveProduct() {
    if (!this.editingProduct) return;

    const payload = {
      ...this.editingProduct,
      price: Number(this.editingProduct.price),
      stock: Number(this.editingProduct.stock)
    };

    this.api.updateProduct(payload.id, payload).subscribe(() => {
      this.refreshProducts();
      this.editingProduct = null;
    });
  }
}
