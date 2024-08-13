import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  @Input() products: any[] = [];
  @Input() loading: boolean = false;
  @Input() error: boolean = false;

  @Output() refresh = new EventEmitter<void>();
  @Output() toggleWishlist = new EventEmitter<any>();
  @Output() viewProduct = new EventEmitter<string>();
  @Output() addToCart = new EventEmitter<any>();
  @Output() toCart = new EventEmitter<void>();
  @Input() addedItems: any[] = [];
  @Input() heading: string;
  // Event methods
  onRefresh() {
    this.refresh.emit();
  }

  onToggleWishlist(product: any) {
    this.toggleWishlist.emit(product);
  }

  onViewProduct(productId: string) {
    this.viewProduct.emit(productId);
  }

  onAddToCart(product: any) {
    this.addToCart.emit(product);
  }

  onToCart() {
    this.toCart.emit();
  }

  ifAddedToCart(product: any): boolean {
    const cartItem = this.addedItems.find(
      (item: any) => item.product._id === product._id
    );
    return !!cartItem;
  }

  // Utility methods for stars
  getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }
}
