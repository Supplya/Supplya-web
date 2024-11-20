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
      phoneNumber: [''],
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
    if (
      this.authService.getEmailForOTP() == null &&
      this.authService.getPhoneForOTP() == null
    ) {
      this.route.navigate(['/auth/sign-in']);
    } else {
      if (this.authService.getEmailForOTP() != null) {
        
        this.form.value.email = this.authService.getEmailForOTP();
      } else {
        this.form.value.phoneNumber = this.authService.getPhoneForOTP();
        
      }
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
    // const data = {
    //   email: this.authService.getEmailForOTP(),
    //   otp: this.getOtpCode(),
    // };
      let data: { email?: string; phoneNumber?: string; otp: string };
      if (this.authService.getEmailForOTP()) {
        data = {
          email: this.authService.getEmailForOTP(),
          otp: this.getOtpCode(),
        };
      } else {
        data = {
          phoneNumber: this.authService.getPhoneForOTP(),
          otp: this.getOtpCode(),
        };
      }
    this.authService.resendOTP(data).subscribe((response) => {
      if (response.status) {
        this.notify.success(response.message, 6000);
      } else {
        this.notify.danger(response.message, 6000);
      }
    });
  }

  // submitOTP() {
  //   this.submitted = true;

  //   let data: { email?: string; phoneNumber?: string; otp: string };
  //   if (this.authService.getEmailForOTP()) {
  //     data = {
  //       email: this.authService.getEmailForOTP(),
  //       otp: this.getOtpCode(),
  //     };
  //   } else {
  //     data = {
  //       phoneNumber: this.authService.getPhoneForOTP(),
  //       otp: this.getOtpCode(),
  //     };
  //   }
  //   // console.log(data);
  //   if (this.form.valid) {
  //     this.authService.OTPVerification(data).subscribe((response) => {
  //       console.log(response);
  //       localStorage.setItem('spa-userToken', response.token);
  //       localStorage.setItem('spa-userData', JSON.stringify(response.data));
  //       if (response.status) {
  //         this.loading = false;
  //         Swal.fire({
  //           title: 'Congratulations!',
  //           text: 'You have successfully registered on Supplya',
  //           icon: 'success',
  //           showCancelButton: false,
  //           confirmButtonText: 'Continue',
  //           allowOutsideClick: false,
  //           showClass: {
  //             popup: `
  //                 animate__animated
  //                 animate__fadeInDown
  //                 animate__faster
  //               `,
  //           },
  //           hideClass: {
  //             popup: `
  //                 animate__animated
  //                 animate__fadeOutDown
  //                 animate__faster
  //               `,
  //           },
  //         }).then((result) => {
  //           // Handle the user's action after clicking the confirm button
  //           if (result.isConfirmed) {
  //             this.route.navigate(['/auth/add-location']);
  //             // Continue with the desired action
  //           }
  //         });
  //       }
  //     });
  //   }
  // }

  submitOTP() {
    this.submitted = true;

    // Ensure form is valid before proceeding
    if (!this.form.valid) {
      return;
    }

    // Prepare the OTP data
    let data: { email?: string; phoneNumber?: string; otp: string };
    if (this.authService.getEmailForOTP()) {
      data = {
        email: this.authService.getEmailForOTP(),
        otp: this.getOtpCode(),
      };
    } else {
      data = {
        phoneNumber: this.authService.getPhoneForOTP(),
        otp: this.getOtpCode(),
      };
    }
    // Send OTP verification request
    this.loading = true;
    this.authService.OTPVerification(data).subscribe(
      (response) => {
        console.log(response);
        if (response?.status) {
          // Save user token and data in localStorage
          localStorage.setItem('spa-userToken', response.token);
          localStorage.setItem('spa-userData', JSON.stringify(response.data));

          this.loading = false;
          Swal.fire({
            title: 'Congratulations!',
            text: 'You have successfully registered on Supplya.',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Continue',
            allowOutsideClick: false,
            showClass: {
              popup: 'animate__animated animate__fadeInDown animate__faster',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutDown animate__faster',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              // Navigate to the add-location page
              // this.route.navigate(['/auth/add-location']);
              this.route.navigate([`/core/${response?.data?.role}/dashboard`]);
            }
          });
        } else {
          this.loading = false;
          Swal.fire({
            title: 'Error!',
            text: 'OTP verification failed. Please try again.',
            icon: 'error',
            confirmButtonText: 'Retry',
          });
        }
      },
      (error) => {
        console.error('Error during OTP verification:', error);
        this.loading = false;
        // Swal.fire({
        //   title: 'Error!',
        //   text: 'An error occurred while verifying the OTP. Please try again later.',
        //   icon: 'error',
        //   confirmButtonText: 'Retry',
        // });
      }
    );
  }
}
