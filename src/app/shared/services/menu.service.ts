import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { menuItems } from 'src/menuItems';
// import { menuItems } from 'menuItems.json'

@Injectable({
  providedIn: 'root'
})
export class MenuService {

constructor(private http: HttpClient) { }


// getMenuItems(): Observable<any[]> {
//   return this.http.get<any[]>('/src/menuItems.json');
// }
// getMenuItems(): Observable<any[]> {
//   return menuItemJson;
// }
getMenuItems(): Observable<any> {
  return of(menuItems);
}

}
