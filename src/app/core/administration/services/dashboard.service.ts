import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from 'src/assets/apConfig';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private server: Server) {}
  // productUrl: string = "https://supplya.cyclic.app/";
  baseUrl = this.server.baseUrl;

  vendorAddProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}products/create`, product);
  }

  getProductId(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}products/` + id);
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}products`);
  }

  getProductStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}users/orders
`);
  }
  getDashboardMetric(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard`);
  }
  getProductMetric(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/product`);
  }
  getOrderMetric(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/order`);
  }
  getCustomerMetric(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/customer`);
  }
  getVendorMetric(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/vendor`);
  }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }
  getOrdersByID(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/user/${id}`);
  }

  getProductsByUser(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products/user/${id}`);
  }
  getUserByID(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/${id}`);
  }

  UpdateProduct(id: any, product: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}products/${id}`, product);
  }
  deleteProduct(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}products/${id}`);
  }

  // getAllFoodsBySearch(searchTerm: string): Observable<Product[]> {
  // return this.getAllProducts().pipe(
  //   map(products => products.filter(x => x.category.toLowerCase().includes(searchTerm.toLowerCase())))
  // );
  // }
}