import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
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
          return mappedCategories;
        } else {
          console.warn('Admin endpoint returned unsuccessful response, trying public endpoint');
          return this.getCategoriesFromPublic();
        }
      }),
      switchMap((result: any) => {
        if (Array.isArray(result)) {
          return of(result);
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
          return [];
        }
      }),
      catchError((error: any) => {
        console.error('Error getting categories from public endpoint:', error);
        console.log('No categories available');
        return of([]);
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
      type: apiCategory.parent ? 'sub' : 'main', // Determine type based on parent
      parentId: apiCategory.parent || null,
      subCategories: apiCategory.subcategories ? apiCategory.subcategories.map((sub: any) => this.mapApiResponseToCategory(sub)) : [],
      productCount: apiCategory.productCount || 0,
      isActive: apiCategory.isActive !== undefined ? apiCategory.isActive : true,
      createdAt: apiCategory.createdAt ? new Date(apiCategory.createdAt) : new Date(),
      updatedAt: apiCategory.updatedAt ? new Date(apiCategory.updatedAt) : new Date()
    };
  }

  getCategory(id: string): Observable<any | undefined> {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No auth token found, cannot get single category');
      return of(undefined);
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return this.apiService.get<any>(`/categories/${id}`, {}, headers).pipe(
      map((response: any) => {
        if (response.success && response.data) {
          return this.mapApiResponseToCategory(response.data);
        }
        return undefined;
      }),
      catchError((error: any) => {
        console.error('Error getting category:', error);
        return of(undefined);
      })
    );
  }

  createCategory(categoryData: any): Observable<any> {
    // Get auth token for admin endpoint
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token found, cannot create category');
      throw new Error('Authentication required');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Prepare the request body according to API specification
    // Use Arabic fields as the main data
    const requestBody: any = {
      name: categoryData.nameAr, // Use Arabic name as the main name
      description: categoryData.descriptionAr // Use Arabic description as the main description
    };
    
    // Only add image if it exists and is not empty
    if (categoryData.image && categoryData.image.trim() !== '') {
      requestBody.image = categoryData.image;
    }
    
    // Add parent only for subcategories
    if (categoryData.type === 'sub' && categoryData.parentId) {
      requestBody.parent = categoryData.parentId;
    }

    console.log('Creating category with API call:', requestBody);

    return this.apiService.post<any>('/categories', requestBody, headers).pipe(
      map((response: any) => {
        console.log('API Response for creating category:', response);
        if (response.success && response.data) {
          // Map API response back to our format
          const newCategory = this.mapApiResponseToCategory(response.data);
          return newCategory;
        } else {
          console.warn('API returned unsuccessful response:', response);
          throw new Error(response.message || 'Failed to create category');
        }
      }),
      catchError((error: any) => {
        console.error('Error creating category via API:', error);
        throw error;
      })
    );
  }

  updateCategory(id: string, categoryData: Partial<any>): Observable<any> {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token found, cannot update category');
      throw new Error('Authentication required');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Prepare the request body
    const requestBody: any = {
      name: categoryData['nameAr'] || categoryData['name'],
      description: categoryData['descriptionAr'] || categoryData['description']
    };
    
    // Only add image if it exists and is not empty
    if (categoryData['image'] && categoryData['image'].trim() !== '') {
      requestBody.image = categoryData['image'];
    }
    
    // Add parent only for subcategories
    if (categoryData['type'] === 'sub' && categoryData['parentId']) {
      requestBody.parent = categoryData['parentId'];
    }

    console.log('Updating category with API call:', requestBody);

    return this.apiService.put<any>(`/categories/${id}`, requestBody, headers).pipe(
      map((response: any) => {
        console.log('API Response for updating category:', response);
        if (response.success && response.data) {
          return this.mapApiResponseToCategory(response.data);
        } else {
          throw new Error(response.message || 'Failed to update category');
        }
      }),
      catchError((error: any) => {
        console.error('Error updating category via API:', error);
        throw error;
      })
    );
  }

  deleteCategory(id: string): Observable<boolean> {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token found, cannot delete category');
      throw new Error('Authentication required');
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    console.log('Deleting category with API call:', id);

    return this.apiService.delete<any>(`/categories/${id}`, headers).pipe(
      map((response: any) => {
        console.log('API Response for deleting category:', response);
        if (response.success) {
          return true;
        } else {
          throw new Error(response.message || 'Failed to delete category');
        }
      }),
      catchError((error: any) => {
        console.error('Error deleting category via API:', error);
        throw error;
      })
    );
  }

  getActiveCategories(): Observable<any[]> {
    return this.getCategories().pipe(
      map((categories: any[]) => categories.filter((c: any) => c.isActive))
    );
  }

  getMainCategories(): Observable<any[]> {
    return this.getCategories().pipe(
      map((categories: any[]) => categories.filter((c: any) => c.type === 'main'))
    );
  }

  getSubCategories(parentId: string): Observable<any[]> {
    return this.getCategories().pipe(
      map((categories: any[]) => categories.filter((c: any) => c.type === 'sub' && c.parentId === parentId))
    );
  }
}
