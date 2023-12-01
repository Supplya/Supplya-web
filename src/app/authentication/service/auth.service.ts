import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { BehaviorSubject, Observable } from 'rxjs';
import { Server } from 'src/assets/apConfig';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  constructor(private http: HttpClient, private server: Server, private router: Router, private notify: ToastyService) {}
  private baseURL =this.server.baseUrl;

  register(user: any): Observable<any> {
    const url = `${this.baseURL}/auth/register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, user, { headers });
  }
  login(user: any): Observable<any> {
    const url = `${this.baseURL}/auth/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, user, { headers });
  }


  private loggedIn = new BehaviorSubject<boolean>(false);
  private userType = new BehaviorSubject<string>('');

  private userTypeToRouteMap: { [key: string]: string } = {
    student: '/core/customer',
    teacher: '/core/seller',
    admin: '/core/admin',
  };



  // setCredentials(user: any) {
  //   if (user && user.userType) {
  //     this.loggedIn.next(true);
  //     this.userType.next(user.userType);
  //     localStorage.setItem('userToken', user.token);
  //     localStorage.setItem('userData', JSON.stringify(user));
  //     const route = this.userTypeToRouteMap[user.userType] || '/auth';

  //     if (this.router.url.includes(user.userType)) {
  //       this.router.navigateByUrl(this.router.url);
  //     } else {
  //       this.router.navigate([route]);
  //     }
  //   }
  // }
  setCredentials(user: any) {
    console.log(`Credentials, user: ${user.token}`);
    if (user) {
      this.loggedIn.next(true);
      // this.userType.next(user.userType);
      localStorage.setItem('userToken', user.token);
      localStorage.setItem('userData', JSON.stringify(user));
      const route = this.userTypeToRouteMap[user.userType] || '/auth';

      if (this.router.url.includes(user.userType)) {
        this.router.navigateByUrl(this.router.url);
      } else {
        this.router.navigate([route]);
      }
    }
  }


  getUserCredentials(): any {
    const userDataString = localStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : null;
  }

  logout() {
    console.log('Logout method called');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    this.notify.success('Logged out Successfully', 4000);
    this.loggedIn.next(false);
    this.userType.next('');
    this.router.navigate(['/auth']);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getUserType() {
    return this.userType.asObservable();
  }

  // Additional methods for auth guard
  isLoggedInValue(): boolean {
    return this.loggedIn.value;
  }

  getUserTypeValue(): string {
    return this.userType.value;
  }

}
