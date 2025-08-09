import { Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Auth Guard
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./components/products/products-list/products-list.component').then(m => m.ProductsListComponent)
      },
      {
        path: 'products/add',
        loadComponent: () => import('./components/products/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./components/products/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/categories/categories-list/categories-list.component').then(m => m.CategoriesListComponent)
      },
      {
        path: 'categories/add',
        loadComponent: () => import('./components/categories/category-form/category-form.component').then(m => m.CategoryFormComponent)
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () => import('./components/categories/category-form/category-form.component').then(m => m.CategoryFormComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () => import('./components/orders/order-details/order-details.component').then(m => m.OrderDetailsComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/orders/orders-list/orders-list.component').then(m => m.OrdersListComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/users/users-list/users-list.component').then(m => m.UsersListComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
