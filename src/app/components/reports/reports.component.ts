import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { OrdersService } from '../../services/orders.service';
import { Product } from '../../interfaces/product.interface';
import { Order } from '../../interfaces/order.interface';

interface ProductAnalytics {
  product: Product;
  totalSales: number;
  totalRevenue: number;
  lastSoldDate?: Date;
  daysSinceLastSale: number;
  averageRating: number;
  totalReviews: number;
}

interface SalesAnalytics {
  topSellingProducts: ProductAnalytics[];
  slowMovingProducts: ProductAnalytics[];
  productsForPromotion: ProductAnalytics[];
  monthlyRevenue: { month: string; revenue: number }[];
  categoryPerformance: { category: string; sales: number; revenue: number }[];
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  analytics: SalesAnalytics = {
    topSellingProducts: [],
    slowMovingProducts: [],
    productsForPromotion: [],
    monthlyRevenue: [],
    categoryPerformance: []
  };

  isLoading = true;
  selectedPeriod = '30'; // days

  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.isLoading = true;

    // تحميل المنتجات والطلبات
    this.productsService.getProducts().subscribe(products => {
      this.ordersService.getOrders().subscribe(orders => {
        this.generateAnalytics(products, orders);
        this.isLoading = false;
      });
    });
  }

  generateAnalytics(products: Product[], orders: Order[]): void {
    // تحليل المبيعات لكل منتج
    const productAnalytics = this.analyzeProductSales(products, orders);
    
    // المنتجات الأكثر مبيعاً
    this.analytics.topSellingProducts = productAnalytics
      .filter(p => p.totalSales > 0)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10);

    // المنتجات بطيئة الحركة (لم تُبَع منذ أكثر من 30 يوم)
    this.analytics.slowMovingProducts = productAnalytics
      .filter(p => p.daysSinceLastSale > 30)
      .sort((a, b) => b.daysSinceLastSale - a.daysSinceLastSale)
      .slice(0, 10);

    // المنتجات المناسبة للعروض (مخزون عالي، مبيعات منخفضة)
    this.analytics.productsForPromotion = productAnalytics
      .filter(p => p.product.stock > 10 && p.totalSales < 5)
      .sort((a, b) => b.product.stock - a.product.stock)
      .slice(0, 10);

    // تحليل الإيرادات الشهرية
    this.analytics.monthlyRevenue = this.generateMonthlyRevenue(orders);

    // أداء الأصناف
    this.analytics.categoryPerformance = this.analyzeCategoryPerformance(products, orders);
  }

  analyzeProductSales(products: Product[], orders: Order[]): ProductAnalytics[] {
    const productSales = new Map<string, { sales: number; revenue: number; lastSold: Date }>();

    // تحليل الطلبات
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const existing = productSales.get(product.id) || { sales: 0, revenue: 0, lastSold: new Date(0) };
          existing.sales += item.quantity;
          existing.revenue += item.quantity * item.price;
          if (new Date(order.createdAt) > existing.lastSold) {
            existing.lastSold = new Date(order.createdAt);
          }
          productSales.set(product.id, existing);
        }
      });
    });

    // إنشاء تحليلات المنتجات
    return products.map(product => {
      const sales = productSales.get(product.id) || { sales: 0, revenue: 0, lastSold: new Date(0) };
      const daysSinceLastSale = sales.lastSold.getTime() > 0 
        ? Math.floor((Date.now() - sales.lastSold.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      return {
        product,
        totalSales: sales.sales,
        totalRevenue: sales.revenue,
        lastSoldDate: sales.lastSold.getTime() > 0 ? sales.lastSold : undefined,
        daysSinceLastSale,
        averageRating: product.rating || 0,
        totalReviews: product.reviewsCount || 0
      };
    });
  }

  generateMonthlyRevenue(orders: Order[]): { month: string; revenue: number }[] {
    const monthlyData = new Map<string, number>();
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });
      
      const existing = monthlyData.get(monthKey) || 0;
      const orderTotal = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      monthlyData.set(monthKey, existing + orderTotal);
    });

    return Array.from(monthlyData.entries())
      .map(([key, revenue]) => ({
        month: new Date(key + '-01').toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' }),
        revenue
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // آخر 6 أشهر
  }

  analyzeCategoryPerformance(products: Product[], orders: Order[]): { category: string; sales: number; revenue: number }[] {
    const categoryData = new Map<string, { sales: number; revenue: number }>();

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const existing = categoryData.get(product.category) || { sales: 0, revenue: 0 };
          existing.sales += item.quantity;
          existing.revenue += item.quantity * item.price;
          categoryData.set(product.category, existing);
        }
      });
    });

    return Array.from(categoryData.entries())
      .map(([category, data]) => ({
        category: this.getCategoryNameAr(category),
        sales: data.sales,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  getCategoryNameAr(category: string): string {
    const categoryNames: { [key: string]: string } = {
      'Cleaners': 'منظفات',
      'Household Tools': 'أدوات منزلية',
      'Electronics': 'إلكترونيات',
      'Clothing': 'ملابس',
      'Books': 'كتب'
    };
    return categoryNames[category] || category;
  }

  getStatusColor(daysSinceLastSale: number): string {
    if (daysSinceLastSale <= 7) return 'bg-green-100 text-green-800';
    if (daysSinceLastSale <= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getStatusText(daysSinceLastSale: number): string {
    if (daysSinceLastSale <= 7) return 'مبيع حديث';
    if (daysSinceLastSale <= 30) return 'مبيع متوسط';
    return 'بطيء الحركة';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  }

  getTotalSales(): number {
    return this.analytics.topSellingProducts.reduce((sum, item) => sum + item.totalSales, 0);
  }

  getTotalRevenue(): number {
    return this.analytics.topSellingProducts.reduce((sum, item) => sum + item.totalRevenue, 0);
  }

  onPeriodChange(): void {
    this.loadAnalytics();
  }
} 