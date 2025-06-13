import { Product } from "../products/types/product";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  product: Product;
}
