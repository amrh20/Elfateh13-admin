import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss'
})
export class OrdersListComponent implements OnInit {
  constructor(
    private router: Router,
    private ordersService: OrdersService
  ) {}
  // Modal states
  showStatusModal = false;
  showPaymentModal = false;
  selectedOrderId = '';
  newOrderStatus = '';
  newPaymentStatus = '';
  statusNotes = '';
  paymentNotes = '';

  // Filter states
  searchTerm = '';
  statusFilter = '';
  filteredOrders: any[] = [];

  // Mock data for orders
  orders = [
    {
      id: '1',
      userName: 'أحمد محمد',
      userEmail: 'ahmed@example.com',
      totalAmount: 150.99,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      userName: 'فاطمة علي',
      userEmail: 'fatima@example.com',
      totalAmount: 89.50,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: new Date('2024-02-20')
    },
    {
      id: '3',
      userName: 'محمد حسن',
      userEmail: 'mohamed@example.com',
      totalAmount: 245.75,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date('2024-03-10')
    },
    {
      id: '4',
      userName: 'سارة أحمد',
      userEmail: 'sara@example.com',
      totalAmount: 67.25,
      status: 'shipped',
      paymentStatus: 'pending',
      createdAt: new Date('2024-03-15')
    },
    {
      id: '5',
      userName: 'علي محمود',
      userEmail: 'ali@example.com',
      totalAmount: 189.99,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: new Date('2024-03-12')
    }
  ];

  ngOnInit(): void {
    this.loadOrders();
    this.filteredOrders = this.orders;
  }

  loadOrders(): void {
    console.log('🚀 Loading orders from service...');
    
    this.ordersService.getOrders().subscribe({
      next: (orders: any[]) => {
        this.orders = orders;
        // this.filteredOrders = orders;
        console.log('✅ Orders loaded successfully, count:', orders.length);
      },
      error: (error: any) => {
        console.error('❌ Error loading orders:', error);
        // Keep using mock data if API fails
        this.filteredOrders = this.orders;
      }
    });
  }

  onSearchChange(): void {
    this.filterOrders();
  }

  onFilterChange(): void {
    this.filterOrders();
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.id.includes(this.searchTerm);
      
      const matchesStatus = !this.statusFilter || order.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'pending': 'في الانتظار',
      'confirmed': 'مؤكد',
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

  // Modal functions
  viewOrderDetails(orderId: string): void {
    console.log('Viewing order details for:', orderId);
    // Navigate to order details page
    this.router.navigate(['/orders', orderId]);
  }

  updateOrderStatus(orderId: string): void {
    this.selectedOrderId = orderId;
    this.newOrderStatus = '';
    this.statusNotes = '';
    this.showStatusModal = true;
  }

  updatePaymentStatus(orderId: string): void {
    this.selectedOrderId = orderId;
    this.newPaymentStatus = '';
    this.paymentNotes = '';
    this.showPaymentModal = true;
  }

  cancelStatusUpdate(): void {
    this.showStatusModal = false;
    this.selectedOrderId = '';
    this.newOrderStatus = '';
    this.statusNotes = '';
  }

  cancelPaymentUpdate(): void {
    this.showPaymentModal = false;
    this.selectedOrderId = '';
    this.newPaymentStatus = '';
    this.paymentNotes = '';
  }

  confirmStatusUpdate(): void {
    if (this.newOrderStatus) {
      // Find and update the order
      const order = this.orders.find(o => o.id === this.selectedOrderId);
      if (order) {
        order.status = this.newOrderStatus;
        console.log('Order status updated:', {
          orderId: this.selectedOrderId,
          newStatus: this.newOrderStatus,
          notes: this.statusNotes
        });
        alert(`تم تحديث حالة الطلب #${this.selectedOrderId} إلى: ${this.getStatusText(this.newOrderStatus)}`);
      }
    }
    this.cancelStatusUpdate();
  }

  confirmPaymentUpdate(): void {
    if (this.newPaymentStatus) {
      // Find and update the order
      const order = this.orders.find(o => o.id === this.selectedOrderId);
      if (order) {
        order.paymentStatus = this.newPaymentStatus;
        console.log('Payment status updated:', {
          orderId: this.selectedOrderId,
          newStatus: this.newPaymentStatus,
          notes: this.paymentNotes
        });
        alert(`تم تحديث حالة الدفع #${this.selectedOrderId} إلى: ${this.getPaymentStatusText(this.newPaymentStatus)}`);
      }
    }
    this.cancelPaymentUpdate();
  }

  createTestOrder(): void {
    // This method is removed as OrdersService doesn't have createOrder method
    console.log('createTestOrder method is not implemented');
    alert('هذه الميزة غير متاحة حالياً');
  }
}
