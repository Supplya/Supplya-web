import { Injectable } from '@angular/core';
import { ToastyService } from 'ng-toasty';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  
  private online = window.navigator.onLine;

  private onlineStatus = new BehaviorSubject<boolean>(true);

  getOnlineStatus() {
    return this.onlineStatus.asObservable();
  }

  setOnlineStatus(isOnline: boolean) {
    this.onlineStatus.next(isOnline);
  }



  constructor(private notify: ToastyService) {
    window.addEventListener('online', () => {
      this.online = true;
      this.showOnlineAlert();
    });

    window.addEventListener('offline', () => {
      this.online = false;
      this.showOfflineAlert();
    });
  }

  isOnline(): boolean {
    return this.online;
  }

   showOnlineAlert() {
    this.notify.success('Your Internet connection has been restored');
  
  }

   showOfflineAlert() {
    this.notify.danger('Error! No Internet Connection');
  }
}