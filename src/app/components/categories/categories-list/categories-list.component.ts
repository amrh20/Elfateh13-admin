import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import { PaginationComponent, PaginationInfo } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit {
  categories: any[] = [];
  filteredCategories: any[] = [];
  isLoading = true;
  searchTerm = '';
  selectedType = '';
  sortBy = 'name';
  
  // Pagination properties
  pagination: PaginationInfo | null = null;

  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(page: number = 1): void {
    this.isLoading = true;
    this.categoriesService.getCategories().subscribe({
      next: (categories: any) => {
        this.categories = categories;
        this.filteredCategories = categories;
        
        // Create pagination info for categories
        this.pagination = {
          current: page,
          pages: Math.ceil(categories.length / 20),
          total: categories.length,
          limit: 20
        };
        
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    console.log('🔄 Categories page changed to:', page);
    this.loadCategories(page);
  }

  filterCategories(): void {
    this.filteredCategories = this.categories.filter((category: any) => {
      const matchesSearch = !this.searchTerm || 
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        category.nameAr.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = !this.selectedType || 
        category.type === this.selectedType;

      return matchesSearch && matchesType;
    });

    this.sortCategories();
  }

  sortCategories(): void {
    this.filteredCategories.sort((a: any, b: any) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'productCount':
          return b.productCount - a.productCount;
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }

  onSearchChange(): void {
    this.filterCategories();
  }

  onTypeChange(): void {
    this.filterCategories();
  }

  onSortChange(): void {
    this.sortCategories();
  }

  addCategory(): void {
    this.router.navigate(['/categories/add']);
  }

  editCategory(categoryId: string): void {
    this.router.navigate(['/categories/edit', categoryId]);
  }

  deleteCategory(categoryId: string): void {
    if (confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
      this.categoriesService.deleteCategory(categoryId).subscribe({
        next: (success: any) => {
          if (success) {
            this.loadCategories(this.pagination?.current || 1);
          }
        },
        error: (error: any) => {
          console.error('Error deleting category:', error);
        }
      });
    }
  }

  getCategoryTypes(): string[] {
    return [...new Set(this.categories.map((c: any) => c.type))];
  }

  getTypeNameAr(type: string): string {
    const typeNames: { [key: string]: string } = {
      'main': 'رئيسي',
      'sub': 'فرعي'
    };
    return typeNames[type] || type;
  }

  getStatusBadge(category: any): { text: string; class: string } {
    if (category.isActive) {
      return { text: 'نشط', class: 'bg-green-100 text-green-800' };
    }
    return { text: 'غير نشط', class: 'bg-red-100 text-red-800' };
  }
}
