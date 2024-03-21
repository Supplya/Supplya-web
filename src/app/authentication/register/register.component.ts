import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';
import { HelperService } from 'src/app/shared/helpers/helper.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private route: Router,
    private authService: AuthService,
    private notify: ToastyService
  ) {
    this.form = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { updateOn: 'change' });
  }

  ngOnInit(): void {}

  register() {
    this.submitted = true;
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          if (response) {
            if (response.status === 'success') {
              this.authService.sendEmailForOTP(this.form.value.email)
              this.notify.success(response.message);
              this.route.navigate(['/auth/verify-account']);
            }

          } else {
           
            this.notify.danger(response.msg);
          }
        }
      );
    }
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
          if (response.status === 'success') {
            this.loading = false;
            console.table('Login success:', response);
            this.authService.setCredentials(response);
            this.notify.success('Login Successful', 4000);
          } else {
            this.submitted = false;
            this.notify.danger(response.msg, 4000);
            console.error('Login error:', response.errorMessage);
          }
        },
        (error) => {
          this.submitted = false;
          this.notify.danger(error.error.msg, 4000);
          console.error('HTTP error:', error.error.msg);
        }
      );
    }
  }
}
