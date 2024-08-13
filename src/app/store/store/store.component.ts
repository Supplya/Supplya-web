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
  vendor: any;
  vendorReviews: any[] = [];
  ngOnInit(): void {
    this.getProducts();
    const vendorId = this.router.snapshot.paramMap.get('vendorId');
    // this.getVendorDetails(vendorId);
    // this.getProducts(vendorId);
    // this.getVendorReviews(vendorId);
    this.vendor = {
      logo: '/assets/Images/logo.png',
      name: 'Green Haven Organics',
      description:
        'We provide the freshest organic produce sourced directly from local farms. Our commitment is to quality and sustainability.',
      phone: '+234 800 123 4567',
      email: 'contact@greenhaven.com',
      about:
        'Green Haven Organics was founded in 2015 with the mission to deliver fresh, organic produce to the community. We believe in supporting local farmers and ensuring our customers receive the highest quality products. Our journey began with a small stall at the farmer’s market and has now grown into a thriving online store that delivers across the region. We are committed to environmental sustainability, and all our packaging is eco-friendly.',
    };

    this.vendorReviews = [
      {
        user: 'John Doe',
        comment:
          'Fantastic products! The quality is unmatched and delivery was quick. Highly recommended.',
        rating: 4.5,
      },
      {
        user: 'Jane Smith',
        comment:
          'Great experience shopping here. The produce is always fresh and the customer service is excellent.',
        rating: 5,
      },
      {
        user: 'Paul Johnson',
        comment:
          'Good variety of organic products, but some items were out of stock. Will shop again.',
        rating: 4,
      },
    ];

  }

  getProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe(
      (data: any) => {
        this.products = data?.data;
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
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }
  getVendorReviews(vendorId: string) {
    // this.productService.getVendorReviews(vendorId).subscribe((data: any) => {
    //   this.vendorReviews = data.reviews;
    // });
  }
}
