import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/service/auth.service';

@Component({
  selector: 'app-order-completed',
  templateUrl: './order-completed.component.html',
  styleUrls: ['./order-completed.component.css'],
})
export class OrderCompletedComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  user: any;
  ngOnInit(): void {
    this.user = this.authService.getUserCredentials();
  }
  goToOrders(role: string) {
    this.router.navigate([`/core/${role}/orders`]);
  }
}
