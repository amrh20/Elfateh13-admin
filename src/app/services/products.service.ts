import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product, ProductFormData } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Dishwashing Liquid',
      nameAr: 'سائل غسيل الأطباق',
      description: 'Effective dishwashing liquid that easily removes grease and protects your hands',
      descriptionAr: 'سائل غسيل أطباق فعال يزيل الدهون بسهولة ويحمي يديك',
      price: 25.99,
      originalPrice: 35.99,
      discount: 25,
      category: 'Cleaners',
      subCategory: 'Kitchen Cleaners',
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center'],
      rating: 4.5,
      reviewsCount: 95,
      stock: 50,
      isFeatured: true,
      isBestSeller: true,
      isOnSale: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Lavender Floor Cleaner',
      nameAr: 'منظف أرضيات لافندر',
      description: 'High-quality floor cleaner with a refreshing lavender scent, suitable for all types of floors',
      descriptionAr: 'منظف أرضيات عالي الجودة برائحة اللافندر المنعشة، مناسب لجميع أنواع الأرضيات',
      price: 45.99,
      category: 'Cleaners',
      subCategory: 'Floor Cleaners',
      images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=center'],
      rating: 4.8,
      reviewsCount: 120,
      stock: 30,
      isFeatured: true,
      isBestSeller: false,
      isOnSale: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Bathroom Cleaner',
      nameAr: 'منظف الحمام',
      description: 'Strong bathroom cleaner with antibacterial properties',
      descriptionAr: 'منظف حمام قوي مع خصائص مضادة للبكتيريا',
      price: 60.00,
      category: 'Cleaners',
      subCategory: 'Bathroom Cleaners',
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center'],
      rating: 4.5,
      reviewsCount: 22,
      stock: 15,
      isFeatured: true,
      isBestSeller: false,
      isOnSale: true,
      discountPercentage: 25,
      saleEndDate: '2024-12-31',
      saleQuantity: 50,
      featuredOrder: 2,
      featuredEndDate: '2024-12-31',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '4',
      name: 'Glass Cleaner',
      nameAr: 'منظف الزجاج',
      description: 'Professional glass cleaner for crystal clear results',
      descriptionAr: 'منظف زجاج احترافي لنتائج واضحة كالبلور',
      price: 35.00,
      category: 'Cleaners',
      subCategory: 'Glass Cleaners',
      images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=center'],
      rating: 4.7,
      reviewsCount: 78,
      stock: 25,
      isFeatured: false,
      isBestSeller: true,
      isOnSale: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '5',
      name: 'Multi-Surface Cleaner',
      nameAr: 'منظف متعدد الأسطح',
      description: 'Versatile cleaner for all surfaces in your home',
      descriptionAr: 'منظف متعدد الاستخدامات لجميع الأسطح في منزلك',
      price: 40.50,
      category: 'Cleaners',
      subCategory: 'Multi-Surface',
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center'],
      rating: 4.6,
      reviewsCount: 156,
      stock: 40,
      isFeatured: true,
      isBestSeller: false,
      isOnSale: true,
      discountPercentage: 15,
      saleEndDate: '2024-12-31',
      saleQuantity: 30,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(500));
  }

  getProduct(id: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product).pipe(delay(300));
  }

  createProduct(productData: ProductFormData): Observable<Product> {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData,
      images: productData.images.map(() => 'https://via.placeholder.com/300x200'),
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockProducts.push(newProduct);
    return of(newProduct).pipe(delay(800));
  }

  updateProduct(id: string, productData: Partial<ProductFormData>): Observable<Product> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      // Handle images separately to avoid type conflicts
      const { images, ...otherData } = productData;
      const updatedProduct = { 
        ...this.mockProducts[index], 
        ...otherData, 
        updatedAt: new Date() 
      };
      
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
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.mockProducts.filter(p => p.isFeatured);
    return of(featured).pipe(delay(300));
  }

  getBestSellers(): Observable<Product[]> {
    const bestSellers = this.mockProducts.filter(p => p.isBestSeller);
    return of(bestSellers).pipe(delay(300));
  }

  getOnSaleProducts(): Observable<Product[]> {
    const onSale = this.mockProducts.filter(p => p.isOnSale);
    return of(onSale).pipe(delay(300));
  }
}
