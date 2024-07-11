import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { PasswordMatchValidator } from 'src/app/shared/helpers/password-match.validator';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.scss'],
})
export class CreateNewPasswordComponent {
  form: FormGroup;
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
    this.form = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: PasswordMatchValidator('newPassword', 'confirmPassword'),
      }
    );
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

  showPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  changeAuthPassword() {
    this.submitted = true;
    if (this.form.valid) {
      this.authService.changeAuthPassword(this.form.value).subscribe(
        (response) => {
          if (response.status) {
            this.loading = false;
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
