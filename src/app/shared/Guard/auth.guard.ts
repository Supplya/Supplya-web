import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private notify: ToastyService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const urlSegments = state.url.split('/'); // Split the URL into segments
    const userTypeFromUrl = urlSegments[2]; // The third segment should be the user type
console.log( urlSegments , 'urlSegments')
console.log( userTypeFromUrl , 'userTypeFromUrl')
    const credentials = this.authService.getUserCredentials();
    console.log( credentials, 'credentials')

    if (!credentials) {
      this.router.navigate(['/auth']);
      this.notify.warning('Kindly login to continue', 4000);
      return false;
    }

    const userRole = credentials.userType;

    // if (userRole === 'admin' || userRole === userTypeFromUrl) {
    if (userRole === userTypeFromUrl) {
      return true;
    } else {
      // Unauthorized access
      this.notify.warning('Unauthorized Access', 4000);
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
