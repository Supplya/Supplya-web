import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../operation/services/product/product.service';
import { ToastyService } from 'ng-toasty';

@Component({
  selector: 'app-vendor-add-new-product',
  templateUrl: './vendor-add-new-product.component.html',
  styleUrls: ['./vendor-add-new-product.component.scss'],
})
export class VendorAddNewProductComponent implements OnInit {
  categories: any;
  constructor(public productService: ProductService, private notify: ToastyService) {}
  ngOnInit(): void {
    this.getAllCategories();
  }
  getAllCategories() {
    this.productService.getAllCategories().subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.categories = data['data'];
        } else {
          this.notify.danger(data?.msg);
        }
      },
      (error) => {
        this.notify.danger(error.error?.msg);
      }
    );
  }
}
