import { Component, OnInit } from '@angular/core';
import { ToasterPosition, ToastyService } from 'ng-toasty';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { ScrollService } from './shared/services/scroll.service';
import { Router } from '@angular/router';

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
    private scrollService: ScrollService, private router: Router
  ) {
    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      // use status
      this.status = status;
    });
  }

  ngOnInit(): void {
    if (window.location.hash.includes('#/')) {
      // Get the path without #
      const newUrl = window.location.href.replace('/#', '');

      // Replace URL in browser history without refreshing the page
      window.history.replaceState({}, document.title, newUrl);

      // Extract the path and navigate within Angular
      const path = newUrl.replace(window.location.origin, '');
      this.router.navigateByUrl(path, { replaceUrl: true });
    }
  }
  title = 'supplya';
  ToasterPosition = ToasterPosition;

  // alert(){
  //   this.notify.success('Method not implemented.');
  // }
}

