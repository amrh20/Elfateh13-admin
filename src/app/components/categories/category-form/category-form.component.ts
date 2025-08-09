import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import { Category } from '../../../interfaces/category.interface';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  category = {
    nameAr: '',
    descriptionAr: '',
    icon: '',
    isActive: true,
    type: 'main' as 'main' | 'sub',
    parentId: ''
  };

  icons = [
    { value: 'bottle', label: 'زجاجة' },
    { value: 'tools', label: 'أدوات' },
    { value: 'brush', label: 'فرشاة' },
    { value: 'spray', label: 'رذاذ' },
    { value: 'box', label: 'صندوق' }
  ];

  mainCategories: Category[] = [];

  constructor(
    private router: Router,
    private categoriesService: CategoriesService
  ) {
    // Load main categories from service
    this.loadMainCategories();
  }

  loadMainCategories() {
    this.categoriesService.getMainCategories().subscribe({
      next: (categories) => {
        this.mainCategories = categories;
      },
      error: (error) => {
        console.error('Error loading main categories:', error);
      }
    });
  }

  onSubmit(): void {
    console.log('Category form submitted:', this.category);
    // Here you would typically save the category
    alert('تم حفظ الصنف بنجاح!');
    this.router.navigate(['/categories']);
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
