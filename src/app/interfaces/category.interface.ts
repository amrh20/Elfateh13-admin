export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  icon?: string;
  image?: string;
  type: 'main' | 'sub';
  parentId?: string;
  parentName?: string;
  subCategories: SubCategory[];
  productCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubCategory {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  productCount: number;
  isActive: boolean;
}

export interface CategoryFormData {
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  icon?: string;
  image?: File;
  type: 'main' | 'sub';
  parentId?: string;
  isActive: boolean;
} 