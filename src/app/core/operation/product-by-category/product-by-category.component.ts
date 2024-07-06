import { Component } from '@angular/core';
import { Cart } from 'src/app/models/operation/cart';
import { CartService } from '../services/cart/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/models/operation/cartItem';
import { ProductService } from '../services/product/product.service';

@Component({
  selector: 'app-product-by-category',
  templateUrl: './product-by-category.component.html',
  styleUrls: ['./product-by-category.component.scss'],
})
export class ProductByCategoryComponent {
  quantity: number = 1;
  cart!: Cart;
  cartItems: CartItem[] = [];
  loading: boolean = false;
  unitPriceMin: number = 0;
  unitPriceMax: number = 10000;
  minOrderMin: number = 1;
  minOrderMax: number = 100;
  unitPrice: number;
  minOrder: number;

  products: any; // replace with your actual product type
  constructor(
    private cartService: CartService,
    private route: Router,
    private router: ActivatedRoute,
    private productService: ProductService
  ) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.AllAddedItems = cart.items;
    });
  }

  productsError;
  category: string | null = null;
  keyword: string | null = null;
  ngOnInit(): void {
    this.router.paramMap.subscribe((params) => {
      this.category = params.get('category');
      this.keyword = params.get('keyword');

      if (this.category) {
        this.getAllProducts();
      } else if (this.keyword) {
        this.searchProducts();
      }
    });
    this.unitPriceMin = this.getMinUnitPrice();
    this.unitPriceMax = this.getMaxUnitPrice();
    this.minOrderMin = this.getMinOrder();
    this.minOrderMax = this.getMaxOrder();
  }
  refreshProducts() {
    this.getAllProducts();
    this.productsError = false;
  }
  getAllProducts() {
    this.loading = true;

    // this.productService.getAllProducts().subscribe(
    this.productService.getProductByCategory(this.category).subscribe(
      (data: any) => {
        this.products = data?.data;

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.productsError = false;
      }
    );
  }
  searchProducts() {
    this.loading = true;

    // this.productService.getAllProducts().subscribe(
    this.productService.searchProduct(this.keyword).subscribe(
      (data: any) => {
        this.products = data?.data;
        console.log(this.products, 'getCartObservable');

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.productsError = false;
      }
    );
  }

  AllAddedItems;
  toggleWishlist(product: any) {
    product.isWishlisted = !product.isWishlisted;
  }
  ifAddedToCart(product: any): boolean {
    const cartItem = this.AllAddedItems?.find(
      (item: any) => item.product._id === product._id
    );
    return !!cartItem;
  }

  getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating))?.fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating))?.fill(0);
  }
  onSubmit;
  addToCart(product: any) {
    this.onSubmit = true;
    this.cartService.addToCart(product);
  }

  viewProduct(route: number) {
    this.route.navigate(['core/operation/product-details/', `${route}`]);
    window.scrollTo(0, 0);
  }
  toCart() {
    this.route.navigate(['core/operation/shopping-cart']);
    window.scrollTo(0, 0);
  }

  getMinUnitPrice(): number {
    return Math.min(...this.products?.map((product) => product?.unit_price));
  }

  getMaxUnitPrice(): number {
    return Math.max(...this.products?.map((product) => product?.unit_price));
  }

  getMinOrder(): number {
    return Math.min(...this.products?.map((product) => product?.quantity));
  }

  getMaxOrder(): number {
    return Math.max(...this.products?.map((product) => product?.quantity));
  }

  updateUnitPriceInput(): void {
    this.unitPriceMax = Number(
      (<HTMLInputElement>document.getElementById('unitPriceRange')).value
    );
  }

  updateUnitPriceRange(): void {
    const unitPriceMaxInput = Number(
      (<HTMLInputElement>document.getElementById('unitPriceMax')).value
    );
    if (
      unitPriceMaxInput >= this.unitPriceMin &&
      unitPriceMaxInput <= this.unitPriceMax
    ) {
      this.unitPriceMax = unitPriceMaxInput;
    }
  }

  updateMinOrderInput(): void {
    this.minOrderMax = Number(
      (<HTMLInputElement>document.getElementById('minOrderRange')).value
    );
  }

  updateMinOrderRange(): void {
    const minOrderMaxInput = Number(
      (<HTMLInputElement>document.getElementById('minOrderMax')).value
    );
    if (
      minOrderMaxInput >= this.minOrderMin &&
      minOrderMaxInput <= this.minOrderMax
    ) {
      this.minOrderMax = minOrderMaxInput;
    }
  }

  applyFilters(): void {
    const filters = {
      unitPriceMin: this.unitPriceMin,
      unitPriceMax: this.unitPriceMax,
      minOrderMin: this.minOrderMin,
      minOrderMax: this.minOrderMax,
    };

    console.log('Filters applied:', filters);

    // Example of sending data to the server (uncomment and replace with actual HTTP request)
    // this.http.post('your-api-endpoint', filters).subscribe(response => {
    //   console.log('Server response:', response);
    // });
  }
}
