import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products.service';
import { CategoriesService } from '../../../services/categories.service';
import { OrdersService } from '../../../services/orders.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  currentUser: any = null;

  stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCategories: 0
  };

  recentProducts: any[] = [];
  featuredProducts: any[] = [];
  categories: any[] = [];
  topSellingProducts: any[] = [];
  slowMovingProducts: any[] = [];
  productsForPromotion: any[] = [];

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDashboardData();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user loaded:', this.currentUser);
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load products and orders for analytics
    this.productsService.getProducts().subscribe((response: any) => {
      this.stats.totalProducts = response.data.length;
      this.recentProducts = response.data.slice(0, 5);
      
      this.ordersService.getOrders().subscribe((orders: any) => {
        this.generateProductAnalytics(response.data, orders);
      });
    });

    // Load featured products
    this.productsService.getFeaturedProducts().subscribe((products: any) => {
      this.featuredProducts = products.slice(0, 4);
    });

    // Load categories
    this.categoriesService.getCategories().subscribe((categories: any) => {
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

  generateProductAnalytics(products: any[], orders: any[]): void {
    const productSales = new Map<string, { sales: number; lastSold: Date }>();

    // تحليل المبيعات
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        const product = products.find((p: any) => p._id === item.productId);
        if (product) {
          const existing = productSales.get(product._id) || { sales: 0, lastSold: new Date(0) };
          existing.sales += item.quantity;
          if (new Date(order.createdAt) > existing.lastSold) {
            existing.lastSold = new Date(order.createdAt);
          }
          productSales.set(product._id, existing);
        }
      });
    });

    // المنتجات الأكثر مبيعاً
    this.topSellingProducts = products
      .map((product: any) => ({
        product,
        sales: productSales.get(product._id)?.sales || 0,
        lastSold: productSales.get(product._id)?.lastSold || new Date(0)
      }))
      .filter((p: any) => p.sales > 0)
      .sort((a: any, b: any) => b.sales - a.sales)
      .slice(0, 5)
      .map((p: any) => p.product);

    // المنتجات بطيئة الحركة
    this.slowMovingProducts = products
      .map((product: any) => ({
        product,
        sales: productSales.get(product._id)?.sales || 0,
        lastSold: productSales.get(product._id)?.lastSold || new Date(0)
      }))
      .filter((p: any) => {
        const daysSinceLastSale = p.lastSold.getTime() > 0 
          ? Math.floor((Date.now() - p.lastSold.getTime()) / (1000 * 60 * 60 * 24))
          : 999;
        return daysSinceLastSale > 30;
      })
      .sort((a: any, b: any) => b.lastSold.getTime() - a.lastSold.getTime())
      .slice(0, 5)
      .map((p: any) => p.product);

    // المنتجات المناسبة للعروض
    this.productsForPromotion = products
      .map((product: any) => ({
        product,
        sales: productSales.get(product._id)?.sales || 0
      }))
      .filter((p: any) => p.product.stock > 10 && p.sales < 5)
      .sort((a: any, b: any) => b.product.stock - a.product.stock)
      .slice(0, 5)
      .map((p: any) => p.product);
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
      'Household Tools': 'أدوات منزلية',
      'Electronics': 'إلكترونيات',
      'Clothing': 'ملابس',
      'Books': 'كتب',
      'Home & Garden': 'المنزل والحديقة',
      'Sports': 'رياضة'
    };
    return categoryNames[category] || category;
  }
}
