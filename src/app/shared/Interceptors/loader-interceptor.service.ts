import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show loader for all HTTP methods except GET
    if (request.method !== 'GET') {
      this.loaderService.showLoader();
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          // If the event is a response, hide the loader
          if (event instanceof HttpResponse) {
            // Hide the loader for all HTTP methods except GET
            if (request.method !== 'GET') {
              this.loaderService.hideLoader();
            }
          }
        },
        (error) => {
          // Hide loader when an error occurs
          // Hide the loader for all HTTP methods except GET
          if (request.method !== 'GET') {
            this.loaderService.hideLoader();
          }
          // Handle error if needed
          console.error('Error:', error);
        }
      )
    );
  }
}
