import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Category, CategoryFormData } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private mockCategories: Category[] = [
    {
      id: '1',
      name: 'Cleaners',
      nameAr: 'منظفات',
      description: 'Household cleaning products',
      descriptionAr: 'منتجات تنظيف منزلية',
      icon: 'bottle',
      image: 'https://via.placeholder.com/200x150',
      type: 'main',
      productCount: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      subCategories: [
        {
          id: '3',
          name: 'Floor Cleaners',
          nameAr: 'منظفات الأرضيات',
          description: 'Floor cleaning products',
          descriptionAr: 'منتجات تنظيف الأرضيات',
          productCount: 2,
          isActive: true
        }
      ]
    },
    {
      id: '2',
      name: 'Household Tools',
      nameAr: 'أدوات منزلية',
      description: 'Household tools and equipment',
      descriptionAr: 'أدوات ومعدات منزلية',
      icon: 'tools',
      image: 'https://via.placeholder.com/200x150',
      type: 'main',
      productCount: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      subCategories: [
        {
          id: '4',
          name: 'Kitchen Tools',
          nameAr: 'أدوات المطبخ',
          description: 'Kitchen tools and utensils',
          descriptionAr: 'أدوات وأواني المطبخ',
          productCount: 5,
          isActive: true
        }
      ]
    },
    {
      id: '3',
      name: 'Floor Cleaners',
      nameAr: 'منظفات الأرضيات',
      description: 'Floor cleaning products',
      descriptionAr: 'منتجات تنظيف الأرضيات',
      icon: 'brush',
      image: 'https://via.placeholder.com/200x150',
      type: 'sub',
      parentId: '1',
      parentName: 'منظفات',
      productCount: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      subCategories: []
    },
    {
      id: '4',
      name: 'Kitchen Tools',
      nameAr: 'أدوات المطبخ',
      description: 'Kitchen tools and utensils',
      descriptionAr: 'أدوات وأواني المطبخ',
      icon: 'tools',
      image: 'https://via.placeholder.com/200x150',
      type: 'sub',
      parentId: '2',
      parentName: 'أدوات منزلية',
      productCount: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      subCategories: []
    }
  ];

  constructor() { }

  getCategories(): Observable<Category[]> {
    return of(this.mockCategories).pipe(delay(500));
  }

  getCategory(id: string): Observable<Category | undefined> {
    const category = this.mockCategories.find(c => c.id === id);
    return of(category).pipe(delay(300));
  }

  createCategory(categoryData: CategoryFormData): Observable<Category> {
    const newCategory: Category = {
      id: Date.now().toString(),
      ...categoryData,
      image: categoryData.image ? 'https://via.placeholder.com/200x150' : undefined,
      productCount: 0,
      subCategories: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockCategories.push(newCategory);
    return of(newCategory).pipe(delay(800));
  }

  updateCategory(id: string, categoryData: Partial<CategoryFormData>): Observable<Category> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      // Handle image separately to avoid type conflicts
      const { image, ...otherData } = categoryData;
      const updatedCategory = { 
        ...this.mockCategories[index], 
        ...otherData, 
        updatedAt: new Date() 
      };
      
      // If image is provided, convert it to URL
      if (image) {
        updatedCategory.image = 'https://via.placeholder.com/200x150';
      }
      
      this.mockCategories[index] = updatedCategory;
      return of(this.mockCategories[index]).pipe(delay(800));
    }
    throw new Error('Category not found');
  }

  deleteCategory(id: string): Observable<boolean> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCategories.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  getActiveCategories(): Observable<Category[]> {
    const active = this.mockCategories.filter(c => c.isActive);
    return of(active).pipe(delay(300));
  }

  getMainCategories(): Observable<Category[]> {
    const mainCategories = this.mockCategories.filter(c => c.type === 'main');
    return of(mainCategories).pipe(delay(300));
  }

  getSubCategories(parentId: string): Observable<Category[]> {
    const subCategories = this.mockCategories.filter(c => c.type === 'sub' && c.parentId === parentId);
    return of(subCategories).pipe(delay(300));
  }
}
