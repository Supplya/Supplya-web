import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/service/auth.service';
import Swal from 'sweetalert2';
import { NotificationService } from '../../administration/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userDetails: any;
  todayDate: Date = new Date();
  formattedDate: string | null;

  constructor(
    private datePipe: DatePipe,
    private authService: AuthService,
    private route: Router,  private notificationService: NotificationService,
  ) {
    this.formattedDate = this.formatDate(this.todayDate);
  }
  ngOnInit(): void {
    this.userDetails = this.authService.getUserCredentials();
    // console.log(this.userDetails, 'userDetails');
    this.getNotifications();
  }
  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
  }
  formatDate(date: Date): string | null {
    const dayName = this.datePipe.transform(date, 'EEEE');
    const day = this.datePipe.transform(date, 'd');
    const month = this.datePipe.transform(date, 'MMMM');

    let suffix = 'th';
    if (day) {
      if (day.endsWith('1') && !day.endsWith('11')) {
        suffix = 'st';
      } else if (day.endsWith('2') && !day.endsWith('12')) {
        suffix = 'nd';
      } else if (day.endsWith('3') && !day.endsWith('13')) {
        suffix = 'rd';
      }
    }

    return `${dayName}, ${day}${suffix} ${month}`;
  }

  logout() {
    Swal.fire({
      title: 'Log out',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }
  searchTerm: string = '';

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.route.navigate([
        '/core/operation/products/keyword',
        this.searchTerm.trim(),
      ]);
    }
  }
notificationCount

  getNotifications = () => {
    
    this.notificationService.getNotifications(1, 100).subscribe(
      (res) => {

        this.notificationCount = res?.totalCount;

      },
      (err) => {

      }
    );
  };
}
