import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  product = {
    nameAr: '',
    descriptionAr: '',
    price: 0,
    discount: 0,
    category: '',
    subCategory: '',
    isFeatured: false,
    isBestSeller: false,
    isOnSale: false,
    discountPercentage: 0,
    saleEndDate: '',
    saleQuantity: 0,
    featuredOrder: 1,
    featuredEndDate: ''
  };

  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];
  categories = ['Cleaners', 'Household Tools'];
  subCategories: { [key: string]: string[] } = {
    'Cleaners': ['Kitchen Cleaners', 'Bathroom Cleaners', 'Floor Cleaners'],
    'Household Tools': ['Kitchen Tools', 'Cleaning Tools', 'Storage Tools']
  };

  isSubmitting = false;
  errors: string[] = [];

  constructor(private router: Router) {}

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.processFiles(files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
  }

  processFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        // Check file size (max 10MB)
        if (file.size <= 10 * 1024 * 1024) {
          this.selectedImages.push(file);
          this.createImagePreview(file);
        } else {
          alert(`الملف ${file.name} كبير جداً. الحد الأقصى 10MB`);
        }
      } else {
        alert(`الملف ${file.name} ليس صورة صالحة`);
      }
    }
  }

  createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrls.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  validateForm(): boolean {
    this.errors = [];

    if (!this.product.nameAr.trim()) {
      this.errors.push('اسم المنتج مطلوب');
    }

    if (!this.product.descriptionAr.trim()) {
      this.errors.push('وصف المنتج مطلوب');
    }

    if (this.product.price <= 0) {
      this.errors.push('السعر يجب أن يكون أكبر من صفر');
    }

    if (!this.product.category) {
      this.errors.push('الصنف مطلوب');
    }

    if (this.product.isOnSale && this.product.discountPercentage <= 0) {
      this.errors.push('نسبة الخصم مطلوبة للمنتجات في العرض');
    }

    if (this.product.isOnSale && !this.product.saleEndDate) {
      this.errors.push('تاريخ انتهاء العرض مطلوب');
    }

    if (this.product.isFeatured && !this.product.featuredEndDate) {
      this.errors.push('تاريخ انتهاء التميز مطلوب');
    }

    if (this.selectedImages.length === 0) {
      this.errors.push('يجب رفع صورة واحدة على الأقل للمنتج');
    }

    return this.errors.length === 0;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      alert('يرجى تصحيح الأخطاء التالية:\n' + this.errors.join('\n'));
      return;
    }

    this.isSubmitting = true;
    
    console.log('Product form submitted:', this.product);
    console.log('Selected images:', this.selectedImages);
    
    // Here you would typically save the product with images
    setTimeout(() => {
      this.isSubmitting = false;
      alert('تم حفظ المنتج بنجاح!');
      this.router.navigate(['/products']);
    }, 1000);
  }

  cancel(): void {
    if (this.selectedImages.length > 0 || 
        this.product.nameAr || 
        this.product.descriptionAr) {
      if (confirm('هل أنت متأكد من إلغاء التغييرات؟')) {
        this.router.navigate(['/products']);
      }
    } else {
      this.router.navigate(['/products']);
    }
  }

  calculateDiscountedPrice(): number {
    if (this.product.isOnSale && this.product.discountPercentage > 0) {
      const discount = this.product.price * (this.product.discountPercentage / 100);
      return this.product.price - discount;
    }
    return this.product.price;
  }

  onCategoryChange(): void {
    // Reset subcategory when main category changes
    this.product.subCategory = '';
  }

  // Calculate discount amount when discount percentage changes
  onDiscountPercentageChange(): void {
    if (this.product.discountPercentage > 0 && this.product.price > 0) {
      this.product.discount = this.product.price * (this.product.discountPercentage / 100);
    } else {
      this.product.discount = 0;
    }
  }
}
