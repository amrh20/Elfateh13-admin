# API Service Usage Guide

This project now includes a centralized API service and HTTP interceptor for making HTTP requests to the backend API.

## Base URL
The API base URL is configured in the environment files:
- Development: `https://e-commerce-api-production-582c.up.railway.app/api`
- Production: `https://e-commerce-api-production-582c.up.railway.app/api`

## API Service Methods

### 1. GET Request
```typescript
// Simple GET request
this.apiService.get<User[]>('/users').subscribe({
  next: (response) => {
    if (response.success) {
      console.log('Users:', response.data);
    }
  },
  error: (error) => console.error('Error:', error)
});

// GET with query parameters
this.apiService.get<User[]>('/users', {
  page: 1,
  limit: 10,
  search: 'john'
}).subscribe(/* ... */);

// GET with custom headers
this.apiService.get<User[]>('/users', {}, {
  'Custom-Header': 'value'
}).subscribe(/* ... */);
```

### 2. POST Request
```typescript
// Create a new user
const userData = { name: 'John Doe', email: 'john@example.com' };
this.apiService.post<User>('/users', userData).subscribe({
  next: (response) => {
    if (response.success) {
      console.log('User created:', response.data);
    }
  },
  error: (error) => console.error('Error:', error)
});
```

### 3. PUT Request
```typescript
// Update a user
const userData = { name: 'John Smith', email: 'john@example.com' };
this.apiService.put<User>(`/users/${userId}`, userData).subscribe(/* ... */);
```

### 4. PATCH Request
```typescript
// Partial update
const updateData = { name: 'John Smith' };
this.apiService.patch<User>(`/users/${userId}`, updateData).subscribe(/* ... */);
```

### 5. DELETE Request
```typescript
// Delete a user
this.apiService.delete<void>(`/users/${userId}`).subscribe(/* ... */);
```

### 6. File Upload
```typescript
// Single file upload
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const file = fileInput.files?.[0];
if (file) {
  this.apiService.uploadFile<{ url: string }>('/upload', file, {
    category: 'profile'
  }).subscribe(/* ... */);
}

// Multiple files upload
const files = Array.from(fileInput.files || []);
this.apiService.uploadMultipleFiles<{ urls: string[] }>('/upload-multiple', files, {
  category: 'gallery'
}).subscribe(/* ... */);
```

## Authentication

The interceptor automatically adds the authentication token to requests if it exists in localStorage:

```typescript
// Store token after login
localStorage.setItem('authToken', 'your-jwt-token');

// Token will be automatically added to all subsequent requests
// as: Authorization: Bearer your-jwt-token
```

## Error Handling

The interceptor automatically handles common errors:
- **401 Unauthorized**: Automatically redirects to login page and clears token
- All errors are properly propagated to components for custom handling

## Response Format

All API responses follow this structure:
```typescript
interface ApiResponse<T> {
  data?: T;           // The actual data
  message?: string;   // Success/error message
  success: boolean;   // Whether the request was successful
  error?: string;     // Error message if success is false
}
```

## Example Component Usage

```typescript
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-users',
  template: '...'
})
export class UsersComponent {
  users: User[] = [];
  loading = false;
  error = '';

  constructor(private apiService: ApiService) {}

  loadUsers() {
    this.loading = true;
    this.error = '';

    this.apiService.get<User[]>('/users').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
        } else {
          this.error = response.error || 'Failed to load users';
        }
      },
      error: (error) => {
        this.error = 'An error occurred while loading users';
        console.error('Error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  createUser(userData: any) {
    this.apiService.post<User>('/users', userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadUsers(); // Reload the list
        }
      },
      error: (error) => console.error('Error creating user:', error)
    });
  }
}
```

## Login API Integration

The login functionality has been updated to use the new API service:

```typescript
// In AuthService
login(username: string, password: string): Observable<AdminUser> {
  const loginData = { username, password };
  
  return this.apiService.post<LoginResponse>('/auth/login', loginData).pipe(
    map((response) => {
      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        return response.data.user;
      } else {
        throw new Error(response.error || 'Login failed');
      }
    })
  );
}
```

## Testing the Login API

To test the login functionality:
1. Navigate to the login page
2. Use the credentials: `admin` / `admin123`
3. The request will be sent to: `https://e-commerce-api-production-582c.up.railway.app/api/auth/login`
4. Check the browser's Network tab to see the actual API call
5. Check the browser's Console for any error messages

## Notes

- The interceptor automatically adds the base URL to relative endpoints
- All requests include `Content-Type: application/json` header
- Authentication tokens are automatically managed
- Error handling is centralized in the interceptor
- The service is fully typed with TypeScript generics
