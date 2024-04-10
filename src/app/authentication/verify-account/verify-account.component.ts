import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
})
export class VerifyAccountComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
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
      email: [''],
      otp: [''],
    });
  }

  @ViewChild('digit1') digit1!: ElementRef<HTMLInputElement>;
  @ViewChild('digit2') digit2!: ElementRef<HTMLInputElement>;
  @ViewChild('digit3') digit3!: ElementRef<HTMLInputElement>;
  @ViewChild('digit4') digit4!: ElementRef<HTMLInputElement>;
  @ViewChild('digit5') digit5!: ElementRef<HTMLInputElement>;
  @ViewChild('digit6') digit6!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    if (this.authService.getEmailForOTP() == null) {
      this.route.navigate(['/auth/sign-in']);
    } else {
      this.form.value.email = this.authService.getEmailForOTP();
    }
  }
  focusFirstInput() {
    setTimeout(() => {
      this.digit1.nativeElement.focus();
    }, 0);
  }

  moveToNextOrPreviousInput(
    event: KeyboardEvent,
    currentInput: HTMLInputElement,
    nextInput: HTMLInputElement | null,
    previousInput: HTMLInputElement | null
  ) {
    if (currentInput.value && currentInput.value.length > 0 && nextInput) {
      nextInput.focus();
    } else if (
      event.key === 'Backspace' &&
      currentInput.value.length === 0 &&
      previousInput
    ) {
      previousInput.focus();
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

  resendOTP() {
    const data = {
      email: this.authService.getEmailForOTP(),
      otp: this.getOtpCode(),
    };
    this.authService.resendOTP(data).subscribe((response) => {
      if (response.status === 'success') {
        this.notify.success(response.message, 6000);
      } else {
        this.notify.danger(response.message, 6000);
      }
    });
  }

  submitOTP() {
    this.submitted = true;
    const data = {
      email: this.authService.getEmailForOTP(),
      otp: this.getOtpCode(),
    };
    // console.log(data);
    if (this.form.valid) {
      this.authService.OTPVerification(data).subscribe((response) => {
        localStorage.setItem('spa-userToken', response.token);
        localStorage.setItem('spa-userData', JSON.stringify(response.data));
        if (response.status === 'success') {
          this.loading = false;
          Swal.fire({
            title: 'Congratulations!',
            text: 'You have successfully registered on Supplya',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Continue',
            allowOutsideClick: false, // Prevents closing on outside click
            showClass: {
              popup: `
                  animate__animated
                  animate__fadeInDown
                  animate__faster
                `,
            },
            hideClass: {
              popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `,
            },
          }).then((result) => {
            // Handle the user's action after clicking the confirm button
            if (result.isConfirmed) {
              this.route.navigate(['/auth/add-location']);
              // Continue with the desired action
            }
          });
        }
      });
    }
  }
}
