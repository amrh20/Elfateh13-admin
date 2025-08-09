import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super-admin';
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<AdminUser> {
    // Mock login - replace with actual API call
    return of({
      id: '1',
      name: 'Admin User',
      email: email,
      role: 'admin' as 'admin' | 'super-admin',
      avatar: 'https://via.placeholder.com/40'
    }).pipe(delay(1000));
  }

  logout(): void {
    localStorage.removeItem('adminUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: AdminUser): void {
    localStorage.setItem('adminUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
