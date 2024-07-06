import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Server } from 'src/assets/apConfig';
import { Product } from 'src/app/models/operation/product';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private server: Server) { }
  // productUrl: string = "https://supplya.cyclic.app/";
  productUrl = this.server.baseUrl;

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.productsSubject.asObservable();

  products!: Product;

  addNewProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.productUrl}products/create`, product);
  }
  vendorAddProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.productUrl}products/create`, product);
  }

  getProductId(id: any): Observable<any> {
    return this.http.get<any>(`${this.productUrl}products/` + id);
  }
  searchProduct(keyword: any): Observable<any> {
    return this.http.get<any>(
      `${this.productUrl}/products/search?keyword=${keyword}`
    );
  }
  getRelatedProducts(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.productUrl}products/${id}/get-related`
    );
  }
  getProductByCategory(name: any): Observable<any> {
    return this.http.get<any>(`${this.productUrl}products/category/${name}`);
  }


  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}products`);
  }
  getAllFlashProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}products/flashsale`);
  }

  getAllVendorProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}products/vendor`);
  }
  getAllVendorOrders(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}orders`);
  }
  getAllOrders(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}orders`);
  }
  getVendorOrders(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}orders/vendor`);
  }
  getVendorOrderStats(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}users/orders
`);
  }
  getVendorMetric(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}users/orders`);
  }
  getAllNewArrivals(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}products/newly-arrived-brands`);
  }
  getAllCategories(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}categories`);
  }

  UpdateProduct(id: any, product: any): Observable<any> {
    return this.http.patch<any>(`${this.productUrl}products/${id}`, product);
  }
  deleteProduct(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}products/${id}`);
  }
  deleteOrder(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}users/${id}`);
  }

  // getAllFoodsBySearch(searchTerm: string): Observable<Product[]> {
  // return this.getAllProducts().pipe(
  //   map(products => products.filter(x => x.category.toLowerCase().includes(searchTerm.toLowerCase())))
  // );
  // }

}
