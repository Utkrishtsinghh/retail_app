import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 style="margin-bottom: 1.5rem;">Food Menu</h2>
    @if (isAdmin$ | async) {
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin-bottom: 1rem;">
        <button class="btn" type="button" (click)="startAdd()" [disabled]="addingProduct">Add New Item</button>
        @if (addingProduct) {
          <span style="color: var(--text-muted);">Creating new product...</span>
        }
      </div>
    }
    @if ((isAdmin$ | async) && addingProduct) {
      <div class="card" style="margin-bottom: 1.5rem;">
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
    @if ((isAdmin$ | async) && editingProduct) {
      <div class="card" style="margin-bottom: 1.5rem;">
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
          @if (isAdmin$ | async) {
            <button class="btn btn-secondary" style="width: 100%; margin-bottom: 0.5rem;" (click)="startEdit(p)">Edit</button>
          }
          @if (!(isAdmin$ | async)) {
            <button class="btn" style="width: 100%;" [disabled]="p.stock === 0" (click)="addToCart(p)">
              {{ p.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
          }
        </div>
      }
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  isAdmin$!: ReturnType<AuthService['adminStatus']['asObservable']>;
  editingProduct: any | null = null;
  addingProduct: any | null = null;

  constructor(private api: ApiService, private auth: AuthService, private cart: CartService, private cdr: ChangeDetectorRef) {
    this.isAdmin$ = this.auth.adminStatus.asObservable();
  }

  ngOnInit() {
    this.refreshProducts();
  }

  addToCart(product: any) {
    if (this.auth.isAdmin()) return;
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

  startEdit(product: any) {
    if (!this.auth.isAdmin()) return;
    this.addingProduct = null;
    this.editingProduct = { ...product };
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  startAdd() {
    if (!this.auth.isAdmin()) return;
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

    this.api.addProduct(payload).subscribe({
      next: () => {
        this.addingProduct = null;
        this.refreshProducts();
      },
      error: (err) => {
        alert('Failed to add product');
        console.error(err);
      }
    });
  }

  saveProduct() {
    if (!this.editingProduct) return;

    const payload = {
      ...this.editingProduct,
      price: Number(this.editingProduct.price),
      stock: Number(this.editingProduct.stock)
    };

    this.api.updateProduct(payload.id, payload).subscribe({
      next: () => {
        this.editingProduct = null;
        this.refreshProducts();
      },
      error: (err) => {
        alert('Failed to update product');
        console.error(err);
      }
    });
  }

  private refreshProducts() {
    this.api.getProducts().subscribe({
      next: res => {
        this.products = res;
        this.cdr.detectChanges();
      },
      error: err => console.error('Failed to fetch products', err)
    });
  }
}
