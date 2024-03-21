
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from "rxjs"
import { map, catchError } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AuthService } from "src/app/authentication/service/auth.service";
import { ToastyService } from "ng-toasty";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router, private authService: AuthService, private toastr: ToastyService ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('sp-userToken');

        if (token) {
            req = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }

        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401 && this.router.url !== '/auth/sign-in') {
                    this.authService.logout()
                    this.router.navigate(['/auth/sign-in']);
                    this.toastr.info('Your session has expired and you have been logged out' );
                }
                return throwError(err);
            })
        );
    }
}
