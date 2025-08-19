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
    nameAr: '',
    descriptionAr: '',
    image: '',
    type: 'main',
    parentId: '',
    isActive: true
  };

  isEditMode = false;
  isLoading = false;
  parentCategories: any[] = [];
  errorMessage = '';

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    const parentId = this.route.snapshot.queryParamMap.get('parentId');
    
    // Clear any default values immediately
    this.category.image = '';
    this.category.icon = '';
    
    if (categoryId) {
      this.isEditMode = true;
      this.loadCategory(categoryId);
    }
    
    // Check if parentId is provided in query params (for subcategories)
    if (parentId) {
      this.category.type = 'sub';
      this.category.parentId = parentId;
    }
    
    this.loadParentCategories();
  }



  loadCategory(id: string): void {
    this.isLoading = true;
    this.categoriesService.getCategory(id).subscribe({
      next: (category: any) => {
        if (category) {
          console.log('🔍 Raw category data from API:', category);
          this.category = { ...category };
          console.log('🔍 Category after spread:', this.category);
          
          // Check if this is a subcategory and set type accordingly
          if (category.parentId) {
            this.category.type = 'sub';
            console.log('✅ Loaded subcategory with parentId:', category.parentId);
          } else {
            this.category.type = 'main';
            console.log('✅ Loaded main category with ID:', id);
          }
          
          // Set the category ID for editing
          this.category.id = id;
          
          // Clear any unwanted default values
          if (!this.category.image || this.category.image === 'folder') {
            this.category.image = '';
          }
          
          // Remove icon field completely if it exists
          if (this.category.icon) {
            delete this.category.icon;
          }
          
          console.log('🔍 Final category object:', this.category);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading category:', error);
        this.errorMessage = 'خطأ في تحميل بيانات الصنف';
        this.isLoading = false;
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
        this.errorMessage = 'خطأ في تحميل الأصناف الرئيسية';
      }
    });
  }

  isFormValid(): boolean {
    // Basic validation - only Arabic fields are required
    if (!this.category.nameAr) {
      return false;
    }
    
    // If it's a sub category, parent must be selected
    if (this.category.type === 'sub' && !this.category.parentId) {
      return false;
    }
    
 
    
    return true;
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }

    this.errorMessage = '';
    
    // Clean the data before sending
    this.cleanCategoryData();
    
    if (this.isEditMode) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  cleanCategoryData(): void {
    // Remove empty or default values
    if (!this.category.image || this.category.image.trim() === '') {
      delete this.category.image;
    }
    
    // Remove icon field completely
    delete this.category.icon;
    
    console.log('🧹 Cleaned category data:', this.category);
  }

  createCategory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Remove ID if it exists (for new categories)
    const categoryData = { ...this.category };
    delete categoryData.id;
    
    console.log('🆕 Creating category with data:', categoryData);
    
    this.categoriesService.createCategory(categoryData).subscribe({
      next: (category: any) => {
        this.isLoading = false;
        this.router.navigate(['/categories']);
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'خطأ في إنشاء الصنف';
        this.isLoading = false;
      }
    });
  }

  updateCategory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const categoryId = this.category.id || this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      console.log('🔄 Updating category with ID:', categoryId);
      console.log('🔄 Category data:', this.category);
      
      this.categoriesService.updateCategory(categoryId, this.category).subscribe({
        next: (category: any) => {
          console.log('✅ Category updated successfully:', category);
          this.isLoading = false;
          this.router.navigate(['/categories']);
        },
        error: (error: any) => {
          console.error('❌ Error updating category:', error);
          this.errorMessage = error.message || 'خطأ في تحديث الصنف';
          this.isLoading = false;
        }
      });
    } else {
      console.error('❌ No category ID found for update');
      this.errorMessage = 'خطأ: لم يتم العثور على معرف الصنف';
      this.isLoading = false;
    }
  }

  onTypeChange(): void {
    if (this.category.type === 'main') {
      this.category.parentId = '';
    }
    
    // Clear image field when type changes
    this.category.image = '';
    
    // Update image preview when type changes
    console.log('Category type changed to:', this.category.type);
  }



  getImagePreview(): string {
    // Return the image URL if available
    if (this.category.image && this.category.image.trim() !== '') {
      return this.category.image;
    }
    
    // Return default image based on category type
    if (this.category.type === 'sub') {
      return '/assets/images/default-subcategory.svg';
    }
    
    return '/assets/images/default-category.svg';
  }

  onImageError(event: any): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
