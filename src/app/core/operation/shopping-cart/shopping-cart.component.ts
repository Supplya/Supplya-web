import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { Cart } from 'src/app/models/operation/cart';
import { CartItem } from 'src/app/models/operation/cartItem';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { OrderService } from '../services/order/order.service';
import { ToastyService } from 'ng-toasty';
import { environment } from 'src/assets/environment/environment';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

declare var PaystackPop: any;


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  quantity: number = 1;
  cart!: Cart;
  cartItems: CartItem[] = [];
  loading: boolean = false;
  constructor(
    private cartService: CartService,
    private notify: ToastyService,
    private route: Router,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  userInfo;
  selectedPaymentMethod: string = '';
  ngOnInit(): void {
    this.userInfo = this.authService.getUserCredentials();

    // this.toggleModal('updateProfileModal', 'open');
    // this.credentialsSubscription = this.authService
    //   .getUserCredentialsObservable()
    //   .subscribe((credentials) => {
    //     this.userInfo = credentials;
    //     console.log(this.userInfo);
    //   });
    this.loading = true;
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.cartItems = cart.items;
      this.loading = false;
    });
    this.loadCart();
  }
  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
  }
  loadCart(): void {
    this.cart = this.cartService.getCart();
    this.initializeQuantity();
  }

  initializeQuantity(): void {
    this.cart.items.forEach((item: any) => {
      item.quantity = item?.quantity || 1;
    });
  }
  goToStore(storeName: string): void {
    this.route.navigate([`/store/${storeName}`]);
  }
  toggleModal = (modalId, action: string, data?: any) => {
    if (action == 'open') {
      document.getElementById(modalId).style.display = 'flex';
    } else {
      document.getElementById(modalId).style.display = 'none';
    }
    if (data) {
      // this.selectedOrder = data;
    }
  };
  // Check if any item in the cart does not meet the MOQ condition
  isOrderValid(): boolean {
    return this.cart.items.every((item) => item.product.moq <= item.quantity);
  }
  removeFromCart(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem.product._id);
  }

  confirmCartRemoval(item: any) {
    Swal.fire({
      html: `<span style="color: #000; font-weight: 600; font-size: 19px;">Are you sure you want to remove "<span style="color: var(--primary-color);">${item?.product?.name}</span>" from cart?</span>`,
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Yes, remove',
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
        this.removeFromCart(item);
      }
    });
  }
  // changeQuantity(delta: number, cartItem: CartItem) {
  //   cartItem.quantity += delta;
  //   if (cartItem.quantity < 1) {
  //     cartItem.quantity = 1;
  //   }
  //   this.cartService.changeQuantity(cartItem.product._id, cartItem.quantity);
  // }
  moqProduct: any;
  changeQuantity(delta: number, cartItem: CartItem) {
    const newQuantity = cartItem.quantity + delta;

    if (newQuantity < cartItem.product.moq && delta < 0) {
      this.moqProduct = cartItem.product;
      this.toggleModal('moqModal', 'open');
      return; // Prevent reducing the quantity below MOQ
    }

    cartItem.quantity = newQuantity;
    if (cartItem.quantity < 1) {
      cartItem.quantity = 1;
    }
    this.cartService.changeQuantity(cartItem.product._id, cartItem.quantity);
  }
  clearCart() {
    this.cartService.clearCart();
  }
  checkoutRoute() {
    this.route.navigate(['core/operation/checkout']);
    window.scrollTo(0, 0);
  }
  shoRoute() {
    this.route.navigate(['core/operation/shop']);
    window.scrollTo(0, 0);
  }

  checkStatusOrder() {
    if (this.userInfo) {
      if (
        this.userInfo?.phoneNumber === null ||
        this.userInfo?.phoneNumber === '' ||
        this.userInfo?.address === null ||
        this.userInfo?.address === '' ||
        this.userInfo?.state === null ||
        this.userInfo?.state === ''
      ) {
        this.toggleModal('updateProfileModal', 'open');
      } else {
        this.toggleModal('paymentTypeModal', 'open');
      }
    } else {
      this.toggleModal('loginModal', 'open');
    }
  }

  updateSuccess() {
    this.userInfo = this.authService.getUserCredentials();
    this.toggleModal('paymentTypeModal', 'open');
  }

  onLoginSuccess() {
    this.toggleModal('loginModal', 'close');
    this.toggleModal('paymentTypeModal', 'open');
    this.userInfo = this.authService.getUserCredentials();
  }
  transferOption = false;
  selectOption() {
    this.transferOption = true;
  }
  paystackResult;
  payWithPaystack(e: { preventDefault: () => void }) {
    this.transferOption = false;
    this.toggleModal('paymentTypeModal', 'close');
    e.preventDefault();
    let handler = PaystackPop.setup({
      key: environment.PAYSTACK_KEY,
      email: this.userInfo?.email,
      amount: this.cart?.totalPrice * 100,
      ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      onClose: () => {
        // alert('Window closed.');
        // console.log('window closed', handler);
      },
      callback: (response: any) => {
        this.paystackResult = response;
        let message = 'Payment complete! Reference: ' + response.reference;
        if (response.status) {
          this.createOrder();
        }
      },
    });

    handler.openIframe();
  }
  orderNote: string = '';
  createOrder() {
    this.transferOption = false;
    this.toggleModal('paymentTypeModal', 'close');
    this.toggleModal('processModal', 'open');
    var orderDetails = {
      orderItems: this.cart.items,
      phone: this.userInfo?.phoneNumber,
      country: this.userInfo?.country,
      zip: this.userInfo?.zip,
      city: this.userInfo?.city,
      user: this.userInfo?._id,
      firstName: this.userInfo?.firstName,
      lastName: this.userInfo?.lastName,
      address: this.userInfo?.address,
      paymentMethod: this.selectedPaymentMethod,
      paymentRefId: this.paystackResult?.reference,
      orderNote: this.orderNote,
      // orderStatus: this.orderForm.value.orderStatus,
      // vendorId: this.orderForm.value.vendorId,
      totalPrice: this.cart?.totalPrice,
    };
    this.orderService.createOrder(orderDetails).subscribe(
      (response) => {
        this.loading = false;
        this.toggleModal('processModal', 'close');
        this.clearCart();
        this.orderService.setOrderCompleted(true);
        this.route.navigate(['/core/operation/order-completed']);
      },
      (error) => {
        this.loading = false;
        this.toggleModal('processModal', 'close');
      }
    );
  }

  placeOrder() {
    this.transferOption = false;
    this.toggleModal('paymentTypeModal', 'close');
    // this.toggleModal('processModal', 'open');
    var orderDetails = {
      orderItems: this.cart?.items,
      phone: this.userInfo?.phoneNumber,
      country: this.userInfo?.country,
      zip: this.userInfo?.zip,
      city: this.userInfo?.city || 'Mainland',
      user: this.userInfo?._id,
      firstName: this.userInfo?.firstName,
      lastName: this.userInfo?.lastName,
      address: this.userInfo?.address,
      paymentMethod: this.selectedPaymentMethod,
      paymentRefId: this.paystackResult?.reference,
      orderNote: this.orderNote,
      // orderStatus: this.orderForm.value.orderStatus,
      // vendorId: this.orderForm.value.vendorId,
      totalPrice: this.cart?.totalPrice,
    };
    this.orderService.createOrder(orderDetails).subscribe(
      (response) => {
        this.loading = false;
        this.toggleModal('processModal', 'close');
        this.orderService.setOrderCompleted(true);
        this.route.navigate(['/core/operation/order-completed']);
        this.clearCart();
      },
      (error) => {
        this.loading = false;
        this.toggleModal('processModal', 'close');
      }
    );
  }
}
