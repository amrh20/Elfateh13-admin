import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  // Mock data for users
  users = [
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      role: 'user',
      isActive: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date('2024-02-20')
    }
  ];
}
