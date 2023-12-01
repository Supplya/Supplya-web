export class Order {
    orderItems: OrderItem[] = [];
    phone!: string;
    country!: string;
    zip!: string;
    city!: string;
    user!: string;
  
  }
  
  export class OrderItem {
    product!: string;
    quantity!: number;
 
  }
  