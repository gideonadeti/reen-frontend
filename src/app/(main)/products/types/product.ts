export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}
