import { Product } from "../../products/types/product";

export interface Order {
  id: string;
  userId: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;

  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;

  product: Product;
}
