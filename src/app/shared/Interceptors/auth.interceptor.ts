import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { ToastyService } from 'ng-toasty';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastyService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('spa-userToken');
    const cloudinaryUrl = 'https://api.cloudinary.com';

    // Check if the request URL starts with the Cloudinary URL
    if (token && !req.url.startsWith(cloudinaryUrl)) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next
        .handle(cloned)
        .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
    } else {
      return next
        .handle(req)
        .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    if (err.status === 401) {
      if (this.router.url !== '/auth/sign-in') {
        // this.authService.logout();
        this.router.navigate(['/auth/sign-in']);
        this.toastr.info(
          'Your session has expired and you have been logged out'
        );
      }
    }
    return throwError(err);
  }
}
