import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'name';

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.nameAr.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    this.sortProducts();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'stock':
          return b.stock - a.stock;
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
        next: (success) => {
          if (success) {
            this.loadProducts();
          }
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  getCategories(): string[] {
    return [...new Set(this.products.map(p => p.category))];
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

  getStatusBadge(product: Product): { text: string; class: string } {
    if (product.isOnSale) {
      return { text: 'عرض', class: 'bg-red-100 text-red-800' };
    }
    if (product.isFeatured) {
      return { text: 'مميز', class: 'bg-blue-100 text-blue-800' };
    }
    if (product.isBestSeller) {
      return { text: 'الأكثر مبيعاً', class: 'bg-green-100 text-green-800' };
    }
    return { text: 'عادي', class: 'bg-gray-100 text-gray-800' };
  }
}
