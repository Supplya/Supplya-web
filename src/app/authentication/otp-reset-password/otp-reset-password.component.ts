import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { PasswordMatchValidator } from 'src/app/shared/helpers/password-match.validator';

@Component({
  selector: 'app-otp-reset-password',
  templateUrl: './otp-reset-password.component.html',
  styleUrls: ['./otp-reset-password.component.scss'],
})
export class OtpResetPasswordComponent implements OnInit {
  form: FormGroup;
  passwordForm: FormGroup;
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
    this.form = this.fb.group({
      digit1: ['', [Validators.required]],
      digit2: ['', [Validators.required]],
      digit3: ['', [Validators.required]],
      digit4: ['', [Validators.required]],
      digit5: ['', [Validators.required]],
      digit6: ['', [Validators.required]],
    });

    this.passwordForm = this.fb.group(
      {
        // email: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: PasswordMatchValidator('newPassword', 'confirmPassword'),
      }
    );
  }
  ngOnInit(): void {
    if (this.authService.getEmailForOTP() == null) {
      this.route.navigate(['/auth/sign-in']);
    } else {
      this.form.value.email = this.authService.getEmailForOTP();
    }
  }

  @ViewChild('digit1') digit1!: ElementRef<HTMLInputElement>;
  @ViewChild('digit2') digit2!: ElementRef<HTMLInputElement>;
  @ViewChild('digit3') digit3!: ElementRef<HTMLInputElement>;
  @ViewChild('digit4') digit4!: ElementRef<HTMLInputElement>;
  @ViewChild('digit5') digit5!: ElementRef<HTMLInputElement>;
  @ViewChild('digit6') digit6!: ElementRef<HTMLInputElement>;

  focusFirstInput() {
    setTimeout(() => {
      this.digit1.nativeElement.focus();
    }, 0);
  }

  // moveToNextOrPreviousInput(
  //   event: KeyboardEvent,
  //   currentInput: HTMLInputElement,
  //   nextInput: HTMLInputElement | null,
  //   previousInput: HTMLInputElement | null
  // ) {
  //   if (currentInput.value && currentInput.value.length > 0 && nextInput) {
  //     nextInput.focus();
  //   } else if (
  //     event.key === 'Backspace' &&
  //     currentInput.value.length === 0 &&
  //     previousInput
  //   ) {
  //     previousInput.focus();
  //   }
  // }

  moveToNextOrPreviousInput(
    event: KeyboardEvent,
    currentInput: HTMLInputElement,
    nextInput: HTMLInputElement | null,
    previousInput: HTMLInputElement | null
  ) {
    if (event.key === 'Backspace') {
      if (currentInput.selectionStart === 0 && previousInput) {
        previousInput.value = '';
        previousInput.focus();
      } else {
        currentInput.value = '';
      }
    } else if (event.key === 'ArrowRight' && nextInput) {
      nextInput.focus();
    } else if (event.key === 'ArrowLeft' && previousInput) {
      previousInput.focus();
    } else if (
      currentInput.value &&
      currentInput.value.length > 0 &&
      nextInput
    ) {
      nextInput.focus();
    }
  }

  getErrorMessagePass(control: string, message: string) {
    return this.helperService.getError(this.passwordForm.get(control), message);
  }
  isInvalidPass(control: string) {
    return (
      (this.passwordForm.get(control)?.touched &&
        this.passwordForm.get(control)?.invalid) ||
      (this.submitted && this.passwordForm.get(control)?.invalid)
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
    if (this.passwordForm.valid) {
      const data = {
        newPassword: this.passwordForm.value.newPassword,
        confirmPassword: this.passwordForm.value.confirmPassword,
        token: this.verifiedToken,
      };
      // console.log(data)
      this.authService.resetPassword(data).subscribe(
        (response) => {
          if (response.status === true) {
            this.notify.success(
              'Password changed successfully. Login to continue'
            );
            this.route.navigate(['/auth/sign-in']);
            this.submitted = false;
          } else {
            // Handle login error
            this.submitted = false;
            this.notify.danger(response.msg, 4000);
          }
        },
        (error) => {
          this.submitted = false;
          // Handle HTTP error
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

  // OTP AS STRING
  getOtpCode(): string {
    return [
      this.digit1.nativeElement.value,
      this.digit2.nativeElement.value,
      this.digit3.nativeElement.value,
      this.digit4.nativeElement.value,
      this.digit5.nativeElement.value,
      this.digit6.nativeElement.value,
    ].join('');
  }

  // getOtpCode(): number {
  //   const otpString = [
  //     this.digit1.nativeElement.value,
  //     this.digit2.nativeElement.value,
  //     this.digit3.nativeElement.value,
  //     this.digit4.nativeElement.value,
  //     this.digit5.nativeElement.value,
  //     this.digit6.nativeElement.value
  //   ].join('');

  //   return parseInt(otpString, 10);
  // }

  currentForm: string = 'otp';
  // currentForm: string = 'changePassword';
  verifiedToken;
  submitOTP() {
    this.submitted = true;
    const data = {
      email: this.authService.getEmailForOTP(),
      otp: this.getOtpCode(),
    };
    if (this.form.valid) {
      this.authService.verifyOTP(data).subscribe(
        (response) => {
          if (response.status) {
            this.loading = false;
            this.submitted = false;
            this.verifiedToken = response?.token;
            this.notify.success(response?.message, 4000);
            this.currentForm = 'changePassword';

            // this.route.navigate(['/auth/change-password']);
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