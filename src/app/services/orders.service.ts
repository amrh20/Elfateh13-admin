import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

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

  constructor(private apiService: ApiService) { }

  getOrders(): Observable<any[]> {
    console.log('🚀 OrdersService: Calling API /orders');
    
    return this.apiService.get<any>('/orders').pipe(
      map((response: any) => {
        console.log('📦 Orders API response:', response);
        
        if (response && response.data) {
          console.log('✅ Orders data received:', response.data);
          return response.data;
        } else if (response && Array.isArray(response)) {
          console.log('✅ Orders array received directly:', response);
          return response;
        } else {
          console.log('⚠️ Unexpected response format, using mock data');
          return this.mockOrders;
        }
      }),
      catchError((error: any) => {
        console.error('❌ Error fetching orders from API:', error);
        console.log('🔄 Falling back to mock data');
        return of(this.mockOrders).pipe(delay(500));
      })
    );
  }

  getOrder(id: string): Observable<any | undefined> {
    console.log('🔍 OrdersService: Getting order by ID:', id);
    
    return this.apiService.get<any>(`/orders/${id}`).pipe(
      map((response: any) => {
        console.log('📦 Order API response:', response);
        
        if (response && response.data) {
          return response.data;
        } else if (response) {
          return response;
        } else {
          console.log('⚠️ Order not found in API, using mock data');
          return this.mockOrders.find(o => o.id === id);
        }
      }),
      catchError((error: any) => {
        console.error('❌ Error fetching order from API:', error);
        console.log('🔄 Falling back to mock data');
        return of(this.mockOrders.find(o => o.id === id)).pipe(delay(300));
      })
    );
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
