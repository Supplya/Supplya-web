import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';
import { HelperService } from 'src/app/shared/helpers/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;
  constructor(private fb: FormBuilder, private helperService: HelperService, private route: Router, private authService: AuthService, private notify: ToastyService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
  }, { updateOn: 'change' }); // Trigger validation on change

  }
  ngOnInit(): void {
    this.authService.clearCredentials();
  }
 

  
getErrorMessage(control: string, message: string) {
  return this.helperService.getError(this.loginForm.get(control), message);
}
isInvalid(control: string) {
  return (
    (this.loginForm.get(control)?.touched && this.loginForm.get(control)?.invalid) ||
    (this.submitted && this.loginForm.get(control)?.invalid)
  );
}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  login() {
    this.submitted = true;
    if (this.loginForm.valid) {
     
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.loading = false;
            this.authService.setCredentials(response);
            this.notify.success('Login Successful', 4000);
          } else {
            // Handle login error
            this.submitted = false;
            this.notify.danger(response.msg, 4000);
            console.error('Login error:', response.errorMessage);
          }
        },
        (error) => {
          this.submitted = false;
          // Handle HTTP error
          this.notify.danger(error.error.msg, 4000);
          console.error('HTTP error:', error.error.msg);
          
        }
      );
    }
  }

}
