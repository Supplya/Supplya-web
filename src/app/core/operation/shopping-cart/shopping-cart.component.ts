import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { Cart } from 'src/app/models/operation/cart';
import { CartItem } from 'src/app/models/operation/cartItem';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { OrderService } from '../services/order/order.service';
import { ToastyService } from 'ng-toasty';

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
    // this.toggleModal('processModal', 'open');
    this.loading = true;
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.cartItems = cart.items;
      // console.log(this.cartItems);
      this.loading = false;
    });
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

  changeQuantity(delta: number, cartItem: CartItem) {
    cartItem.quantity += delta;
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
  paystackResult;
  payWithPaystack(e: { preventDefault: () => void }) {
    this.toggleModal('paymentTypeModal', 'close');
    e.preventDefault();
    let handler = PaystackPop.setup({
      key: 'pk_test_58c4e5396a1b0b3f3d3c9e0100d0b1348affa82d',
      email: this.userInfo.email,
      amount: this.cart.totalPrice * 100,
      ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      onClose: () => {
        // alert('Window closed.');
        // console.log('window closed', handler);
      },
      callback: (response: any) => {
        this.paystackResult = response;
        let message = 'Payment complete! Reference: ' + response.reference;
        // alert(message);

        // this.orderForm.value.paymentRef = response.reference;
        if (response.status) {
          // this.loading = true;
          this.createOrder();
        }
        // console.log('window response', response);
      },
    });

    handler.openIframe();
  }
  orderNote: string = '';
  createOrder() {
    this.toggleModal('paymentTypeModal', 'close');
    this.toggleModal('processModal', 'open');
    var orderDetails = {
      orderItems: this.cart.items,
      phone: this.userInfo.phoneNumber,
      country: this.userInfo.country,
      zip: this.userInfo.zip,
      city: this.userInfo?.city || 'Mainland',
      user: this.userInfo?._id,
      firstName: this.userInfo.firstName,
      lastName: this.userInfo.lastName,
      address: this.userInfo.address,
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
        this.toggleModal('successModal', 'open');
        this.clearCart();
      },
      (error) => {
        this.loading = false;
        this.toggleModal('processModal', 'close');
      }
    );
  }
}
