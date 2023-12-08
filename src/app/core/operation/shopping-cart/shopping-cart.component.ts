import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { Cart } from 'src/app/models/operation/cart';
import { CartItem } from 'src/app/models/operation/cartItem';



@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  quantity: number = 1;
  cart!: Cart;
  cartItems: CartItem[] = [];
  loading: boolean = false;

  constructor(private cartService: CartService, private route: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.cartItems = cart.items;
      this.loading = false;
      console.log(this.cart, 'getCartObservable');
    });
  }

  removeFromCart(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem.product._id);

  }

  changeQuantity(delta: number, cartItem: CartItem) {

    cartItem.quantity += delta;
    if (cartItem.quantity < 1) {
      cartItem.quantity = 1;
    }
    this.cartService.changeQuantity(cartItem.product._id, cartItem.quantity);
  }

  clearCart() {
    this.cartService.clearCart();
  }
  checkoutRoute() {
    this.route.navigate(['core/operation/checkout']);
    window.scrollTo(0, 0);
  }
  shoRoute() {
    this.route.navigate(['core/operation/shop']);
    window.scrollTo(0, 0);
  }


  
}
