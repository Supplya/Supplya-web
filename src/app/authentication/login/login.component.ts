import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private route: Router, private authService: AuthService, private notify: ToastyService) {
    this.loginForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],

    })

  }


  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

//   login() {
//     this,this.loading = true;
//     console.log(this.loginForm.controls, 'login');
//     this.authService.login(this.loginForm.value).subscribe(
//       (response) => {
//         if(response){
// this.loading = false;
//           this.notify.success('Login Successful');
//           // this.route.navigate(['/auth/sign-in']);
//           console.log('login successful:', response);
//         }else{
//           this.loading = false;
//           this.notify.danger(response.msg);
//         }
       
//         // Handle successful registration, e.g., redirect to login page
//       },
//       (error) => {
//         console.error('login failed:', error);
//         this.loading = false;
//         this.notify.danger(error.error.msg);
//         // Handle registration failure, e.g., display an error message
//       }
//     );
//   }

  login() {
    this.loading = true;
console.log(this.loginForm.value, 'login');
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.loading = false;
          this.authService.setCredentials(response);
          this.notify.success('Login Successful', 4000);
        } else {
          // Handle login error
          this.loading = false;
          this.notify.danger(response.msg, 4000);
          console.error('Login error:', response.errorMessage);
        }
      },
      (error) => {
        this.loading = false;
        // Handle HTTP error
        this.notify.danger(error.error.msg, 4000);
        console.error('HTTP error:', error.error.msg);
        
      }
    );
  }

}
