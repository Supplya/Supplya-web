import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss']
})


export class AuthHeaderComponent implements OnInit {
  constructor(private route: Router, private authService: AuthService) {

  }
  isLoggedIn = false;
  userDetails: any;
  ngOnInit(): void {
    // this.authService.isLoggedIn().subscribe((log: any) => {
    //   this.isLoggedIn = log;
    //   this.userDetails = this.authService.getUserCredentials();
    //   console.log(log, 'isLoggedIn');
    // });
  }

  goToDashboard(role: string) {
    this.route.navigate([`/core/${role}`]);
  }
  goToOrders(role: string) {
    this.route.navigate([`/core/${role}/orders`]);
  }
  goToMyAccount(){
    this.route.navigate([`/core/my-account`]);
  }
openMenu: boolean = false;
closeMenu: boolean = false;
toggleDropdown(){
  this.openMenu = !this.openMenu;
}
  signUp() {
    this.route.navigate(['auth/sign-up']);
    window.scrollTo(0, 0);
  }
  contact() {
    this.route.navigate(['contact-us']);
    window.scrollTo(0, 0);
  }
  about() {
    this.route.navigate(['about-us']);
    window.scrollTo(0, 0);
  }
  shop() {
    this.route.navigate(['/core/operation/shop']);
    window.scrollTo(0, 0);
  }

 
}