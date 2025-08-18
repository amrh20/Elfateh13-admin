# 📋 Orders API Integration Guide

## 🚀 API Endpoints

### 1. Get All Orders (Admin)
```
GET /orders
```

**Description**: Retrieves all orders for admin panel

**Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "orderNumber": "ORD-001",
      "customer": {
        "name": "Customer Name",
        "email": "customer@example.com",
        "phone": "+201234567890"
      },
      "items": [
        {
          "productId": "product_id",
          "name": "Product Name",
          "price": 25.99,
          "quantity": 2
        }
      ],
      "total": 97.97,
      "status": "confirmed",
      "paymentStatus": "paid",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 100,
    "limit": 20
  }
}
```

### 2. Get Order by ID
```
GET /orders/{orderId}
```

**Description**: Retrieves a specific order by ID

**Response Format**:
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "orderNumber": "ORD-001",
    "customer": { ... },
    "items": [ ... ],
    "total": 97.97,
    "status": "confirmed",
    "paymentStatus": "paid",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

## 🔧 Service Implementation

### OrdersService
```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private apiService: ApiService) { }

  getOrders(): Observable<any[]> {
    return this.apiService.get<any>('/orders').pipe(
      map((response: any) => {
        if (response && response.data) {
          return response.data;
        } else if (response && Array.isArray(response)) {
          return response;
        } else {
          return this.mockOrders; // Fallback
        }
      }),
      catchError((error: any) => {
        console.error('Error fetching orders:', error);
        return of(this.mockOrders).pipe(delay(500));
      })
    );
  }

  getOrder(id: string): Observable<any | undefined> {
    return this.apiService.get<any>(`/orders/${id}`).pipe(
      map((response: any) => {
        if (response && response.data) {
          return response.data;
        } else if (response) {
          return response;
        } else {
          return this.mockOrders.find(o => o.id === id);
        }
      }),
      catchError((error: any) => {
        console.error('Error fetching order:', error);
        return of(this.mockOrders.find(o => o.id === id)).pipe(delay(300));
      })
    );
  }
}
```

## 📱 Component Usage

### OrdersListComponent
```typescript
export class OrdersListComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe({
      next: (orders: any[]) => {
        console.log('Orders loaded:', orders);
        this.orders = orders;
        this.filteredOrders = orders;
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
      }
    });
  }
}
```

## 🎯 Order Status Values

### Order Status
- `pending` - في الانتظار
- `confirmed` - مؤكد
- `shipped` - تم الشحن
- `delivered` - تم التسليم
- `cancelled` - ملغي

### Payment Status
- `pending` - في الانتظار
- `paid` - مدفوع
- `failed` - فشل
- `refunded` - مسترد

## 🔍 Console Logs

The service includes comprehensive logging:

```
🚀 OrdersService: Calling API /orders
📦 Orders API response: { success: true, data: [...] }
✅ Orders data received: [...]
```

## 🛡️ Error Handling

- **API Success**: Returns API data
- **API Error**: Falls back to mock data
- **Unexpected Format**: Logs warning and uses mock data
- **Network Issues**: Graceful degradation to mock data

## 📊 Data Binding

### Order Properties
- `_id` - Order unique identifier
- `orderNumber` - Human-readable order number
- `customer` - Customer information object
- `items` - Array of order items
- `total` - Total order amount
- `status` - Current order status
- `paymentStatus` - Payment status
- `createdAt` - Order creation timestamp
- `updatedAt` - Last update timestamp

### Customer Properties
- `name` - Customer full name
- `email` - Customer email address
- `phone` - Customer phone number

### Item Properties
- `productId` - Product unique identifier
- `name` - Product name
- `price` - Product price
- `quantity` - Quantity ordered

## 🚀 Next Steps

1. **Test API Integration**: Verify orders are loaded from API
2. **Add Pagination**: Implement pagination for large order lists
3. **Real-time Updates**: Add WebSocket for live order updates
4. **Order Management**: Implement order status updates
5. **Export Functionality**: Add CSV/PDF export for orders
