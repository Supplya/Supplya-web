import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/assets/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}
  // productUrl: string = "https://supplya.cyclic.app/";
  baseUrl = environment.BASE_URL;

  vendorAddProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}products/create`, product);
  }

  getNotifications(page, limit): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}notifications?page=${page}&limit=${limit}`
    );
  }

  readNotification(notificationId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}notifications/mark-read/${notificationId}`, null
      // {
      //   id: notificationId,
      //   read: true,
      // }
    );
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}products`);
  }
}