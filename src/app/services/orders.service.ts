import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order } from '../interfaces/order.interface';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private orders: Order[] = [
    {
      id: '1',
      userId: 'USER-001',
      userName: 'أحمد محمد',
      userEmail: 'ahmed@example.com',
      items: [
        {
          productId: 'PROD-001',
          productName: 'Floor Cleaner',
          productNameAr: 'منظف الأرضيات',
          quantity: 2,
          price: 750,
          total: 1500
        }
      ],
      totalAmount: 1500,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: {
        street: 'شارع النيل',
        city: 'القاهرة',
        state: 'القاهرة',
        zipCode: '12345',
        country: 'مصر'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      userId: 'USER-002',
      userName: 'فاطمة علي',
      userEmail: 'fatima@example.com',
      items: [
        {
          productId: 'PROD-002',
          productName: 'Kitchen Cleaner',
          productNameAr: 'منظف المطبخ',
          quantity: 1,
          price: 1200,
          total: 1200
        },
        {
          productId: 'PROD-003',
          productName: 'Bathroom Cleaner',
          productNameAr: 'منظف الحمام',
          quantity: 1,
          price: 1100,
          total: 1100
        }
      ],
      totalAmount: 2300,
      status: 'confirmed',
      paymentStatus: 'paid',
      shippingAddress: {
        street: 'شارع المعادي',
        city: 'القاهرة',
        state: 'القاهرة',
        zipCode: '67890',
        country: 'مصر'
      },
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14')
    }
  ];

  constructor(private notificationService: NotificationService) {}

  getOrders(): Observable<Order[]> {
    return of(this.orders).pipe(delay(500));
  }

  getOrder(id: string): Observable<Order | undefined> {
    const order = this.orders.find(o => o.id === id);
    return of(order).pipe(delay(300));
  }

  createOrder(orderData: Partial<Order>): Observable<Order> {
    // إنشاء ID جديد متسلسل
    const nextId = (this.orders.length + 1).toString();
    
    const newOrder: Order = {
      id: nextId,
      userId: orderData.userId || 'USER-001',
      userName: orderData.userName || 'مستخدم جديد',
      userEmail: orderData.userEmail || 'user@example.com',
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: orderData.shippingAddress || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.orders.push(newOrder);
    
    // إرسال إشعار طلب جديد
    this.notificationService.notifyNewOrder(
      newOrder.id,
      newOrder.userName,
      newOrder.totalAmount
    );
    
    return of(newOrder).pipe(delay(500));
  }

  updateOrderStatus(orderId: string, status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'): Observable<Order> {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('الطلب غير موجود');
    }

    const oldStatus = order.status;
    order.status = status;

    // إرسال إشعارات حسب حالة الطلب
    switch (status) {
      case 'confirmed':
        this.notificationService.notifyOrderConfirmed(orderId, order.userName);
        break;
      case 'shipped':
        this.notificationService.notifyOrderShipped(orderId, order.userName);
        break;
      case 'delivered':
        this.notificationService.notifyOrderDelivered(orderId, order.userName);
        break;
      case 'cancelled':
        this.notificationService.notifyOrderCancelled(orderId, order.userName);
        break;
    }

    return of(order).pipe(delay(300));
  }

  deleteOrder(orderId: string): Observable<boolean> {
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index > -1) {
      this.orders.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
