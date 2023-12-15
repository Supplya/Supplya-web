import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  implements OnInit {
userDetails: any;
  constructor(private datePipe: DatePipe, private authService: AuthService){
    
  }
  ngOnInit(): void {
this.userDetails = this.authService.getUserCredentials();
// console.log(this.userDetails, 'userDetails');
  }
  todayDate: Date = new Date();
  formattedDate = this.datePipe.transform(this.todayDate, 'd MMMM y | h:mm a');


  logout(){
    Swal.fire({
      title: "Log out",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInDown
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    }).then((result) => {
      if (result.isConfirmed) {
       this.authService.logout();
      }
    });

  }
}
