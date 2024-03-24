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
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  products: any;
  onSubmit: boolean = false;
  loading: boolean = false;
  AllAddedItems: any;
  categories: any;
  cart: any;
  newArrivals: any;
  constructor(private productService: ProductService,  private loaderService: LoaderService, private cartService: CartService, private route: Router, private notify: ToastyService) {
  loaderService.hideLoader();
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.AllAddedItems = cart.items;

    });
  }
  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
    this.getAllNewArrivals();
  }


  getAllNewArrivals() {

    this.productService.getAllNewArrivals().subscribe(
      (data: any) => {
        console.log(data, 'newArrivals');
        this.newArrivals = data?.data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.loading = false;
        this.notify.danger(error);
        console.error('Error fetching products:', error);
      
        // Handle the error appropriately, for example, show a user-friendly error message.
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
  getAllProducts() {
    this.loading = true;

    this.productService.getAllProducts().subscribe(
      (data: any) => {
        console.log(data, 'products');
        this.products = data?.products;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.loading = false;
        this.notify.danger(error);
        console.error('Error fetching products:', error);
      
        // Handle the error appropriately, for example, show a user-friendly error message.
      }
    );
  }
  getAllCategories() {
    this.loading = true;

    this.productService.getAllCategories().subscribe(
      (data: any) => {
        if (data.status === 'success') {

          this.categories = data?.categories;
          this.loading = false;
          console.log(data, 'products');
        } else {
          this.notify.danger(data?.msg);
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
  ifAddedToCart(product: any): boolean {
    // Check if the product is in the list of added items (cart)
    const cartItem = this.AllAddedItems.find((item: any) => item.product._id === product._id);

    // Return true if the product is in the cart, otherwise, return false
    return !!cartItem;
  }
  // getStarsArray(rating: number): string[] {
  //   if (rating <= 0) {
  //     return Array(5).fill('&#9734;'); // Return an array with 5 empty stars
  //   }

  //   const filledStars = Array(rating).fill('&#9733;');
  //   const emptyStars = Array(5 - rating).fill('&#9734;');
  //   return filledStars.concat(emptyStars);
  // }

  // Inside your component class
getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
}

getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
}


  addToCart(product: any) {
    this.onSubmit = true;
    this.cartService.addToCart(product);
    // alert('Added product');
    console.log(product, 'product')
  }
  scrollLeft() {
    const wrapper = document.querySelector('.wrapper-item');
    const scrollAmount = 200; // Adjust as needed

    if (wrapper) {
      wrapper.scrollBy({
        top: 0,
        left: -scrollAmount,
        behavior: 'smooth'
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
        behavior: 'smooth'
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