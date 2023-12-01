import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { Cart } from 'src/app/models/operation/cart';
import { CartItem } from 'src/app/models/operation/cartItem';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Order } from 'src/app/models/operation/order';
declare var PaystackPop: any;




@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.css']
})
export class ShippingInfoComponent implements OnInit {
  quantity: number = 1;
  cart!: Cart;
  cartItems: CartItem[] = [];
  loading: boolean = false;
orderForm!: FormGroup;
order!: Order
  constructor(private cartService: CartService, private route: Router, private fb: FormBuilder) {
    this.orderForm = fb.group({
      phone: ['',],
      country: [''],
      zip: [''],
      city: [''],
      user: [''],
      firstName: [''],
      lastName: [''],
      address: [''],
    })
   }

  ngOnInit(): void {
    this.loading = true;
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      this.cartItems = cart.items;
      this.loading = false;
      console.log(this.cart, 'getCartObservable');
    });
  }
  viewProduct(route: number) {
    this.route.navigate(['core/operation/product-details/', `${route}`]);
    window.scrollTo(0, 0);
  }


     // PAYSTACK INTEGRATION
     email: string = 'pius1ash@gmail.com';
     // amount = this.cart.totalPrice;
   
     payWithPaystack(e: { preventDefault: () => void; }) {
       e.preventDefault();
   
       let handler = PaystackPop.setup({
         key: 'pk_test_db114057f7e1e073f3bc5d5551869e8eef51b9b1', // Replace with your public key
         email: this.email,
         amount: this.cart.totalPrice * 100,
         ref: ''+Math.floor((Math.random() * 1000000000) + 1),
         onClose: function(){
           alert('Window closed.');
           console.log('window closed', handler);
         },
         callback: function(response: any){
           let message = 'Payment complete! Reference: ' + response.reference;
           alert(message);
           console.log('window response', response);
   
         }
       });
   
       handler.openIframe();
     }
}
