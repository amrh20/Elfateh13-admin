import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  category: any = {
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    icon: 'folder',
    type: 'main',
    parentId: '',
    isActive: true
  };

  isEditMode = false;
  isLoading = false;
  parentCategories: any[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      this.isEditMode = true;
      this.loadCategory(categoryId);
    }
    this.loadParentCategories();
  }

  loadCategory(id: string): void {
    this.categoriesService.getCategory(id).subscribe({
      next: (category: any) => {
        if (category) {
          this.category = { ...category };
        }
      },
      error: (error: any) => {
        console.error('Error loading category:', error);
      }
    });
  }

  loadParentCategories(): void {
    this.categoriesService.getMainCategories().subscribe({
      next: (categories: any) => {
        this.parentCategories = categories;
      },
      error: (error: any) => {
        console.error('Error loading parent categories:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  createCategory(): void {
    this.isLoading = true;
    this.categoriesService.createCategory(this.category).subscribe({
      next: (category: any) => {
        console.log('Category form submitted:', this.category);
        this.router.navigate(['/categories']);
      },
      error: (error: any) => {
        console.error('Error creating category:', error);
        this.isLoading = false;
      }
    });
  }

  updateCategory(): void {
    this.isLoading = true;
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      this.categoriesService.updateCategory(categoryId, this.category).subscribe({
        next: (category: any) => {
          this.router.navigate(['/categories']);
        },
        error: (error: any) => {
          console.error('Error updating category:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onTypeChange(): void {
    if (this.category.type === 'main') {
      this.category.parentId = '';
    }
  }

  getIconOptions(): { value: string; label: string; icon: string }[] {
    return [
      { value: 'folder', label: 'مجلد', icon: '📁' },
      { value: 'bottle', label: 'زجاجة', icon: '🧴' },
      { value: 'tools', label: 'أدوات', icon: '🔧' },
      { value: 'brush', label: 'فرشاة', icon: '🖌️' },
      { value: 'star', label: 'نجمة', icon: '⭐' },
      { value: 'heart', label: 'قلب', icon: '❤️' }
    ];
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
