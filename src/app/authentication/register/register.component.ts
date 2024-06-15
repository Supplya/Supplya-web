import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { PasswordMatchValidator } from 'src/app/shared/helpers/password-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
this.form = this.fb.group(
  {
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: [''],
    confirmPassword: ['', Validators.required],
  },
  {
    validator: PasswordMatchValidator('password', 'confirmPassword'),
    // updateOn: 'change',
  }
);

  }

  ngOnInit(): void {
    this.toggleModal('signUpModal', 'open');
  }
  toggleModal = (modalId, action: string, data?: any) => {
    if (action == 'open') {
      document.getElementById(modalId).style.display = 'flex';
    } else {
      document.getElementById(modalId).style.display = 'none';
    }
  };
  continue() {
    this.submitType = true;
    if (this.userType != '') {
      this.toggleModal('signUpModal', 'close');
    } else {
      return;
    }
  }
  userType: string = '';
  submitType: boolean = false;
  setUserType(type: string) {
    this.userType = type;
  }
  register() {
    this.submitted = true;
    if (this.form.valid) {
      this.form.value.role = this.userType;
      this.authService.register(this.form.value).subscribe((response) => {
        if (response) {
          if (response.status === 'success') {
            this.authService.sendEmailForOTP(this.form.value.email);
            this.notify.success(response.message);
            this.route.navigate(['/auth/verify-account']);
          }
        } else {
          this.notify.danger(response.msg);
        }
      });
    }
  }
  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
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
}
