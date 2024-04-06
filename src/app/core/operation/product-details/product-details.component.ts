import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product/product.service';
import { CartService } from '../services/cart/cart.service';
import { ToastyService } from 'ng-toasty';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  selectedTab: string = 'description'; // Default selected tab
  product: any;
  cart: any;
  reviews: any;
  products: any;
  AllAddedItems: any;
  loading: boolean = false;
  reviewForm: FormGroup;
  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private route: Router, private cartService: CartService, private fb: FormBuilder, private notify: ToastyService) {

    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.AllAddedItems = cart.items;
      console.log(this.AllAddedItems, "AllAddedItems");

    });

    this.reviewForm = this.fb.group({
      foodId: [''],
      commentedById: [''],
      commentedByName: [''],
      rating: [null],
      comment: ['', Validators.required],
      postedDate: [''],
    })

  }
  onSubmit: boolean = false;
  ngOnInit(): void {
    this.loading = true;

    this.activatedRoute.params.subscribe((params) => {
      const foodID = params['id'];
      if (foodID) {
        this.productService.getProductId(foodID).subscribe(
          (product: any) => {
            if(product){

              this.product = product;
              this.loading = false;
              console.log(this.product, "food");
            }else{

              this.notify.danger('Product not found');
            }
          },
          (error) => {
            // this.notify.danger('Error fetching product', 4000);
            console.error('Error fetching product:', error);
            // Handle the error here, e.g., display an error message to the user
          }
        );


      }
    });

    this.getAllProducts();

  }

  getAllProducts() {
    this.loading = true;

    this.productService.getAllProducts().subscribe(
      (data: any) => {
        this.products = data?.data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.loading = false;
        console.error('Error fetching products:', error);
      
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
