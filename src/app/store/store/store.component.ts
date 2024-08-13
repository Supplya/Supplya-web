import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { CartService } from 'src/app/core/operation/services/cart/cart.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
  cart;
  AllAddedItems;
  products: any = null;
  loading = false;
  error = false;

  constructor(
    private productService: ProductService,
    private loaderService: LoaderService,
    private cartService: CartService,
    private route: Router,
    private router: ActivatedRoute,
    private notify: ToastyService
  ) {
    loaderService.hideLoader();
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.AllAddedItems = cart.items;
    });
  }
  vendor;
  vendorReviews: any[] = [];
  storeName;
  ngOnInit(): void {
    this.getProducts();

    this.storeName = this.router.snapshot.paramMap.get('store-name');
    // this.getVendorDetails(vendorId);
    // this.getStoreProducts();
    this.getStoreInfo();
    // this.getVendorReviews(vendorId);
  }

  detailsLoading = false;
  detailsError = false;
  getStoreInfo(): void {
    this.detailsLoading = true;
    this.productService.getStoreDetails(this.storeName).subscribe(
      (response) => {
        this.vendor = response['data'];
        this.detailsLoading = false;
      },
      (error) => {
        this.detailsError = true;
        this.detailsLoading = false;
      }
    );
  }
  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
  }
  getStoreProducts(): void {
    this.loading = true;
    this.productService.getStoreProducts(this.storeName).subscribe(
      (response: any) => {
        this.products = response.data;
        this.totalProducts = response.totalProducts;
        this.loading = false;
      },
      (error) => {
        this.error = true;
        this.loading = false;
      }
    );
  }
  totalProducts: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 4;
  getProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe(
      (data: any) => {
        this.products = data?.data;
        this.totalProducts = data.totalProducts;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.error = true;
      }
    );
  }

  toggleWishlist(product: any) {
    product.isWishlisted = !product.isWishlisted;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

  viewProduct(product: any) {
    this.route.navigate(['core/operation/product-details/', `${product}`]);
    window.scrollTo(0, 0);
  }

  toCart() {
    this.route.navigate(['core/operation/shopping-cart']);
    window.scrollTo(0, 0);
  }

  getVendorDetails(vendorId: string) {
    // this.vendorService.getVendorById(vendorId).subscribe((data: any) => {
    //   this.vendor = data.vendor;
    // });
  }

  getProductsE(vendorId: string) {
    // this.loading = true;
    // this.productService.getProductsByVendor(vendorId).subscribe(
    //   (data: any) => {
    //     this.products = data.products;
    //     this.loading = false;
    //   },
    //   (error) => {
    //     this.error = true;
    //     this.loading = false;
    //   }
    // );
  }
  getStarsArray(rating: number): number[] {
    return Array(Math?.floor(rating))?.fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math?.floor(rating))?.fill(0);
  }
  getVendorReviews(vendorId: string) {
    // this.productService.getVendorReviews(vendorId).subscribe((data: any) => {
    //   this.vendorReviews = data.reviews;
    // });
  }
}
