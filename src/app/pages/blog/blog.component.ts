import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { DashboardService } from 'src/app/core/administration/services/dashboard.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { HelperService } from 'src/app/shared/helpers/helper.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private authService: AuthService,
    private notify: ToastyService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.getAllPosts();
  }

  posts: any;
  loading = false;
  error = false;
  getAllPosts() {
    this.error = false;
    this.loading = true;
    this.productService.getAllPosts().subscribe(
      (data: any) => {
        this.posts = data?.data;
        this.loading = false;
      },
      (error) => {
        this.error = true;
        this.loading = false;
      }
    );
  }

  viewPost(route: number) {
    this.route.navigate(['/view-blog-post', `${route}`]);
    window.scrollTo(0, 0);
  }
}
