import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import { PaginationComponent, PaginationInfo } from '../../shared/pagination/pagination.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/confirm-dialog/confirm-dialog.component';

interface Category {
  id: string;
  name?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  isActive: boolean;
  parent?: string;
  ancestors?: string[];
  subCategories?: Category[];
  productCount?: number;
  createdAt?: string;
  type?: string;
}

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, ConfirmDialogComponent],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit {
  categories: any[] = [];
  paginatedCategories: any[] = [];
  isLoading = false;
  error = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 4; // Reduced from 6 to 4 to ensure pagination shows
  totalItems = 0;
  pagination: any = {};
  
  // Search
  searchTerm = '';
  filteredCategories: any[] = [];
  
  // Collapse state
  expandedCategories: Set<string> = new Set();
  
  // Confirm Dialog
  showConfirmDialog = false;
  confirmDialogData: ConfirmDialogData | null = null;
  itemToDelete: { id: string; type: 'category' | 'subcategory'; parentId?: string } | null = null;

  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.error = '';
    
    this.categoriesService.getCategories().subscribe({
      next: (response: any) => {
        const allCategories = response?.data || response || [];
        
        // Filter to show only main categories (no parent)
        this.categories = allCategories.filter((category: any) => {
          // Show only categories that don't have a parent (main categories)
          return !category.parentId && !category.parent;
        });
        
        this.filteredCategories = [...this.categories];
        this.totalItems = this.categories.length;
        
        console.log('🔍 Main categories loaded:', {
          total: this.categories.length,
          categories: this.categories.map((c: any) => ({ 
            id: c.id, 
            name: c.nameAr || c.name,
            hasSubcategories: c.subCategories && c.subCategories.length > 0
          }))
        });
        
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'حدث خطأ في تحميل الأصناف';
        this.isLoading = false;
      }
    });
  }

  // Search functionality
  onSearchInput(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = this.categories.filter(category => {
        const searchLower = this.searchTerm.toLowerCase();
        return (
          (category.nameAr && category.nameAr.toLowerCase().includes(searchLower)) ||
          (category.name && category.name.toLowerCase().includes(searchLower)) ||
          (category.descriptionAr && category.descriptionAr.toLowerCase().includes(searchLower)) ||
          (category.description && category.description.toLowerCase().includes(searchLower))
        );
      });
    }
    
    this.currentPage = 1;
    this.totalItems = this.filteredCategories.length;
    this.updatePagination();
    
    console.log('🔍 Search results:', {
      searchTerm: this.searchTerm,
      totalResults: this.filteredCategories.length,
      results: this.filteredCategories.map((c: any) => c.nameAr || c.name)
    });
  }

  // Clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchInput();
  }

  // Pagination
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCategories = this.filteredCategories.slice(startIndex, endIndex);
    
    this.pagination = {
      current: this.currentPage,
      pages: Math.ceil(this.totalItems / this.pageSize),
      total: this.totalItems,
      limit: this.pageSize
    };
    
    console.log('🔍 Pagination updated:', {
      currentPage: this.currentPage,
      totalPages: this.pagination.pages,
      totalItems: this.totalItems,
      paginatedCategories: this.paginatedCategories.length,
      pagination: this.pagination
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Collapse functionality
  toggleSubcategories(categoryId: string): void {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
      
      // Load subcategories if not already loaded
      this.loadSubcategoriesForCategory(categoryId);
    }
  }

  loadSubcategoriesForCategory(categoryId: string): void {
    const category = this.categories.find(c => c.id === categoryId);
    
    // If subcategories are already loaded, don't reload
    if (category && category.subCategories && category.subCategories.length > 0) {
      return;
    }
    
    // Load subcategories from API
    this.categoriesService.getSubCategories(categoryId).subscribe({
      next: (subcategories: any) => {
        if (category) {
          category.subCategories = subcategories || [];
          console.log(`✅ Loaded ${subcategories.length} subcategories for category:`, categoryId);
          
          // Update pagination if needed
          this.updatePagination();
        }
      },
      error: (error) => {
        console.error('Error loading subcategories:', error);
        if (category) {
          category.subCategories = [];
        }
      }
    });
  }

  isExpanded(categoryId: string): boolean {
    return this.expandedCategories.has(categoryId);
  }

  // Category actions
  addNewCategory(): void {
    console.log('🔍 Adding new main category');
    this.router.navigate(['/categories/add']);
  }

  editCategory(categoryId: string): void {
    this.router.navigate(['/categories/edit', categoryId]);
  }

  deleteCategory(categoryId: string): void {
    const category = this.categories.find(c => c.id === categoryId);
    const categoryName = category?.nameAr || category?.name || 'هذا الصنف';
    
    this.itemToDelete = { id: categoryId, type: 'category' };
    this.confirmDialogData = {
      title: 'حذف الصنف',
      message: `هل أنت متأكد من حذف "${categoryName}"؟\nسيتم حذف جميع الأصناف الفرعية التابعة له أيضاً.`,
      confirmText: 'حذف',
      cancelText: 'إلغاء',
      type: 'danger'
    };
    this.showConfirmDialog = true;
  }

  // Subcategory actions
  addSubcategory(parentCategoryId: string): void {
    console.log('🔍 Adding subcategory with parentId:', parentCategoryId);
    this.router.navigate(['/categories/new'], { 
      queryParams: { parentId: parentCategoryId } 
    });
  }

  editSubcategory(subcategoryId: string): void {
    this.router.navigate(['/categories/edit', subcategoryId]);
  }

  deleteSubcategory(categoryId: string, subcategoryId: string): void {
    const category = this.categories.find(c => c.id === categoryId);
    const subcategory = category?.subCategories?.find((s: any) => s.id === subcategoryId);
    const subcategoryName = subcategory?.nameAr || subcategory?.name || 'هذا الصنف الفرعي';
    
    this.itemToDelete = { id: subcategoryId, type: 'subcategory', parentId: categoryId };
    this.confirmDialogData = {
      title: 'حذف الصنف الفرعي',
      message: `هل أنت متأكد من حذف "${subcategoryName}"؟`,
      confirmText: 'حذف',
      cancelText: 'إلغاء',
      type: 'danger'
    };
    this.showConfirmDialog = true;
  }

  // Confirm Dialog handlers
  onConfirmDelete(): void {
    if (!this.itemToDelete) return;

    const { id, type, parentId } = this.itemToDelete;
    
    this.categoriesService.deleteCategory(id).subscribe({
      next: () => {
        console.log(`تم حذف ${type === 'category' ? 'الصنف' : 'الصنف الفرعي'} بنجاح`);
        this.loadCategories();
        this.closeConfirmDialog();
      },
      error: (error) => {
        console.error(`Error deleting ${type}:`, error);
        alert(`حدث خطأ في حذف ${type === 'category' ? 'الصنف' : 'الصنف الفرعي'}`);
        this.closeConfirmDialog();
      }
    });
  }

  onCancelDelete(): void {
    this.closeConfirmDialog();
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.confirmDialogData = null;
    this.itemToDelete = null;
  }

  // Utility methods
  onImageError(event: any): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  getCategoryImage(category: any): string {
    // Check if category has an image
    if (category.image && category.image.trim() !== '') {
      return category.image;
    }
    
    // Check if category has an icon (legacy support)
    if (category.icon && category.icon.trim() !== '') {
      return category.icon;
    }
    
    // Return default image based on category type
    if (category.type === 'sub') {
      return '/assets/images/default-subcategory.svg';
    }
    
    return '/assets/images/default-category.svg';
  }

  getActiveCategoriesCount(): number {
    return this.categories.filter(cat => cat.isActive).length;
  }

  getStatusText(category: any): string {
    return category.isActive ? 'نشط' : 'غير نشط';
  }

  getStatusBadgeClass(category: any): string {
    return category.isActive 
      ? 'bg-green-100 text-green-800 border border-green-200' 
      : 'bg-red-100 text-red-800 border border-red-200';
  }

  // TrackBy functions for performance
  trackByCategory(index: number, category: any): string {
    return category.id || index;
  }

  trackBySubcategory(index: number, subcategory: any): string {
    return subcategory.id || index;
  }
}