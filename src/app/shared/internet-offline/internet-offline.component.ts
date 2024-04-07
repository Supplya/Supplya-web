import { Component } from '@angular/core';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { take, timer } from 'rxjs';
import { NetworkStatusService } from '../services/network-status.service';

@Component({
  selector: 'app-internet-offline',
  templateUrl: './internet-offline.component.html',
  styleUrls: ['./internet-offline.component.scss']
})
export class InternetOfflineComponent {
  // status: boolean = false
  // constructor(private onlineStatusService: NetworkStatusService) {
  //   this.onlineStatusService.getOnlineStatus().subscribe((status: boolean) => {
  //     this.status = status;
  //     console.log(status);
     
  //   });
  // }
  showSuccessMessage = false;
  status!: OnlineStatusType;
  OnlineStatusType = OnlineStatusType;
constructor(private onlineStatusService: OnlineStatusService){
  this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
    // use status
    this.status = status;

    if (status === 1) {
      this.showSuccessMessage = true;
      timer(2000) // 2000 milliseconds = 2 seconds
        .pipe(take(1))
        .subscribe(() => {
          this.showSuccessMessage = false;
        });
    }
  });
}
}
