import { Component, OnInit } from '@angular/core';
import { ToasterPosition, ToastyService } from 'ng-toasty';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { ScrollService } from './shared/services/scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  status!: OnlineStatusType;
  OnlineStatusType = OnlineStatusType;
  constructor(
    private onlineStatusService: OnlineStatusService,
    private scrollService: ScrollService
  ) {
    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      // use status
      this.status = status;
    });
  }

  ngOnInit(): void {}
  title = 'supplya';
  ToasterPosition = ToasterPosition;

  // alert(){
  //   this.notify.success('Method not implemented.');
  // }
}
