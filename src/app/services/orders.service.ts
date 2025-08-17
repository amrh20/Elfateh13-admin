import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private mockOrders: any[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: {
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+201234567890'
      },
      items: [
        {
          productId: '1',
          name: 'Dishwashing Liquid',
          price: 25.99,
          quantity: 2
        },
        {
          productId: '2',
          name: 'Lavender Floor Cleaner',
          price: 45.99,
          quantity: 1
        }
      ],
      total: 97.97,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customer: {
        name: 'فاطمة علي',
        email: 'fatima@example.com',
        phone: '+201234567891'
      },
      items: [
        {
          productId: '3',
          name: 'Bathroom Cleaner',
          price: 60.00,
          quantity: 1
        }
      ],
      total: 60.00,
      status: 'shipped',
      paymentStatus: 'paid',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  constructor() { }

  getOrders(): Observable<any[]> {
    return of(this.mockOrders).pipe(delay(500));
  }

  getOrder(id: string): Observable<any | undefined> {
    const order = this.mockOrders.find(o => o.id === id);
    return of(order).pipe(delay(300));
  }

  updateOrderStatus(orderId: string, status: string): Observable<boolean> {
    const order = this.mockOrders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  updatePaymentStatus(orderId: string, paymentStatus: string): Observable<boolean> {
    const order = this.mockOrders.find(o => o.id === orderId);
    if (order) {
      order.paymentStatus = paymentStatus;
      order.updatedAt = new Date();
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
