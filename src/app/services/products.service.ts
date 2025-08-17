import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private mockProducts: any[] = [
    {
      _id: '1',
      name: 'Dishwashing Liquid',
      description: 'Effective dishwashing liquid that easily removes grease and protects your hands',
      price: 25.99,
      stock: 50,
      category: {
        _id: 'cleaners',
        name: 'Cleaners'
      },
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center'],
      featured: true,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '2',
      name: 'Lavender Floor Cleaner',
      description: 'High-quality floor cleaner with a refreshing lavender scent, suitable for all types of floors',
      price: 45.99,
      stock: 30,
      category: {
        _id: 'cleaners',
        name: 'Cleaners'
      },
      images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=center'],
      featured: true,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '3',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 89.99,
      stock: 20,
      category: {
        _id: 'electronics',
        name: 'Electronics'
      },
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center'],
      featured: false,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '4',
      name: 'Garden Tools Set',
      description: 'Complete set of essential garden tools for home gardening',
      price: 29.99,
      stock: 45,
      category: {
        _id: 'home-garden',
        name: 'Home & Garden'
      },
      images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop&crop=center'],
      featured: false,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '5',
      name: 'Programming Book',
      description: 'Comprehensive guide to modern programming techniques',
      price: 19.99,
      stock: 80,
      category: {
        _id: 'books',
        name: 'Books'
      },
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&crop=center'],
      featured: false,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '6',
      name: 'Denim Jeans',
      description: 'Premium quality denim jeans with perfect fit',
      price: 79.99,
      stock: 60,
      category: {
        _id: 'clothing',
        name: 'Clothing'
      },
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop&crop=center'],
      featured: true,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '7',
      name: 'Winter Jacket',
      description: 'Warm and stylish winter jacket for cold weather',
      price: 129.99,
      stock: 30,
      category: {
        _id: 'clothing',
        name: 'Clothing'
      },
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&crop=center'],
      featured: false,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '8',
      name: 'Kitchen Blender',
      description: 'Professional kitchen blender for smoothies and food processing',
      price: 59.99,
      stock: 40,
      category: {
        _id: 'home-garden',
        name: 'Home & Garden'
      },
      images: ['https://images.unsplash.com/photo-1570222094114-d054a8173cdb?w=400&h=300&fit=crop&crop=center'],
      featured: false,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ];

  constructor(private apiService: ApiService) { }

  getProducts(page: number = 1, limit: number = 20): Observable<any> {
    console.log('🔄 Calling API: GET /products/admin');
    console.log('📄 Page:', page, 'Limit:', limit);
    
    const params = { page, limit };
    
    return this.apiService.get<any>('/products/admin', params).pipe(
      map((response: any) => {
        console.log('✅ API Response for products:', response);
        return response;
      }),
      catchError((error: any) => {
        console.error('❌ API Error for products:', error);
        console.log('🔄 Falling back to mock data');
        
        // Create mock response with pagination
        const mockResponse: any = {
          success: true,
          data: this.mockProducts,
          pagination: {
            current: page,
            pages: Math.ceil(this.mockProducts.length / limit),
            total: this.mockProducts.length,
            limit: limit
          }
        };
        
        return of(mockResponse).pipe(delay(500));
      })
    );
  }

  getProduct(id: string): Observable<any | undefined> {
    const product = this.mockProducts.find((p: any) => p._id === id);
    return of(product).pipe(delay(300));
  }

  createProduct(productData: any): Observable<any> {
    const newProduct: any = {
      _id: Date.now().toString(),
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      category: {
        _id: 'mock-category-id',
        name: productData.category
      },
      images: productData.images.map(() => 'https://via.placeholder.com/300x200'),
      featured: productData.featured,
      isActive: productData.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockProducts.push(newProduct);
    return of(newProduct).pipe(delay(800));
  }

  updateProduct(id: string, productData: Partial<any>): Observable<any> {
    const index = this.mockProducts.findIndex((p: any) => p._id === id);
    if (index !== -1) {
      // Handle images separately to avoid type conflicts
      const { images, category, ...otherData } = productData;
      const updatedProduct = { 
        ...this.mockProducts[index], 
        ...otherData, 
        updatedAt: new Date().toISOString() 
      };
      
      // If category is provided, update it
      if (category) {
        updatedProduct.category = {
          _id: 'mock-category-id',
          name: category
        };
      }
      
      // If images are provided, convert them to URLs
      if (images) {
        updatedProduct.images = images.map(() => 'https://via.placeholder.com/300x200');
      }
      
      this.mockProducts[index] = updatedProduct;
      return of(this.mockProducts[index]).pipe(delay(800));
    }
    throw new Error('Product not found');
  }

  deleteProduct(id: string): Observable<boolean> {
    const index = this.mockProducts.findIndex((p: any) => p._id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  getFeaturedProducts(): Observable<any[]> {
    const featured = this.mockProducts.filter((p: any) => p.featured);
    return of(featured).pipe(delay(300));
  }

  getBestSellers(): Observable<any[]> {
    // Since isBestSeller no longer exists, return empty array or implement new logic
    return of([]).pipe(delay(300));
  }

  getOnSaleProducts(): Observable<any[]> {
    // Since isOnSale no longer exists, return empty array or implement new logic
    return of([]).pipe(delay(300));
  }
}
