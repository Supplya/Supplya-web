import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})

export class NotificationComponent implements OnInit {
  constructor(

    // private eventService: EventService,
   
  ) {}
  id;
  loadingNotifications;
  ngOnInit(): void {
    this.getNotifications();
  }
  p: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  notifications;
  notificationsLoading: boolean;
  errorFetching: boolean;

  getNotifications = (page = this.p, pageSize = this.pageSize) => {
    // this.notificationsLoading = true;
    // this.eventService.getNotifications(page, pageSize).subscribe(
    //   (res) => {
    //     this.notifications = res['eventsByUser'];
    //     this.totalCount = res['totalEvents'];
    //     this.notificationsLoading = false;
    //   },
    //   (err) => {
    //     this.notificationsLoading = false;
    //     this.errorFetching = true;
        
    //   }
    // );
  };

  onPageChange(page: number): void {
    this.p = page;
    this.getNotifications(this.p, this.pageSize);
  }
  selectedIndex: number | null = null;
  toggleDetails(index: number) {
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
    } else {
      const event = this.notifications[index];
      if (!event.read) {
        this.markAsReadNotification(event._id);
      }
      this.selectedIndex = index; // Expand the detail view
    }
  }

  markAsReadNotification(id: string) {
    // this.eventService.readNotification(id).subscribe(
    //   (response) => {
    //     const notification = this.notifications.find(
    //       (notification) => notification._id === id
    //     );
    //     if (notification) {
    //       notification.read = true;
    //     }
    //   },
    //   (error) => {
    //     console.error('Error marking notification as read:', error);
    //   }
    // );
  }


  formatTimestamp(timestamp: Date | string | number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `Yesterday`;
    } else {
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const hours = date.getHours() % 12 || 12;
      const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
      return `${day}${this.getOrdinalSuffix(
        day
      )} ${month}, ${year} - ${hours}${ampm}`;
    }
  }

  private getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}