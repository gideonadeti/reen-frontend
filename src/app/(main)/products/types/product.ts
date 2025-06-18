export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrls: string[];
  adminId: string;
  orderCount: number;
  createdAt: Date;
  updatedAt: Date;

  admin: Admin;
}

export interface Admin {
  id: string;
  name: string;
}
