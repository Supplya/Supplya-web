// order.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OrderService } from 'src/app/core/operation/services/order/order.service';


@Injectable({
  providedIn: 'root',
})
export class OrderGuard implements CanActivate {
  constructor(private orderService: OrderService, private router: Router) {}

  canActivate(): boolean {
    if (this.orderService.isOrderCompleted()) {
      return true;
    } else {
      this.router.navigate(['/']); // Redirect to home or another appropriate page
      return false;
    }
  }
}
