import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Server } from 'src/assets/apConfig';
import { Product } from 'src/app/models/operation/product';
import { environment } from 'src/assets/environment/environment';



@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  // productUrl: string = "https://supplya.cyclic.app/";
  productUrl = environment.BASE_URL;

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
    return this.http.get<any>(`${this.productUrl}products/${id}/get-related`);
  }
  getProductByCategory(name: any): Observable<any> {
    return this.http.get<any>(`${this.productUrl}products/category/${name}`);
  }

  getAllProducts(page, limit): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}/products?limit=${limit}`
    );
  }
  getStoreProducts(storeName: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}/products/store/${storeName}`
    );
  }
  getStoreDetails(storeName: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}/vendors/${storeName}`
    );
  }

  getAllFlashProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}products/flashsale`);
  }
  getAllTrendingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}products/trending`);
  }

  getAllVendorProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}products/vendor`);
  }
  getAllVendorOrders(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}orders`);
  }
  getAllOrderByUser(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.productUrl}orders/user/${id}`);
  }
  getUserOrders(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}users/orders`);
  }
  getAllOrders(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}orders`);
  }
  getAllOrdersAdmin(page: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}orders?page=${page}`);
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
    return this.http.get<Product[]>(
      `${this.productUrl}products/newly-arrived-brands`
    );
  }
  getAllCategories(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}categories`);
  }
  addCategory(product: any): Observable<any> {
    return this.http.post<any>(`${this.productUrl}categories`, product);
  }

  getCategoryById(id: any): Observable<any> {
    return this.http.get<any>(`${this.productUrl}categories/` + id);
  }

  updateCategory(id: any, category: any): Observable<any> {
    return this.http.put<any>(`${this.productUrl}categories/${id}`, category);
  }
  deleteCategory(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}categories/${id}`);
  }
  UpdateProduct(id: any, product: any): Observable<any> {
    return this.http.patch<any>(`${this.productUrl}products/${id}`, product);
  }
  deleteProduct(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}products/${id}`);
  }
  deleteOrder(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}orders/${id}`);
  }
  UpdateOrder(data: any, id: any): Observable<any> {
    return this.http.put<any>(`${this.productUrl}orders/${id}`, data);
  }

  // getAllFoodsBySearch(searchTerm: string): Observable<Product[]> {
  // return this.getAllProducts().pipe(
  //   map(products => products.filter(x => x.category.toLowerCase().includes(searchTerm.toLowerCase())))
  // );
  // }
}
