import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from 'src/assets/apConfig';
import { environment } from 'src/assets/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}
  // productUrl: string = "https://supplya.cyclic.app/";
  baseUrl = environment.BASE_URL;

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
  getDashboardCharts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/product`);
  }
  getDashboardStats(year: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/signups?year=${year}`);
  }
  getSales(year: any, month: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/sales?year=${year}&month=${month}`);
  }
  getProductMetric(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/product`);
  }
  getCategoryMetric(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories/data`);
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
  getAdminMetric(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/admin`);
  }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }
  getAllAdmins(page, limit): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}users/role/admin?page=${page}&limit=${limit}`
    );
  }
  getAllCustomers(page, limit): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}users/role/customer?page=${page}&limit=${limit}`
    );
  }
  getAllVendor(page, limit): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}users/role/vendor?page=${page}&limit=${limit}`
    );
  }
  getAllAdmin(page, limit): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}users/role/admin?page=${page}&limit=${limit}`
    );
  }
  getOrdersByID(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/user/${id}`);
  }

  getProductsByUser(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products/user/${id}`);
  }
  assignProductToVendor(payload: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/admin/assign-product`, payload);
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