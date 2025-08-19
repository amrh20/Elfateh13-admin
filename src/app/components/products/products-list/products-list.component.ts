import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent, PaginationInfo } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: true,
  imports:[CommonModule, PaginationComponent]
})
export class ProductsListComponent implements OnInit {
  products: any[] = [];
  isLoading = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;
  totalProducts = 0;
  currentSubcategory: string | null = null;
  subcategoryName: string = '';
  
  // Helper for pagination
  Array = Array;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Get subcategory from query params
    this.route.queryParamMap.subscribe(params => {
      this.currentSubcategory = params.get('subcategory');
      if (this.currentSubcategory) {
        // Load products filtered by subcategory
        this.loadProducts();
        this.loadSubcategoryInfo();
      } else {
        // Load all products (admin view)
        this.loadAllProducts();
      }
    });
  }

  loadProducts(): void {
    if (!this.currentSubcategory) return;

    this.isLoading = true;
    this.error = null;

    this.productsService.getProductsBySubcategory(
      this.currentSubcategory, 
      this.currentPage, 
      this.pageSize
    ).subscribe({
      next: (response: any) => {
        this.products = response.data || [];
        this.totalProducts = response.total || response.pagination?.total || 0;
        this.totalPages = response.pagination?.pages || Math.ceil(this.totalProducts / this.pageSize);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = 'خطأ في تحميل المنتجات';
        this.isLoading = false;
      }
    });
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.error = null;

    this.productsService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.products = response.data || [];
        this.totalProducts = response.pagination?.total || response.total || 0;
        this.totalPages = response.pagination?.pages || 1;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = 'خطأ في تحميل المنتجات';
        this.isLoading = false;
      }
    });
  }

  loadSubcategoryInfo(): void {
    if (!this.currentSubcategory) return;

    // You can add a service call here to get subcategory details
    // For now, we'll use a placeholder
    this.subcategoryName = 'التصنيف الفرعي';
  }

  // Helper method to check if we're in subcategory view
  isSubcategoryView(): boolean {
    return !!this.currentSubcategory;
  }

  getPaginationInfo(): PaginationInfo {
    return {
      current: this.currentPage,
      pages: this.totalPages,
      total: this.totalProducts,
      limit: this.pageSize
    };
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.currentSubcategory) {
      this.loadProducts();
    } else {
      this.loadAllProducts();
    }
  }

  addNewProduct(): void {
    this.router.navigate(['/products/add']);
  }

  getStatusText(product: any): string {
    return product.isActive ? 'متوفر' : 'غير متوفر';
  }

  getStatusBadgeClass(product: any): string {
    return product.isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  getPriceText(product: any): string {
    if (product.price) {
      return `${product.price} ريال`;
    }
    return 'السعر غير محدد';
  }

  trackByProduct(index: number, product: any): any {
    return product._id || product.id;
  }

  onImageError(event: any): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      // Set default image instead of hiding
      target.src = '/assets/images/default-product.svg';
    }
  }

  getProductImage(product: any): string {
    // Check if product has an image
    if (product.image && product.image.trim() !== '') {
      return product.image;
    }
    
    // Check if product has images array (legacy support)
    if (product.images && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    
    // Return default image
    return '/assets/images/default-product.svg';
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
