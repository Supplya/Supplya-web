// error-handling.interceptor.ts
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
import { NetworkStatusService } from '../services/network-status.service';
import { ToastyService } from 'ng-toasty';


@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(private networkStatusService: NetworkStatusService, private notify: ToastyService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check for internet connectivity
    if (!navigator.onLine) {
      this.networkStatusService.setOnlineStatus(false);
      return throwError("You're offline. No internet connection");
    }

    // Proceed with the HTTP request and handle errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 0) {
            errorMessage = 'Could not connect to the Server. Please check your internet connection or try again later.';
            console.log(errorMessage);
            this.notify.danger(errorMessage);
          } else {
            errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
            console.log(errorMessage);
            this.notify.danger('Something went wrong. Please try again..');
         
          }
        }
        return throwError(error);
      })
    );
  }
}
