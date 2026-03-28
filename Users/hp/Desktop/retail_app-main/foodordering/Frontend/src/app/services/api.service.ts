import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Dev API base
  private baseUrl = 'http://localhost:5196/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Auth
  register(data: any) { return this.http.post(`${this.baseUrl}/auth/register`, data); }
  login(data: any) { return this.http.post(`${this.baseUrl}/auth/login`, data); }
  adminLogin(data: any) { return this.http.post(`${this.baseUrl}/auth/admin-login`, data); }

  // Products
  getProducts() { return this.http.get<any[]>(`${this.baseUrl}/products`); }
  addProduct(product: any) {
    return this.http.post(`${this.baseUrl}/products`, product, { headers: this.getHeaders() });
  }
  updateProduct(id: number, product: any) {
    return this.http.put(`${this.baseUrl}/products/${id}`, product, { headers: this.getHeaders() });
  }

  // Cart
  getCart() { return this.http.get<any[]>(`${this.baseUrl}/cart`, { headers: this.getHeaders() }); }
  addToCart(productId: number, quantity: number) { 
    return this.http.post(`${this.baseUrl}/cart/add`, { productId, quantity }, { headers: this.getHeaders() }); 
  }
  updateCart(productId: number, quantity: number) { 
    return this.http.put(`${this.baseUrl}/cart/update`, { productId, quantity }, { headers: this.getHeaders() }); 
  }
  removeFromCart(cartItemId: number) { 
    return this.http.delete(`${this.baseUrl}/cart/remove/${cartItemId}`, { headers: this.getHeaders() }); 
  }

  // Orders
  placeOrder(deliveryAddress: string) { 
    return this.http.post(`${this.baseUrl}/orders/place`, { deliveryAddress }, { headers: this.getHeaders() }); 
  }
  getUserOrders() { return this.http.get<any[]>(`${this.baseUrl}/orders/user`, { headers: this.getHeaders() }); }
  
  // Admin
  getDashboard() { return this.http.get<any>(`${this.baseUrl}/admin/dashboard`, { headers: this.getHeaders() }); }
  getAllOrders() { return this.http.get<any[]>(`${this.baseUrl}/orders`, { headers: this.getHeaders() }); }
  updateOrderStatus(orderId: number, status: string) { 
    // JSON serialize string status to make it valid JSON string if needed, or pass as object
    // Wait, the API expects [FromBody] string status but usually raw strings in fromBody need quotes. Let's pass it with double quotes.
    return this.http.put(`${this.baseUrl}/orders/${orderId}/status`, `"${status}"`, { 
      headers: this.getHeaders().set('Content-Type', 'application/json') 
    }); 
  }
}
