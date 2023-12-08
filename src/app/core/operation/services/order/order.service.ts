import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from 'src/assets/apConfig';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

constructor(private http: HttpClient, private server: Server) { }
baseUrl = this.server.baseUrl;

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
