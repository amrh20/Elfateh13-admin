export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  password?: string;
  isActive: boolean;
  avatar?: File;
} 