import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { PaginationComponent, PaginationInfo } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  isLoading = true;
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'name';
  
  // Pagination properties
  pagination: PaginationInfo | null = null;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🏗️ ProductsListComponent initialized');
    console.log('🔗 Current route:', this.router.url);
    this.loadProducts();
  }

  loadProducts(page: number = 1): void {
    console.log('🚀 Starting to load products...');
    console.log('📄 Loading page:', page);
    
    this.isLoading = true;
    
    this.productsService.getProducts(page, 9).subscribe({
      next: (response: any) => {
        console.log('📦 Products response received:', response);
        console.log('📊 Number of products:', response.data.length);
        console.log('📄 Pagination info:', response.pagination);
        
        this.products = response.data;
        this.filteredProducts = response.data;
        this.pagination = response.pagination;
        
        this.isLoading = false;
        
        console.log('✅ Products loaded successfully');
        console.log('🔍 Filtered products count:', this.filteredProducts.length);
        console.log('📄 Current page:', this.pagination?.current, 'of', this.pagination?.pages);
      },
      error: (error: any) => {
        console.error('❌ Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    console.log('🔄 Page changed to:', page);
    this.loadProducts(page);
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter((product: any) => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        product.category.name === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    this.sortProducts();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a: any, b: any) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return b.stock - a.stock;
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  onSortChange(): void {
    this.sortProducts();
  }

  addProduct(): void {
    this.router.navigate(['/products/add']);
  }

  editProduct(productId: string): void {
    this.router.navigate(['/products/edit', productId]);
  }

  deleteProduct(productId: string): void {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      this.productsService.deleteProduct(productId).subscribe({
        next: (success: any) => {
          if (success) {
            this.loadProducts(this.pagination?.current || 1);
          }
        },
        error: (error: any) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  getCategories(): string[] {
    return [...new Set(this.products.map((p: any) => p.category.name))];
  }

  getCategoryNameAr(category: string): string {
    const categoryNames: { [key: string]: string } = {
      'Electronics': 'إلكترونيات',
      'Clothing': 'ملابس',
      'Books': 'كتب',
      'Home & Garden': 'المنزل والحديقة',
      'Sports': 'رياضة',
      'Cleaners': 'منظفات'
    };
    return categoryNames[category] || category;
  }

  getStatusBadge(product: any): { text: string; class: string } {
    if (product.featured) {
      return { text: 'مميز', class: 'bg-blue-100 text-blue-800' };
    }
    if (product.isActive) {
      return { text: 'نشط', class: 'bg-green-100 text-green-800' };
    }
    return { text: 'غير نشط', class: 'bg-gray-100 text-gray-800' };
  }
}
