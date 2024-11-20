import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { NotificationService } from '../../administration/services/notification.service';

@Component({
  selector: 'app-customer-notifications',
  templateUrl: './customer-notifications.component.html',
  styleUrls: ['./customer-notifications.component.scss']
})

export class CustomerNotificationsComponent implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}
  id;
  userInfo;
  ngOnInit(): void {
    this.userInfo = this.authService.getUserCredentials();
    this.getNotifications();
  }
  p: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  notifications;
  loading: boolean;
  errorFetching: boolean;

  getNotifications = () => {
    this.loading = true;
    this.notificationService.getNotifications(this.p, this.pageSize).subscribe(
      (res) => {
        this.notifications = res['data'];
        this.totalCount = res?.totalCount;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.errorFetching = true;
      }
    );
  };

  onPageChange(page: number): void {
    this.p = page;
    this.getNotifications();
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

  markAsReadNotification(id: string, userId = this.userInfo?._id) {
    this.notificationService.readNotification(id).subscribe(
      (response) => {
        const notification = this.notifications.find(
          (notification) => notification._id === id
        );
        if (notification) {
          notification.read = true;
        }
      },
      (error) => {
        console.error('Error marking notification as read:', error);
      }
    );
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