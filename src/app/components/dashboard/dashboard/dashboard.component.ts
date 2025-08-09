import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products.service';
import { CategoriesService } from '../../../services/categories.service';
import { Product } from '../../../interfaces/product.interface';
import { Category } from '../../../interfaces/category.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = {
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  };

  recentProducts: Product[] = [];
  featuredProducts: Product[] = [];
  categories: Category[] = [];

  isLoading = true;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load products
    this.productsService.getProducts().subscribe(products => {
      this.stats.totalProducts = products.length;
      this.recentProducts = products.slice(0, 5);
    });

    // Load featured products
    this.productsService.getFeaturedProducts().subscribe(products => {
      this.featuredProducts = products.slice(0, 4);
    });

    // Load categories
    this.categoriesService.getCategories().subscribe(categories => {
      this.stats.totalCategories = categories.length;
      this.categories = categories.slice(0, 5);
    });

    // Mock data for orders and revenue
    this.stats.totalOrders = 156;
    this.stats.totalRevenue = 45600;

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getCategoryNameAr(category: string): string {
    const categoryNames: { [key: string]: string } = {
      'Cleaners': 'منظفات',
      'Household Tools': 'أدوات منزلية'
    };
    return categoryNames[category] || category;
  }

  calculateDiscountedPrice(product: Product): number {
    if (product.isOnSale && product.discountPercentage && product.discountPercentage > 0) {
      const discount = product.price * (product.discountPercentage / 100);
      return product.price - discount;
    }
    return product.price;
  }
}
