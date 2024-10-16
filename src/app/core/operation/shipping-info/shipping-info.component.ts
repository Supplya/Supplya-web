import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { Cart } from 'src/app/models/operation/cart';
import { CartItem } from 'src/app/models/operation/cartItem';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/operation/order';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { OrderService } from '../services/order/order.service';
import { ToastyService } from 'ng-toasty';
declare var PaystackPop: any;




@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.css'],
})
export class ShippingInfoComponent implements OnInit {
  quantity: number = 1;
  cart!: Cart;
  cartItems: CartItem[] = [];
  isLoggedIn: boolean = false;
  loading: boolean = false;
  orderForm!: FormGroup;
  order!: Order;
  userInfo: any;
  constructor(
    private cartService: CartService,
    private notify: ToastyService,
    private orderService: OrderService,
    private route: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.orderForm = fb.group({
      phone: [''],
      email: [''],
      country: [''],
      zip: [''],
      city: [''],
      user: [''],
      firstName: [''],
      lastName: [''],
      address: [''],
      paymentMethod: ['', Validators.required],
      paymentRef: [''],
      orderNote: [''],
      orderStatus: [''],
      vendorId: [''],
      totalPrice: [''],
    });

    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.cartItems = cart.items;
      // console.log(this.cart, 'getCartObservable');
    });
    // this.orderForm.value.paymentMethod = 'cashOnDelivery';
  }

  ngOnInit(): void {
    this.getUserCredentials();
    this.userInfo = this.authService.getUserCredentials();
    this.getOrderInfo();
 this.toggleModal('paymentTypeModal', 'open');
  }

  getUserCredentials() {
    this.userInfo = this.authService.getUserCredentials();
  }

  getOrderInfo() {
    this.orderForm.patchValue({
      firstName: this.userInfo?.firstName,
      lastName: this.userInfo?.lastName,
      email: this.userInfo?.email,
      phone: this.userInfo?.phoneNumber,
      user: this.userInfo?._id,
      country: this.userInfo?.country,
    });
  }

  viewProduct(route: number) {
    this.route.navigate(['core/operation/product-details/', `${route}`]);
    window.scrollTo(0, 0);
  }
  // selectedPaymentMethod: string = 'cashOnDelivery';

  onPaymentButtonClick(method: string): void {
    console.log(this.orderForm.value.paymentMethod, 'payment');
    if (this.orderForm.value.paymentMethod === method) {
      this.placeOrder();
    } else if (this.orderForm.value.paymentMethod === method) {
      this.proceedToPayment();
    }
  }

  placeOrder(): void {
    this.loading = true;
    this.createOrder();
    console.log('Placing Order...');
  }

  proceedToPayment(): void {
    // Add logic for proceeding to payment when "Proceed to Payment" is clicked
    console.log('Proceeding to Payment...');
  }

  // PAYSTACK INTEGRATION

  payWithPaystack(e: { preventDefault: () => void }) {
    e.preventDefault();
    this.loading = true;
    let handler = PaystackPop.setup({
      key: 'pk_test_58c4e5396a1b0b3f3d3c9e0100d0b1348affa82d',
      email: this.orderForm.value.email,
      amount: this.cart.totalPrice * 100,
      ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      onClose: () => {
        this.loading = false;
        alert('Window closed.');
        console.log('window closed', handler);
      },
      callback: (response: any) => {
        let message = 'Payment complete! Reference: ' + response.reference;
        // alert(message);

        this.orderForm.value.paymentRef = response.reference;
        if (response.status) {
          // this.loading = true;
          this.createOrder();
        }
        console.log('window response', response);
      },
    });

    handler.openIframe();
  }

  createOrder() {
    console.log('create order Initiated');
    var orderDetails = {
      orderItems: this.cart.items,
      phone: this.orderForm.value.phone,
      country: this.orderForm.value.country,
      zip: this.orderForm.value.zip,
      city: this.orderForm.value.city,
      user: this.orderForm.value.user,
      firstName: this.orderForm.value.firstName,
      lastName: this.orderForm.value.lastName,
      address: this.orderForm.value.address,
      paymentMethod: this.orderForm.value.paymentMethod,
      paymentRefId: this.orderForm.value.paymentRef,
      orderNote: this.orderForm.value.orderNote,
      orderStatus: this.orderForm.value.orderStatus,
      vendorId: this.orderForm.value.vendorId,
      totalPrice: this.cart?.totalPrice,
    };
    this.orderService.createOrder(orderDetails).subscribe(
      (response) => {
        this.loading = false;
        this.notify.success('Order created successfully', 4000);
        this.route.navigate(['/core/operation/order-completed']);
        console.log('create order', orderDetails, response);
      },
      (error) => {
        this.notify.danger('An error occurred when creating order', 4000);
        this.loading = false;
        console.error('create order failed', error);
      }
    );
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
}
