import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product/product.service';
import { CartService } from '../services/cart/cart.service';
import { ToastyService } from 'ng-toasty';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  selectedTab: string = 'description'; // Default selected tab
  product: any = null;
  cart: any;
  reviews: any;
  products: any;
  AllAddedItems: any;
  loading: boolean = false;
  reviewForm: FormGroup;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private route: Router,
    private cartService: CartService,
    private fb: FormBuilder,
    private notify: ToastyService
  ) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.AllAddedItems = cart.items;
    });

    this.reviewForm = this.fb.group({
      foodId: [''],
      commentedById: [''],
      commentedByName: [''],
      rating: [null],
      comment: ['', Validators.required],
      postedDate: [''],
    });
  }
  onSubmit: boolean = false;
  productsError: boolean = false;
  ngOnInit(): void {
    this.loading = true;

    this.getProduct();
    this.getAllRelatedProducts();
  }
  id;
  getProduct() {
    this.activatedRoute.params.subscribe((params) => {
      const foodID = params['id'];
      this.id = params['id'];
      if (foodID) {
        this.productService.getProductId(foodID).subscribe(
          (product: any) => {
            this.loading = false;

            if (product.status) {
              this.product = product.data;

              if (this.product) {
                this.initializeQuantity();
              }
              this.loading = false;
              this.productsError = true;
            }
          },
          (error) => {
            this.loading = false;
          }
        );
      }
    });
  }
  refreshProduct() {
    this.productsError = false;
    this.getProduct();
  }
  quantity: number = 1;
  toggleWishlist(product: any) {
    product.isWishlisted = !product.isWishlisted;
  }
  changeQuantity(delta: number) {
    this.quantity += delta;
    if (this.quantity < 1) {
      this.quantity = 1;
    }

    // Update the cart if the product is already in it
    if (this.ifAddedToCart(this.product)) {
      this.cartService.changeQuantity(this.product._id, this.quantity);
    }
  }

  initializeQuantity() {
    const cart = this.cartService.getCart();
    const cartItem = cart.items.find(
      (item) => item.product._id === this.product._id
    );
    if (cartItem) {
      this.quantity = cartItem.quantity;
    } else {
      // console.log('Cart item not found');
    }
  }

  addToWishlist(): void {
    this.product.isWishlisted = !this.product.isWishlisted;
  }

  relatedLoading: boolean = false;
  relatedProductError: boolean = false;
  similarProducts: any = null
  getAllRelatedProducts() {
    this.relatedLoading = true;

    this.productService.getRelatedProducts(this.id).subscribe(
      (data: any) => {
        this.similarProducts = data?.data;
        console.log(data);

        this.relatedLoading = false;
      },
      (error) => {
        this.relatedLoading = false;
        this.relatedProductError = true;
        console.error('Error fetching products:', error);
      }
    );
  }

  ifAddedToCart(product: any): boolean {
    // Check if the product is in the list of added items (cart)
    const cartItem = this.AllAddedItems.find(
      (item: any) => item.product._id === product._id
    );

    // Return true if the product is in the cart, otherwise, return false
    return !!cartItem;
  }

  getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    // this.notify.success(`${product.name} Added to Cart successfully`)
    // this.route.navigateByUrl('/core/operation/shopping-cart');
  }

  viewProduct(route: number) {
    this.route.navigate(['core/operation/product-details/', `${route}`]);
    window.scrollTo(0, 0);
  }
  toCart() {
    this.route.navigate(['core/operation/shopping-cart']);
    window.scrollTo(0, 0);
  }
}
