import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { BehaviorSubject, Observable } from 'rxjs';
import { Server } from 'src/assets/apConfig';
import { environment } from 'src/assets/environment/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private notify: ToastyService,
  ) {
  }
  private baseURL = environment.BASE_URL;

  register(user: any): Observable<any> {
    const url = `${this.baseURL}auth/sign-up`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, user, { headers });
  }
  login(user: any): Observable<any> {
    const url = `${this.baseURL}auth/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, user, { headers });
  }
  forgetPassword(user: any): Observable<any> {
    const url = `${this.baseURL}auth/forgot-password`;
    return this.http.post(url, user);
  }
  resetPassword(user: any): Observable<any> {
    const url = `${this.baseURL}auth/reset-password`;
    return this.http.post(url, user);
  }
  changeAuthPassword(user: any): Observable<any> {
    const url = `${this.baseURL}auth/change-password`;
    return this.http.post(url, user);
  }

  
  updateUserById(userId: string, userData: any): Observable<any> {
    const url = `${this.baseURL}users/${userId}`;
    return this.http.patch<any>(url, userData);
  }
  getUserById(userId: string): Observable<any> {
    const url = `${this.baseURL}users/${userId}`;
    return this.http.get<any>(url);
  }
  changePassword(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}auth/change-password`, payload);
  }
  validateShop(storeName: string): Observable<any> {
    const url = `${this.baseURL}vendors/validate-store-name?storeName=${storeName}`;
    return this.http.get<any>(url);
  }

  OTPVerification(user: any): Observable<any> {
    const url = `${this.baseURL}auth/sign-up-complete`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, user, { headers });
  }
  verifyOTP(user: any): Observable<any> {
    const url = `${this.baseURL}auth/verify-otp`;
    return this.http.post(url, user);
  }
  resendOTP(user: any): Observable<any> {
    const url = `${this.baseURL}auth/verify-otp`;
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
    if (data && data.data.role) {
      this.loggedIn.next(true);
      this.userType.next(data.data.role);
      localStorage.setItem('spa-userToken', data.token);
      localStorage.setItem('spa-userData', JSON.stringify(data.data));
      const route = this.userTypeToRouteMap[data.data.role] || '/auth';

      if (this.router.url.includes(data.data.role)) {
        this.router.navigateByUrl(this.router.url);
      } else {
        this.router.navigate([route]);
      }
    }
  }

  sendEmailForOTP(data: any) {
    localStorage.setItem('spa-OTPEmail', data);
  }

  getEmailForOTP(): any {
    const email = localStorage.getItem('spa-OTPEmail');
    return email;
  }

  getUserCredentials(): any {
    const userDataString = localStorage.getItem('spa-userData');
    if (userDataString != null) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }
    return userDataString ? JSON.parse(userDataString) : null;
  }

  logout() {
    localStorage.removeItem('spa-userType');
    localStorage.removeItem('spa-userData');
    localStorage.removeItem('spa-userToken');
    localStorage.removeItem('spa-OTPEmail');
    this.loggedIn.next(false);
    this.userType.next('');
    this.notify.success('Logged out Successfully', 4000);
    this.router.navigate(['/auth']);
  }
  clearCredentials() {
    localStorage.removeItem('spa-userType');
    localStorage.removeItem('spa-userData');
    localStorage.removeItem('spa-userToken');
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
