import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private apiService: ApiService) {}

  /**
   * Get all users with optional pagination and search
   */
  getUsers(params?: { page?: number; limit?: number; search?: string }): Observable<User[]> {
    return this.apiService.get<User[]>('/users', params).pipe(
      map((response: User[]) => {
        // The API returns the data directly
        return response;
      })
    );
  }

  /**
   * Get a single user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`/users/${id}`).pipe(
      map((response: User) => {
        // The API returns the data directly
        return response;
      })
    );
  }

  /**
   * Create a new user
   */
  createUser(userData: Partial<User>): Observable<User> {
    return this.apiService.post<User>('/users', userData).pipe(
      map((response: User) => {
        // The API returns the data directly
        return response;
      })
    );
  }

  /**
   * Update an existing user
   */
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`/users/${id}`, userData).pipe(
      map((response: User) => {
        // The API returns the data directly
        return response;
      })
    );
  }

  /**
   * Delete a user
   */
  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(`/users/${id}`).pipe(
      map((response: void) => {
        // The API returns the data directly
        return response;
      })
    );
  }

  /**
   * Upload user avatar
   */
  uploadAvatar(userId: string, file: File): Observable<{ avatarUrl: string }> {
    return this.apiService.uploadFile<{ avatarUrl: string }>(`/users/${userId}/avatar`, file).pipe(
      map((response: { avatarUrl: string }) => {
        // The API returns the data directly
        return response;
      })
    );
  }
}
