import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {
  orderId = '';
  order: any = null;
  isLoading = true;

  // Modal states
  showStatusModal = false;
  showPaymentModal = false;
  showPrintModal = false;
  newOrderStatus = '';
  newPaymentStatus = '';
  statusNotes = '';
  paymentNotes = '';

  // Mock order data
  private mockOrders = [
    {
      id: '1',
      userName: 'أحمد محمد',
      userEmail: 'ahmed@example.com',
      userPhone: '+201234567890',
      totalAmount: 150.99,
      subtotal: 140.00,
      shipping: 10.99,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'بطاقة ائتمان',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      shippingAddress: {
        name: 'أحمد محمد',
        address: '123 شارع النيل',
        city: 'القاهرة',
        postalCode: '12345',
        phone: '+201234567890'
      },
      items: [
        {
          id: '1',
          name: 'منظف أرضيات لافندر',
          nameAr: 'منظف أرضيات لافندر',
          price: 45.99,
          quantity: 2,
          total: 91.98,
          image: 'https://via.placeholder.com/80x80'
        },
        {
          id: '2',
          name: 'منظف المطبخ',
          nameAr: 'منظف المطبخ',
          price: 24.00,
          quantity: 1,
          total: 24.00,
          image: 'https://via.placeholder.com/80x80'
        },
        {
          id: '3',
          name: 'منظف الحمام',
          nameAr: 'منظف الحمام',
          price: 24.00,
          quantity: 1,
          total: 24.00,
          image: 'https://via.placeholder.com/80x80'
        }
      ],
      notes: 'يرجى التوصيل في الصباح',
      statusHistory: [
        {
          status: 'pending',
          date: new Date('2024-01-15 10:00'),
          note: 'تم إنشاء الطلب'
        }
      ]
    },
    {
      id: '2',
      userName: 'فاطمة علي',
      userEmail: 'fatima@example.com',
      userPhone: '+201234567891',
      totalAmount: 89.50,
      subtotal: 79.50,
      shipping: 10.00,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'الدفع عند الاستلام',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-22'),
      shippingAddress: {
        name: 'فاطمة علي',
        address: '456 شارع المعادي',
        city: 'القاهرة',
        postalCode: '67890',
        phone: '+201234567891'
      },
      items: [
        {
          id: '4',
          name: 'أدوات المطبخ',
          nameAr: 'أدوات المطبخ',
          price: 39.75,
          quantity: 2,
          total: 79.50,
          image: 'https://via.placeholder.com/80x80'
        }
      ],
      notes: '',
      statusHistory: [
        {
          status: 'pending',
          date: new Date('2024-02-20 14:30'),
          note: 'تم إنشاء الطلب'
        },
        {
          status: 'confirmed',
          date: new Date('2024-02-21 09:15'),
          note: 'تم تأكيد الطلب'
        },
        {
          status: 'shipped',
          date: new Date('2024-02-21 16:45'),
          note: 'تم شحن الطلب'
        },
        {
          status: 'delivered',
          date: new Date('2024-02-22 11:20'),
          note: 'تم توصيل الطلب'
        }
      ]
    },
    {
      id: '3',
      userName: 'محمد حسن',
      userEmail: 'mohamed@example.com',
      userPhone: '+201234567892',
      totalAmount: 245.75,
      subtotal: 235.75,
      shipping: 10.00,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'بطاقة ائتمان',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10'),
      shippingAddress: {
        name: 'محمد حسن',
        address: '789 شارع الزمالك',
        city: 'القاهرة',
        postalCode: '11211',
        phone: '+201234567892'
      },
      items: [
        {
          id: '5',
          name: 'منظف الحمام',
          nameAr: 'منظف الحمام',
          price: 60.00,
          quantity: 3,
          total: 180.00,
          image: 'https://via.placeholder.com/80x80'
        },
        {
          id: '6',
          name: 'أدوات المطبخ',
          nameAr: 'أدوات المطبخ',
          price: 55.75,
          quantity: 1,
          total: 55.75,
          image: 'https://via.placeholder.com/80x80'
        }
      ],
      notes: 'يرجى التوصيل في المساء',
      statusHistory: [
        {
          status: 'pending',
          date: new Date('2024-03-10 16:00'),
          note: 'تم إنشاء الطلب'
        },
        {
          status: 'confirmed',
          date: new Date('2024-03-10 17:30'),
          note: 'تم تأكيد الطلب'
        }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.order = this.mockOrders.find(o => o.id === this.orderId);
      this.isLoading = false;
      
      if (!this.order) {
        alert('الطلب غير موجود');
        this.router.navigate(['/orders']);
      }
    }, 500);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'pending': 'في الانتظار',
      'confirmed': 'مؤكد',
      'processing': 'قيد المعالجة',
      'shipped': 'تم الشحن',
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي'
    };
    return texts[status] || status;
  }

  getPaymentStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getPaymentStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'pending': 'في الانتظار',
      'paid': 'مدفوع',
      'failed': 'فشل',
      'refunded': 'مسترد'
    };
    return texts[status] || status;
  }

  updateOrderStatus(): void {
    this.newOrderStatus = '';
    this.statusNotes = '';
    this.showStatusModal = true;
  }

  updatePaymentStatus(): void {
    this.newPaymentStatus = '';
    this.paymentNotes = '';
    this.showPaymentModal = true;
  }

  cancelStatusUpdate(): void {
    this.showStatusModal = false;
    this.newOrderStatus = '';
    this.statusNotes = '';
  }

  cancelPaymentUpdate(): void {
    this.showPaymentModal = false;
    this.newPaymentStatus = '';
    this.paymentNotes = '';
  }

  confirmStatusUpdate(): void {
    if (this.newOrderStatus) {
      // Update the order status
      this.order.status = this.newOrderStatus;
      
      // Add to status history
      this.order.statusHistory.push({
        status: this.newOrderStatus,
        date: new Date(),
        note: this.statusNotes || `تم تحديث الحالة إلى: ${this.getStatusText(this.newOrderStatus)}`
      });
      
      // Update the order in mock data
      const orderIndex = this.mockOrders.findIndex(o => o.id === this.orderId);
      if (orderIndex !== -1) {
        this.mockOrders[orderIndex] = { ...this.order };
      }
      
      console.log('Order status updated:', {
        orderId: this.orderId,
        newStatus: this.newOrderStatus,
        notes: this.statusNotes
      });
      
      alert(`تم تحديث حالة الطلب #${this.orderId} إلى: ${this.getStatusText(this.newOrderStatus)}`);
    }
    this.cancelStatusUpdate();
  }

  confirmPaymentUpdate(): void {
    if (this.newPaymentStatus) {
      // Update the payment status
      this.order.paymentStatus = this.newPaymentStatus;
      
      // Update the order in mock data
      const orderIndex = this.mockOrders.findIndex(o => o.id === this.orderId);
      if (orderIndex !== -1) {
        this.mockOrders[orderIndex] = { ...this.order };
      }
      
      console.log('Payment status updated:', {
        orderId: this.orderId,
        newStatus: this.newPaymentStatus,
        notes: this.paymentNotes
      });
      
      alert(`تم تحديث حالة الدفع #${this.orderId} إلى: ${this.getPaymentStatusText(this.newPaymentStatus)}`);
    }
    this.cancelPaymentUpdate();
  }

  showPrintPreview(): void {
    this.showPrintModal = true;
  }

  closePrintModal(): void {
    this.showPrintModal = false;
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  printOrder(): void {
    window.print();
    this.closePrintModal();
  }
} 