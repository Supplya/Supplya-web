import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { CartService } from 'src/app/core/operation/services/cart/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  cartQuantity: number = 1;
  previousCartQuantity: number = 0;
  constructor(
    private route: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
      const newQuantity = newCart.totalCount;
      console.log(this.cartQuantity, 'newQuantity');
      console.log(newCart, 'newCart');

      this.previousCartQuantity = newQuantity; // Update previous quantity
    });
  }
  isLoggedIn = false;
  userDetails: any = null;
  ngOnInit(): void {
    this.userDetails = this.authService.getUserCredentials();

    // this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
    //   if (loggedIn) {
    //     this.userDetails = this.authService.getUserCredentials();
    //     this.isLoggedIn = true;
    //   } else {
    //     this.isLoggedIn = false;
    //     console.log('User is not logged in');
    //   }
    // });
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
  }

  goToDashboard(role: string) {
    this.route.navigate([`/core/${role}`]);
  }
  goToOrders(role: string) {
    this.route.navigate([`/core/${role}/orders`]);
  }
  goToMyAccount() {
    this.route.navigate([`/core/my-account`]);
  }
  openMenu: boolean = false;
  closeMenu: boolean = false;
  toggleDropdown() {
    this.openMenu = !this.openMenu;
  }
  signUp() {
    this.route.navigate(['auth/sign-up']);
    window.scrollTo(0, 0);
  }
  login() {
    this.route.navigate(['auth/sign-in']);
    window.scrollTo(0, 0);
  }
  cart() {
    this.route.navigate(['core/operation/shopping-cart']);
    window.scrollTo(0, 0);
  }
  faqs() {
    this.route.navigate(['core/operation/shopping-cart']);
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
}
