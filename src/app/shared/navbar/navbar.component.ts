import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private route: Router){

  }

  signUp(){
    this.route.navigate(['auth/sign-up']);
    window.scrollTo(0, 0);
  }
  contact(){
    this.route.navigate(['contact-us']);
    window.scrollTo(0, 0);
  }
  about(){
    this.route.navigate(['about-us']);
    window.scrollTo(0, 0);
  }
  shop(){
    this.route.navigate(['/core/operation/shop']);
    window.scrollTo(0, 0);
  }

}
