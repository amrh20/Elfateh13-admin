import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import { Category } from '../../../interfaces/category.interface';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading = true;
  searchTerm = '';
  expandedCategories: Set<string> = new Set();

  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        // Filter to show only main categories in the main list
        this.categories = categories.filter(cat => cat.type === 'main');
        this.filteredCategories = this.categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

  filterCategories(): void {
    this.filteredCategories = this.categories.filter(category => {
      return !this.searchTerm || 
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        category.nameAr.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  onSearchChange(): void {
    this.filterCategories();
  }

  toggleExpanded(categoryId: string): void {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }

  isExpanded(categoryId: string): boolean {
    return this.expandedCategories.has(categoryId);
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
        next: (success) => {
          if (success) {
            this.loadCategories();
          }
        },
        error: (error) => {
          console.error('Error deleting category:', error);
        }
      });
    }
  }

  getStatusBadge(category: Category): { text: string; class: string } {
    if (category.isActive) {
      return { text: 'نشط', class: 'bg-green-100 text-green-800' };
    }
    return { text: 'غير نشط', class: 'bg-red-100 text-red-800' };
  }
}
