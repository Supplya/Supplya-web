import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from 'src/assets/apConfig';
import { environment } from 'src/assets/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

constructor(private http: HttpClient) { }
baseUrl = environment.BASE_URL
// createOrder(order: any): Observable<any> {
//   const url = `${this.baseUrl}orders/create`;
//   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

//   return this.http.post(url, order, { headers });
// }
createOrder(order: any): Observable<any> {
  const url = `${this.baseUrl}orders/create`;
  
  const token = localStorage.getItem('userToken');

  const headers = new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  return this.http.post(url, order, { headers });
}

}
