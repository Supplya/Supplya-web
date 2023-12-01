import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product/product.service';
import { CartService } from '../services/cart/cart.service';


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
  AllAddedItems: any;
  loading: boolean = false;
  reviewForm: FormGroup;
  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private route: Router, private cartService: CartService, private fb: FormBuilder) {

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
            this.product = product;
            this.loading = false;
            console.log(this.product, "food");
          },
          (error) => {
            console.error('Error fetching product:', error);
            // Handle the error here, e.g., display an error message to the user
          }
        );


      }
    });

  }


  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.route.navigateByUrl('/core/operation/shopping-cart');
  }
  getStarsArray(rating: number): string[] {
    if (rating <= 0) {
      return Array(5).fill('&#9734;'); // Return an array with 5 empty stars
    }

    const filledStars = Array(rating).fill('&#9733;');
    const emptyStars = Array(5 - rating).fill('&#9734;');
    return filledStars.concat(emptyStars);
  }
}
