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
    category: '',
    stock: 0,
    isFeatured: false,
    isBestSeller: false,
    isOnSale: false,
    discountPercentage: 0,
    saleEndDate: '',
    saleQuantity: 0,
    featuredOrder: 1,
    featuredEndDate: ''
  };

  categories = ['Cleaners', 'Household Tools'];

  constructor(private router: Router) {}

  onSubmit(): void {
    console.log('Product form submitted:', this.product);
    // Here you would typically save the product
    alert('تم حفظ المنتج بنجاح!');
    this.router.navigate(['/products']);
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  calculateDiscountedPrice(): number {
    if (this.product.isOnSale && this.product.discountPercentage > 0) {
      const discount = this.product.price * (this.product.discountPercentage / 100);
      return this.product.price - discount;
    }
    return this.product.price;
  }
}
