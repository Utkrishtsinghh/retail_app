import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwt_token';
  private roleKey = 'user_role';

  public authStatus = new BehaviorSubject<boolean>(this.isAuthenticatedCheck());
  public adminStatus = new BehaviorSubject<boolean>(this.isAdminCheck());

  constructor() {}

  setToken(token: string, role: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);
    this.authStatus.next(true);
    this.adminStatus.next(role === 'Admin');
  }

  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  getRole(): string | null { return localStorage.getItem(this.roleKey); }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.authStatus.next(false);
    this.adminStatus.next(false);
  }

  isAuthenticated(): boolean { return this.authStatus.value; }
  isAdmin(): boolean { return this.adminStatus.value; }

  private isAuthenticatedCheck(): boolean { return !!this.getToken(); }
  private isAdminCheck(): boolean { return this.getRole() === 'Admin'; }
}
