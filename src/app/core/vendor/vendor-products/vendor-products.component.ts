import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../operation/services/product/product.service';

@Component({
  selector: 'app-vendor-products',
  templateUrl: './vendor-products.component.html',
  styleUrls: ['./vendor-products.component.scss']
})
export class VendorProductsComponent implements OnInit {
  itemPerPage: number = 5;
  p: number = 1;

  constructor(private productService: ProductService) {
    
  }
  ngOnInit(): void {
    this.getAllProducts();
  }
  errorFetchingProduct: boolean = false;
  productLoading: boolean = false;

  products: any;
  getAllProducts() {
    this.productLoading = true;
    this.productService.getAllProducts().subscribe(
      (data: any) => {
        this.products = data?.data;
        this.productLoading = false;
      },
      (error) => {
        this.errorFetchingProduct = true;
        this.productLoading = false;
        console.error('Error fetching products:', error);
      
      }
    );
  }

  refreshProducts() {
    this.errorFetchingProduct = false;
    this.getAllProducts();
  }
  get productsToShow(): any[] {
    const startIndex = (this.p - 1) * this.itemPerPage;
    const endIndex = Math.min(startIndex + this.itemPerPage, this.products?.length);
    return this.products?.slice(startIndex, endIndex);
  }

  // Method to calculate the start record number shown on the current page
  calculateStartRecord(): number {
    return (this.p - 1) * this.itemPerPage + 1;
  }

  // Method to calculate the end record number shown on the current page
  calculateEndRecord(): number {
    return Math.min(this.p * this.itemPerPage, this.products?.length);
  }
}
