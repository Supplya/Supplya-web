import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { AppComponent } from 'src/app/app.component';
import { CartService } from 'src/app/core/operation/services/cart/cart.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: any = null;
  onSubmit: boolean = false;
  loading: boolean = false;
  AllAddedItems: any;
  categories: any;
  cart: any;
  newArrivals: any = null;
  constructor(
    private productService: ProductService,
    private loaderService: LoaderService,
    private cartService: CartService,
    private route: Router,
    private notify: ToastyService
  ) {
    loaderService.hideLoader();
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.AllAddedItems = cart.items;
    });
  }

  productCategories = [
    {
      name: 'Fruits and Vegetables',
      displayName: 'Fruits and Vegetables',
      imgSrc: '/assets/Images/Fruits-veg.png',
    },
    {
      name: 'Meat and Poultry',
      displayName: 'Meat and Poultry',
      imgSrc: '/assets/Images/Meat-poultry.png',
    },
    { name: 'Dairy', displayName: 'Dairy', imgSrc: '/assets/Images/Dairy.png' },
    {
      name: 'Baking',
      displayName: 'Baking',
      imgSrc: '/assets/Images/snack.png',
    },
    {
      name: 'Grains & Flour',
      displayName: 'Grains & Flour',
      imgSrc: '/assets/Images/Grains-Flour.png',
    },
    {
      name: 'Condiments & Seasonings',
      displayName: 'Condiments & Seasonings',
      imgSrc: '/assets/Images/condiments-seasoning.png',
    },
    {
      name: 'Drinks & Beverages',
      displayName: 'Drinks & Beverages',
      imgSrc: '/assets/Images/Drinks-beverages.png',
    },
    { name: 'Oil', displayName: 'Oil', imgSrc: '/assets/Images/Oil.png' },
  ];
  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
    this.getAllNewArrivals();
    this.getAllFlashProducts();
    this.getAllTrendingProducts();
  }

  newArrivalLoading = false;
  newArrivalError = false;
  getAllNewArrivals() {
    this.newArrivalLoading = true;
    this.productService.getAllNewArrivals().subscribe(
      (data: any) => {
        this.newArrivals = data?.data;
        this.newArrivalLoading = false;
      },
      (error) => {
        this.newArrivalLoading = false;
        this.newArrivalError = true;
      }
    );
  }
  refreshNewArrival() {
    this.newArrivalError = false;
    this.getAllNewArrivals();
  }
  shop() {
    this.route.navigate(['/core/operation/shop']);
    window.scrollTo(0, 0);
  }
  signUp() {
    this.route.navigate(['/auth/sign-up']);
    window.scrollTo(0, 0);
  }
  productsError = false;
  getAllProducts() {
    this.loading = true;

    this.productService.getAllProducts(1, 20).subscribe(
      (data: any) => {
        this.products = data?.data;
        this.lastToFirstProducts = [...data?.data]?.reverse();
        
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.productsError = false;
      }
    );
  }
  lastToFirstProducts;
 
  refreshProducts() {
    this.getAllProducts();
    this.productsError = false;
  }
  flashProducts: any = null;
  flashProductLoading = false;
  flashProductError = false;
  getAllFlashProducts() {
    this.flashProductLoading = true;

    this.productService.getAllFlashProducts().subscribe(
      (data: any) => {
        this.flashProducts = data?.data;
        this.flashProductLoading = false;
      },
      (error) => {
        this.flashProductLoading = false;
        this.flashProductError = true;
      }
    );
  }

  trendingProducts: any = null;
  trendingProductLoading = false;
  trendingProductError = false;
  getAllTrendingProducts() {
    this.flashProductLoading = true;
    this.trendingProductError = false;
    this.productService.getAllTrendingProducts().subscribe(
      (data: any) => {
        this.trendingProducts = data?.data;
        this.trendingProductLoading = false;
      },
      (error) => {
        this.trendingProductLoading = false;
        this.trendingProductError = true;
      }
    );
  }
  refreshFlashProducts() {
    this.flashProductError = false;
    this.getAllFlashProducts();
  }
  getAllCategories() {
    this.loading = true;

    this.productService.getAllCategories(1,20).subscribe(
      (data: any) => {
        if (data.status) {
          this.categories = data?.data;
          this.loading = false;
        } else {
          this.notify.danger(data?.message);
        }
      },
      (error) => {
        this.loading = false;
        // this.notify.danger(error);
        console.error('Error fetching categories:', error);
        // Handle the error appropriately, for example, show a user-friendly error message.
      }
    );
  }
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

  viewProduct(route: number) {
    this.route.navigate(['core/operation/product-details/', `${route}`]);
    window.scrollTo(0, 0);
  }
  toCart() {
    this.route.navigate(['core/operation/shopping-cart']);
    window.scrollTo(0, 0);
  }
}