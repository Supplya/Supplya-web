import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/authentication/service/auth.service';
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
    private route: Router, private authService: AuthService,
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
  userDetails
  ngOnInit(): void {
    this.userDetails = this.authService.getUserCredentials();
    this.getAllProducts();
    this.getAllCategories();
    this.getAllNewArrivals();
    this.getAllFlashProducts();
    this.getSpecialDeals();
    this.getAllTrendingProducts();
    this.getAllMedia();
  }

  errorFetchingMedia
  banners
  getAllMedia() {
    this.loading = true;
    this.productService.getAllMedia(1, 50).subscribe(
      (data: any) => {
        this.banners = data?.data;
        this.loading = false;
      },
      (error) => {
        this.errorFetchingMedia = true;
        this.loading = false;
      }
    );
  }
  getBanner(section: string) {
    return this.banners?.find(banner => banner?.section?.toLowerCase() === section?.toLowerCase());
  }


  newArrivalLoading = false;
  newArrivalError = false;
  getAllNewArrivals() {
    this.newArrivalLoading = true;
    this.productService.dealsOfTheDay().subscribe(
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
  specialLoading = false;
  specialError = false;
  specialDeals
  specialDealsSecondRow
  getSpecialDeals() {
    this.specialLoading = true;
    this.specialError = false;
    this.productService.getSpecialDeals().subscribe(
      (data: any) => {
        this.specialDeals = data?.data;
        this.specialDealsSecondRow = [...data?.data]?.reverse()
        this.specialLoading = false;
      },
      (error) => {
        this.specialLoading = false;
        this.specialError = true;
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
    this.productsError = false;

    this.productService.getAllProducts(1, 20).subscribe(
      (data: any) => {
        this.products = data?.data;
        this.lastToFirstProducts = [...data?.data]?.reverse();
        
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.productsError = true;
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

    this.productService.getFlashProducts(1, 100).subscribe(
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
    this.productService.getAllTrendingProducts(1, 100).subscribe(
      (data: any) => {
        this.trendingProducts = data?.data;
        this.secondHalfTrendingProducts = [...data?.data].reverse();
        this.trendingProductLoading = false;
      },
      (error) => {
        this.trendingProductLoading = false;
        this.trendingProductError = true;
      }
    );
  }

  firstHalfTrendingProducts
  secondHalfTrendingProducts
  // getAllTrendingProducts() {
  //   this.flashProductLoading = true;
  //   this.trendingProductError = false;

  //   this.productService.getAllTrendingProducts(1, 30).subscribe(
  //     (data: any) => {
  //       const allProducts = data?.data || [];
  //       this.trendingProductLoading = false;
  //       const midIndex = Math.ceil(allProducts.length / 2); // Find the middle index

  //       this.firstHalfTrendingProducts = allProducts.slice(0, midIndex);
  //       this.secondHalfTrendingProducts = allProducts.slice(midIndex);

  //       console.log(this.secondHalfTrendingProducts)
  //       console.log(this.firstHalfTrendingProducts)

  //       this.trendingProductLoading = false;
  //     },
  //     (error) => {
  //       this.trendingProductLoading = false;
  //       this.trendingProductError = true;
  //     }
  //   );
  // }

  refreshFlashProducts() {
    this.flashProductError = false;
    this.getAllFlashProducts();
  }
  getAllCategories() {
    this.loading = true;

    this.productService.getAllCategories(1,20).subscribe(
      (data: any) => {
        if (data.status) {
          this.categories = data?.data?.filter((x: any) => x.homepageDisplay === true) || [];
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

  viewProduct(route: any) {
    this.route.navigate(['core/operation/product-details/', `${route}`]);
    window.scrollTo(0, 0);
  }
  toCart() {
    this.route.navigate(['core/operation/shopping-cart']);
    window.scrollTo(0, 0);
  }
}