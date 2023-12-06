import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading = new Subject<boolean>();

  showLoader(): void {
    this.loading.next(true);
    // Add logic to display the loader in your application
  }

  hideLoader(): void {
    this.loading.next(false);
    // Add logic to hide the loader in your application
  }

  isLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }
}
