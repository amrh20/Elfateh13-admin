import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, catchError, map, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private mockCategories: any[] = [
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

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  getCategories(): Observable<any[]> {
    // Get auth token for admin endpoint
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No auth token found, trying public endpoint');
      return this.getCategoriesFromPublic();
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return this.apiService.get<any>('/categories/admin', {}, headers).pipe(
      map((response: any) => {
        console.log('API Response for /categories/admin:', response);
        if (response.success && response.data) {
          // Map API response to Category interface
          const mappedCategories = response.data.map((apiCategory: any) => this.mapApiResponseToCategory(apiCategory));
          console.log('Mapped categories:', mappedCategories);
          return { success: true, data: mappedCategories };
        } else {
          console.warn('Admin endpoint returned unsuccessful response, trying public endpoint');
          return { success: false, data: null };
        }
      }),
      switchMap((result: any) => {
        if (result.success && result.data) {
          return of(result.data);
        } else {
          console.log('Trying public endpoint as fallback');
          return this.getCategoriesFromPublic();
        }
      }),
      catchError((error: any) => {
        console.error('Error calling /categories/admin API:', error);
        console.log('Trying public endpoint as fallback');
        return this.getCategoriesFromPublic();
      })
    );
  }

  // Get public categories for comparison
  getPublicCategories(): Observable<any> {
    console.log('Getting public categories for comparison');
    
    return this.apiService.get<any>('/categories').pipe(
      map((response: any) => {
        console.log('Public categories response:', response);
        return response;
      }),
      catchError((error: any) => {
        console.error('Error getting public categories:', error);
        return of({ error: error.message || 'Unknown error' });
      })
    );
  }

  // Get categories from public endpoint as fallback
  getCategoriesFromPublic(): Observable<any[]> {
    console.log('Getting categories from public endpoint as fallback');
    
    return this.apiService.get<any>('/categories').pipe(
      map((response: any) => {
        console.log('Public categories fallback response:', response);
        if (response.success && response.data) {
          const mappedCategories = response.data.map((apiCategory: any) => this.mapApiResponseToCategory(apiCategory));
          console.log('Mapped categories from public endpoint:', mappedCategories);
          return mappedCategories;
        } else {
          console.warn('Public endpoint returned unsuccessful response:', response);
          return this.mockCategories;
        }
      }),
      catchError((error: any) => {
        console.error('Error getting categories from public endpoint:', error);
        console.log('Falling back to mock data');
        return of(this.mockCategories).pipe(delay(500));
      })
    );
  }

  // Map API response to Category interface
  private mapApiResponseToCategory(apiCategory: any): any {
    return {
      id: apiCategory._id || apiCategory.id,
      name: apiCategory.name || '',
      nameAr: apiCategory.nameAr || apiCategory.name || '', // Fallback to English name
      description: apiCategory.description || '',
      descriptionAr: apiCategory.descriptionAr || apiCategory.description || '', // Fallback to English description
      icon: apiCategory.icon || 'folder', // Default icon
      image: apiCategory.image || '',
      type: 'main', // Default to main category
      subCategories: [], // Empty array for now
      productCount: apiCategory.productCount || 0,
      isActive: apiCategory.isActive || true,
      createdAt: new Date(apiCategory.createdAt),
      updatedAt: new Date(apiCategory.updatedAt)
    };
  }

  getCategory(id: string): Observable<any | undefined> {
    const category = this.mockCategories.find((c: any) => c.id === id);
    return of(category).pipe(delay(300));
  }

  createCategory(categoryData: any): Observable<any> {
    const newCategory: any = {
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

  updateCategory(id: string, categoryData: Partial<any>): Observable<any> {
    const index = this.mockCategories.findIndex((c: any) => c.id === id);
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
    const index = this.mockCategories.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      this.mockCategories.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  getActiveCategories(): Observable<any[]> {
    const active = this.mockCategories.filter((c: any) => c.isActive);
    return of(active).pipe(delay(300));
  }

  getMainCategories(): Observable<any[]> {
    const mainCategories = this.mockCategories.filter((c: any) => c.type === 'main');
    return of(mainCategories).pipe(delay(300));
  }

  getSubCategories(parentId: string): Observable<any[]> {
    const subCategories = this.mockCategories.filter((c: any) => c.type === 'sub' && c.parentId === parentId);
    return of(subCategories).pipe(delay(300));
  }
}
