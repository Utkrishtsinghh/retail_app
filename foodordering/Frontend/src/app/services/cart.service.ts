import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartCount = new BehaviorSubject<number>(0);

  constructor(private api: ApiService, private auth: AuthService) {
    this.auth.authStatus.subscribe(isAuth => {
      if (isAuth && !this.auth.isAdmin()) {
        this.refreshCart();
      } else {
        this.cartCount.next(0);
      }
    });
  }

  refreshCart() {
    this.api.getCart().subscribe({
      next: (items: any[]) => {
        const count = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        this.cartCount.next(count);
      },
      error: () => this.cartCount.next(0)
    });
  }
}
