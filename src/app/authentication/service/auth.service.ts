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
    const url = `${this.baseURL}auth/register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, user, { headers });
  }
  login(user: any): Observable<any> {
    const url = `${this.baseURL}auth/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, user, { headers });
  }

  OTPVerification(user: any): Observable<any> {
    const url = `${this.baseURL}auth/verify-otp`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, user, { headers });
  }
  resendOTP(user: any): Observable<any> {
    const url = `${this.baseURL}auth/resend-otp`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, user, { headers });
  }


  private loggedIn = new BehaviorSubject<boolean>(false);
  private userType = new BehaviorSubject<string>('');

  private userTypeToRouteMap: { [key: string]: string } = {
    customer: '/core/customer',
    vendor: '/core/vendor',
    admin: '/core/admin',
  };


  setCredentials(data: any) {
    if (data && data.user.role) {
      this.loggedIn.next(true);
      this.userType.next(data.user.role);
      localStorage.setItem('sp-userToken', data.token);
      localStorage.setItem('sp-userData', JSON.stringify(data.user));
      const route = this.userTypeToRouteMap[data.user.role] || '/auth';

      if (this.router.url.includes(data.user.role)) {
        this.router.navigateByUrl(this.router.url);
      } else {
        this.router.navigate([route]);
      }
    }
  }

  sendEmailForOTP(data: any) {
    localStorage.setItem('sp-OTPEmail', data);
  }
  
  getEmailForOTP(): any {
    const email = localStorage.getItem('sp-OTPEmail');
    return email;
   }

  getUserCredentials(): any {
    const userDataString = localStorage.getItem('sp-userData');
    if(userDataString != null){
      this.loggedIn.next(true);
    }else{
      this.loggedIn.next(false);

    }
    return userDataString ? JSON.parse(userDataString) : null;
    
  }

  logout() {
    localStorage.removeItem('sp-userType');
    localStorage.removeItem('sp-userData');
    localStorage.removeItem('sp-userToken');
    localStorage.removeItem('sp-OTPEmail');
    this.loggedIn.next(false);
    this.userType.next('');
    this.notify.success('Logged out Successfully', 4000);
    this.router.navigate(['/auth']);
  }
  clearCredentials() {
    localStorage.removeItem('sp-userType');
    localStorage.removeItem('sp-userData');
    localStorage.removeItem('sp-userToken');
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
