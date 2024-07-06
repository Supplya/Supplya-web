import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { CartService } from 'src/app/core/operation/services/cart/cart.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
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
    private cartService: CartService,
    private renderer: Renderer2,
    private productService: ProductService
  ) {
    this.cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
      const newQuantity = newCart.totalCount;
      // console.log(this.cartQuantity, 'newQuantity');
      // console.log(newCart, 'newCart');

      this.previousCartQuantity = newQuantity; // Update previous quantity
    });
  }
  searchTerm: string = '';
  isLoggedIn = false;
  userDetails: any = null;
  ngOnInit(): void {
    this.userDetails = this.authService.getUserCredentials();
    this.renderer.listen('window', 'click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('scroll-link')) {
        e.preventDefault();
        const elementId = target.getAttribute('href')?.substring(1);
        if (elementId) {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
    this.getAllCategories();
  }
  loading;
  categories;
  getAllCategories() {
    this.loading = true;

    this.productService.getAllCategories().subscribe(
      (data: any) => {
        if (data.status) {
          this.categories = data?.data;
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        // this.notify.danger(error);
        console.error('Error fetching categories:', error);
        // Handle the error appropriately, for example, show a user-friendly error message.
      }
    );
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

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.route.navigate(['/core/operation/products/keyword', this.searchTerm.trim()]);
    }
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
