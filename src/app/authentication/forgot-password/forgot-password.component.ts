import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';
import { HelperService } from 'src/app/shared/helpers/helper.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent {
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;
  constructor(private fb: FormBuilder, private helperService: HelperService, private route: Router, private authService: AuthService, private notify: ToastyService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
  }, { updateOn: 'change' }); // Trigger validation on change

  }
 

  
getErrorMessage(control: string, message: string) {
  return this.helperService.getError(this.form.get(control), message);
}
isInvalid(control: string) {
  return (
    (this.form.get(control)?.touched && this.form.get(control)?.invalid) ||
    (this.submitted && this.form.get(control)?.invalid)
  );
}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  login() {
    this.submitted = true;
    if (this.form.valid) {
     
      this.authService.login(this.form.value).subscribe(
        (response) => {
          if (response.status) {
            this.loading = false;
            console.table('Login success:', response);
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