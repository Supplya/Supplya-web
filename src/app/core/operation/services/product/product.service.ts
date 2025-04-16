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
  sendNotification(data: any): Observable<any> {
    return this.http.post<any>(`${this.productUrl}notification/create`, data);
  }
  addBlogPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.productUrl}/blog/posts`, post);
  }
  updateBlogPost(id: any, post: any): Observable<any> {
    return this.http.put<any>(`${this.productUrl}/blog/posts/${id}`, post);
  }
  vendorAddProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.productUrl}products/create`, product);
  }

  getProductId(id: any): Observable<any> {
    return this.http.get<any>(`${this.productUrl}products/` + id);
  }
  getPostByID(id: any): Observable<any> {
    return this.http.get<any>(`${this.productUrl}blog/posts/` + id);
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

  getAllProducts(page: number, limit: number, search?): Observable<Product[]> {
    if (search) {
      return this.http.get<Product[]>(
        `${this.productUrl}products?search=${search}&page=${page}&limit=${limit}`
      );
    } else {
      
      return this.http.get<Product[]>(
        `${this.productUrl}products?page=${page}&limit=${limit}`
      );
    }
  
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}/products`
    );
  }
  getAllPosts(page, limit): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}blog/posts?page=${page}&limit=${limit}`
    );
  }
  getStoreProducts(storeName: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}products/store/${storeName}`
    );
  }
  getStoreDetails(storeName: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}/vendors/${storeName}`);
  }

  getAllFlashProducts(page, limit): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}products/flashsale?page=${page}&limit=${limit}`
    );
  }
  getFlashProducts(page?, limit?): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}/products/flashsale`
    );
  }
  getAllTrendingProducts(page, limit): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}products/trending?page=${page}&limit=${limit}`
    );
  }

  getAllVendorProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}products/vendor`);
  }
  getAllVendorOrders(page, limit): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}orders?page=${page}&limit=${limit}`
    );
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
  getAllOrdersAdmin(page: number, limit = 20): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}orders?page=${page}?limit=${limit}`
    );
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
  getAllNewArrivals(page, limit): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}products/newly-arrived-brands?page=${page}&limit=${limit}`
    );
  }
  dealsOfTheDay(page?, limit?): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}/products/deals`
    );
  }
  getSpecialDeals(page?, limit?): Observable<Product[]> {
    return this.http.get<any[]>(
      `${this.productUrl}/products/special-deals`
    );
  }
  getAllCategories(page: number, limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}categories?page=${page}&limit=${limit}`
    );
  }
  getAllMedia(page: number, limit: number, search?: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productUrl}media/banners/all?page=${page}&limit=${limit}`
    );
  }
  // getAllMedia(page?: number, limit?: number): Observable<any[]> {
  //   return this.http.get<Product[]>(
  //     `${this.productUrl}media`
  //   );
  // }
  addCategory(product: any): Observable<any> {
    return this.http.post<any>(`${this.productUrl}categories`, product);
  }
  addMedia(data: any): Observable<any> {
    return this.http.post<any>(`${this.productUrl}media/banners/homepage-banners`, data);
  }

  getCategoryById(id: any): Observable<any> {
    return this.http.get<any>(`${this.productUrl}categories/` + id);
  }
  getMediaById(id: any): Observable<any> {
    return this.http.get<any>(`${this.productUrl}media/` + id);
  }

  updateCategory(id: any, category: any): Observable<any> {
    return this.http.put<any>(`${this.productUrl}categories/${id}`, category);
  }
  updateMedia(id: any, category: any): Observable<any> {
    return this.http.put<any>(`${this.productUrl}media/${id}`, category);
  }
  deleteCategory(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}categories/${id}`);
  }
  deleteMedia(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}media/${id}`);
  }
  UpdateProduct(id: any, product: any): Observable<any> {
    return this.http.patch<any>(`${this.productUrl}products/${id}`, product);
  }
  deleteProduct(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}products/${id}`);
  }
  deletePost(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}/blog/posts/${id}`);
  }
  deleteOrder(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}orders/${id}`);
  }
  deleteUser(id: any): Observable<any> {
    return this.http.delete<any>(`${this.productUrl}users/${id}`);
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
