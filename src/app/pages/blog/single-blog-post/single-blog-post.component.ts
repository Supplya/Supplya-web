import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { CartService } from 'src/app/core/operation/services/cart/cart.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';

@Component({
  selector: 'app-single-blog-post',
  templateUrl: './single-blog-post.component.html',
  styleUrls: ['./single-blog-post.component.scss'],
})
export class SingleBlogPostComponent {
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
  ) {}
  onSubmit: boolean = false;
  error: boolean = false;
  ngOnInit(): void {
    this.loading = true;
    this.getPost();
    this.getRecentPosts();
  }
  id;
  post;
  getPost() {
    this.error = false;
    this.loading = true;
    this.activatedRoute.params.subscribe((params) => {
      const foodID = params['id'];
      this.id = params['id'];
      if (foodID) {
        this.productService.getPostByID(foodID).subscribe(
          (data: any) => {
            this.loading = false;
            if (data.status === true) {
              this.post = data['data'];
              // console.log(this.post)
              this.loading = false;
              this.error = false;
            }
          },
          (error) => {
            this.loading = false;
            this.error = true;
          }
        );
      }
    });
  }

  recentPosts;
  allLoading = false;
  allError = false;
  getRecentPosts() {
    this.allError = false;
    this.allLoading = true;
    this.productService.getAllPosts().subscribe(
      (data: any) => {
        this.recentPosts = data?.data?.slice(0, 7);
        this.allLoading = false;
      },
      (error) => {
        this.allError = true;
        this.allLoading = false;
      }
    );
  }

  viewPost(route: number) {
    this.route.navigate(['/view-blog-post', `${route}`]);
    window.scrollTo(0, 0);
  }
}