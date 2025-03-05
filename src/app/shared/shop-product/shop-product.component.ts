import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/operation/services/cart/cart.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';

@Component({
  selector: 'app-shop-product',
  templateUrl: './shop-product.component.html',
  styleUrls: ['./shop-product.component.scss']
})
export class ShopProductComponent {
  AllAddedItems
  cart
  @Input() products: any[] = [];
  @Output() addToCartEvent = new EventEmitter<any>();
  @Output() viewProductEvent = new EventEmitter<string>();
  @Output() toggleWishlistEvent = new EventEmitter<any>();
  constructor(
      private cartService: CartService, private route: Router
      ) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.AllAddedItems = cart.items;
    });
}
  getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  addToCart(product: any) {
    this.addToCartEvent.emit(product);
  }

  viewProduct(productId: string) {
    this.viewProductEvent.emit(productId);
  }

  toggleWishlist(product: any) {
    this.toggleWishlistEvent.emit(product);
  }

 
  ifAddedToCart(product: any): boolean {
    const cartItem = this.AllAddedItems.find(
      (item: any) => item.product._id === product._id
    );
    return !!cartItem;
  }

  toCart() {
    this.route.navigate(['core/operation/shopping-cart']);
    window.scrollTo(0, 0);
  }
}
