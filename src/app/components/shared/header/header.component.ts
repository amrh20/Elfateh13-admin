import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService, Notification } from '../../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  unreadCount = 0;
  showNotifications = false;
  recentNotifications: Notification[] = [];
  private unreadCountSubscription?: Subscription;
  private notificationsSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.unreadCountSubscription = this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
    });

    this.notificationsSubscription = this.notificationService.getNotifications().subscribe(notifications => {
      this.recentNotifications = notifications.slice(0, 5); // عرض آخر 5 إشعارات فقط
    });
  }

  ngOnDestroy(): void {
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }
  
  get currentUser$() {
    return this.authService.currentUser$;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showNotifications = false;
    }
  }

  handleNotificationClick(notification: Notification): void {
    // تحديد الإشعار كمقروء
    this.notificationService.markAsRead(notification.id);
    
    // إغلاق القائمة المنسدلة
    this.showNotifications = false;

    // التنقل حسب نوع الإشعار
    if (notification.type === 'order' && notification.orderId) {
      this.router.navigate(['/orders', notification.orderId]);
    } else if (notification.type === 'product' && notification.productId) {
      this.router.navigate(['/products', notification.productId]);
    } else {
      // للأنواع الأخرى، الانتقال إلى صفحة الإشعارات
      this.router.navigate(['/notifications']);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  goToNotifications(): void {
    this.showNotifications = false;
    this.router.navigate(['/notifications']);
  }

  logout(): void {
    this.authService.logout();
  }

  getNotificationIconClass(type: string): string {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-600';
      case 'product':
        return 'bg-green-100 text-green-600';
      case 'system':
        return 'bg-purple-100 text-purple-600';
      case 'promotion':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'الآن';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `منذ ${hours} ساعة`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `منذ ${days} يوم`;
    } else {
      return timestamp.toLocaleDateString('ar-EG');
    }
  }
}
