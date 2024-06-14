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
import Swal from 'sweetalert2';


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
       Swal.fire({
         html: `<span style="color: #000; font-weight: 600; font-size: 19px;">You're offline. No internet connection</span>`,
         text: '',
         icon: 'error',
         showCancelButton: false,
         allowOutsideClick: false,
         confirmButtonText: 'OK',
         showClass: {
           popup: `
                    animate__animated
                    animate__fadeInDown
                    animate__faster
                  `,
         },
         hideClass: {
           popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                  `,
         },
       });
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
            errorMessage =
              'Oops! Something went wrong. Please check your internet connection or try again later.';
           
            Swal.fire({
              html: `<span style="color: #000; font-weight: 600; font-size: 19px;">${errorMessage}</span>`,
              icon: 'error',
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonText: 'OK',
              showClass: {
                popup: `
                  animate__animated
                  animate__fadeInDown
                  animate__faster
                `,
              },
              hideClass: {
                popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `,
              },
            });
            // this.notify.danger(errorMessage);
          } else {
            errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
            if (error?.error?.message) {
              Swal.fire({
                html: `<span style="color: #000; font-weight: 600; font-size: 19px;">${error.error.message}</span>`,
                text: '',
                icon: 'error',
                showCancelButton: false,
                allowOutsideClick: false,
                confirmButtonText: 'OK',
                showClass: {
                  popup: `
                    animate__animated
                    animate__fadeInDown
                    animate__faster
                  `,
                },
                hideClass: {
                  popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                  `,
                },
              });
            }
           
            // this.notify.danger('Something went wrong. Please try again..');
         
          }
        }
        return throwError(error);
      })
    );
  }
}
