import { Injectable } from '@angular/core';
import { ToastyService } from 'ng-toasty';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from 'src/app/models/operation/cart';
import { CartItem } from 'src/app/models/operation/cartItem';
import { Product } from 'src/app/models/operation/product';






@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private notify: ToastyService){

  }
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);


  addToCart1(product: Product): void {
    let cartItem = this.cart.items.find((item: any) => item.product.id === product._id);
    if (cartItem) return;
    this.cart.items.push(new CartItem(product));
    this.setCartToLocalStorage();
    // this.toast.success({detail: "Cart Update!", summary: "Product Added Successfully", duration: 4000})
  }

  addToCart3(product: Product): void {
    const cart = this.cartSubject.value;
    const cartItem = new CartItem(product);
    cart.items.push(cartItem);

    // Update total price and count
    cart.totalPrice += cartItem.price;
    cart.totalCount += cartItem.quantity;

    const cartJson = JSON.stringify(cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(cart);
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }


  getCart(): Cart {
    return this.cartSubject.value;
  }
  // addToCart(product: Product): void {
  //   const cartItem = new CartItem(product);
  //   this.cart.items.push(cartItem);
  //   console.log(cartItem, 'added to cart');
  //   this.setCartToLocalStorage();
  //   this.notify.success('Product Added Successfully');
  // }

  addToCart(product: Product): void {
    // Check if the product is already in the cart
    const existingCartItem = this.cart.items.find(item => item.product._id === product._id);
  
    if (existingCartItem) {
  
      this.notify.warning('Product is already in the cart');
    } else {
      // Product is not in the cart, add it
      const cartItem = new CartItem(product);
      this.cart.items.push(cartItem);
      console.log(cartItem, 'added to cart');
      this.setCartToLocalStorage();
      this.notify.success('Product Added Successfully');
    }
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
    this.cart.items = this.cart.items.filter(item => item.product._id !== productId);
    this.setCartToLocalStorage();
    this.notify.success('Product Removed Successfully');
  }


  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
    this.notify.success('Cart Cleared Successfully');
  }

  updateCartItems(items: CartItem[]): void {
    this.cart.items = items;
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId: number, quantity: number) {
    let cartItem = this.cart.items.find((item) => item.product._id === foodId);
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
