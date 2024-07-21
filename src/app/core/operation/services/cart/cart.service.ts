import { Injectable } from '@angular/core';
import { ToastyService } from 'ng-toasty';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from 'src/app/models/operation/cart';
import { CartItem } from 'src/app/models/operation/cartItem';
import { Product } from 'src/app/models/operation/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private notify: ToastyService) {}

  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  addToCart(product: Product): void {
    const quantity = product.moq;
    // Check if the product is already in the cart
    const existingCartItem = this.cart.items.find(
      (item) => item.product._id === product._id
    );

    if (existingCartItem) {
      // Product is already in the cart, update its quantity
      existingCartItem.quantity += quantity;
      // this.notify.info('Product quantity updated in the cart');
    } else {
      // Product is not in the cart, add it
      const cartItem = new CartItem(product);
      cartItem.quantity = quantity;
      this.cart.items.push(cartItem);
      this.notify.success('Product added to cart');
    }

    this.setCartToLocalStorage();
  }
  // addToCart(product: Product, quantity: number = 1): void {
  //   // Check if the product is already in the cart
  //   const existingCartItem = this.cart.items.find(
  //     (item) => item.product._id === product._id
  //   );

  //   if (existingCartItem) {
  //     // Product is already in the cart, update its quantity
  //     existingCartItem.quantity += quantity;
  //     this.notify.info('Product quantity updated in the cart');
  //   } else {
  //     // Product is not in the cart, add it
  //     const cartItem = new CartItem(product);
  //     cartItem.quantity = quantity;
  //     this.cart.items.push(cartItem);
  //     this.notify.success('Product added to the cart');
  //   }

  //   this.setCartToLocalStorage();
  // }
  addProductToCart(product: Product, quantity: number): void {
    // Check if the product is already in the cart
    const existingCartItem = this.cart.items.find(
      (item) => item.product._id === product._id
    );

    if (existingCartItem) {
      // Product is already in the cart, update its quantity
      existingCartItem.quantity += quantity;
      this.notify.info('Product quantity updated in the cart');
    } else {
      // Product is not in the cart, add it
      const cartItem = new CartItem(product);
      cartItem.quantity = quantity;
      this.cart.items.push(cartItem);
      this.notify.success('Product added to the cart');
    }

    this.setCartToLocalStorage();
  }

  private setCartToLocalStorage(): void {
    this.cart.totalPrice = this.cart.items.reduce(
      (prevSum, currentItem) =>
        prevSum + currentItem.quantity * currentItem.product.unit_price,
      0
    );
    this.cart.totalCount = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.quantity,
      0
    );

    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next({ ...this.cart }); // Create a new instance of the cart
  }

  removeFromCart(productId: number): void {
    this.cart.items = this.cart.items.filter(
      (item) => item.product._id !== productId
    );
    this.setCartToLocalStorage();
    this.notify.success('Product removed from the cart');
  }

  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
    // this.notify.success('Cart cleared successfully');
  }

  updateCartItems(items: CartItem[]): void {
    this.cart.items = items;
    this.setCartToLocalStorage();
  }

  changeQuantity(productId: number, quantity: number): void {
    let cartItem = this.cart.items.find(
      (item) => item.product._id === productId
    );
    if (!cartItem) return;
    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.product.unit_price;
    this.setCartToLocalStorage();
  }

  private getCartFromLocalStorage(): Cart {
    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }
}
