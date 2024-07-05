import { Product } from "./product";

export class CartItem {
  constructor(public product: any) {}
  // constructor(public product: Product) {}

  quantity = 1;
  price = this.product.unit_price;
}