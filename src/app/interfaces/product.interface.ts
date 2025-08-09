export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subCategory?: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  discountPercentage?: number;
  saleEndDate?: string;
  saleQuantity?: number;
  featuredOrder?: number;
  featuredEndDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subCategory?: string;
  images: File[];
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  discountPercentage?: number;
  saleEndDate?: string;
  saleQuantity?: number;
  featuredOrder?: number;
  featuredEndDate?: string;
} 