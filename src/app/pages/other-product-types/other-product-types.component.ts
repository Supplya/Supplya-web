import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/core/operation/services/cart/cart.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-other-product-types',
  templateUrl: './other-product-types.component.html',
  styleUrls: ['./other-product-types.component.scss'],
})
export class OtherProductTypesComponent implements OnInit {
  products: any = null;
  onSubmit: boolean = false;
  loading: boolean = false;
  AllAddedItems: any;
  categories: any;
  cart: any;

  constructor(
    private productService: ProductService,
    private loaderService: LoaderService,
    private cartService: CartService,
    private route: Router,
    private notify: ToastyService,
    private activatedRoute: ActivatedRoute
  ) {
    loaderService.hideLoader();
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.AllAddedItems = cart.items;
    });
  }
  totalProducts;
  itemsPerPage = 50;
  currentPage = 1;
  selectedProduct;
  p: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  onPageChange(page: number): void {
    this.p = page;
    this.GetActualProduct();
  }
  ngOnInit(): void {
    this.GetActualProduct();
  }

  GetActualProduct() {
    this.activatedRoute.params.subscribe((params) => {
      const productType = params['type'];
      this.fetchProductsByType(productType);
    });
  }

  fetchProductsByType(productType: string) {
    let productObservable: Observable<any>;

    switch (productType) {
      case 'arrival':
        this.selectedProduct = 'New Arrival';
        productObservable = this.productService.getAllNewArrivals(this.p, this.pageSize);
        break;
      case 'flash':
        this.selectedProduct = 'Flash Sales';
        productObservable = this.productService.getAllFlashProducts(
          this.p,
          this.pageSize
        );
        break;
      case 'trending':
        this.selectedProduct = 'Trending Products';
        productObservable = this.productService.getAllTrendingProducts(
          this.p,
          this.pageSize
        );
        break;
      default:
        this.selectedProduct = 'All Products';
        productObservable = this.productService.getAllProducts(
          this.p,
          this.pageSize
        );
        break;
    }

    this.loading = true;
    productObservable.subscribe(
      (data: any) => {
        this.products = data?.data;
        this.totalProducts = data?.totalProducts;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.errorFetching = true;
      }
    );
  }

  shop() {
    this.route.navigate(['/core/operation/shop']);
    window.scrollTo(0, 0);
  }
  signUp() {
    this.route.navigate(['/auth/sign-up']);
    window.scrollTo(0, 0);
  }
  errorFetching;

  toggleWishlist(product: any) {
    product.isWishlisted = !product.isWishlisted;
  }
  ifAddedToCart(product: any): boolean {
    const cartItem = this.AllAddedItems.find(
      (item: any) => item.product._id === product._id
    );
    return !!cartItem;
  }

  getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  addToCart(product: any) {
    this.onSubmit = true;
    this.cartService.addToCart(product);
  }
  scrollLeft() {
    const wrapper = document.querySelector('.wrapper-item');
    const scrollAmount = 200; // Adjust as needed

    if (wrapper) {
      wrapper.scrollBy({
        top: 0,
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  scrollRight() {
    const wrapper = document.querySelector('.wrapper-item');
    const scrollAmount = 200; // Adjust as needed

    if (wrapper) {
      wrapper.scrollBy({
        top: 0,
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  viewProduct(product: any) {
    this.route.navigate(['core/operation/product-details/', `${product}`]);
    window.scrollTo(0, 0);
  }
  toCart() {
    this.route.navigate(['core/operation/shopping-cart']);
    window.scrollTo(0, 0);
  }
}