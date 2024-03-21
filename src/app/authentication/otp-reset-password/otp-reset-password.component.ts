import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';
import { HelperService } from 'src/app/shared/helpers/helper.service';

@Component({
  selector: 'app-otp-reset-password',
  templateUrl: './otp-reset-password.component.html',
  styleUrls: ['./otp-reset-password.component.scss']
})

export class OtpResetPasswordComponent {
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;
  constructor(private fb: FormBuilder, private helperService: HelperService, private route: Router, private authService: AuthService, private notify: ToastyService) {
    this.form = this.fb.group({
      digit1: ['', [Validators.required]],
      digit2: ['', [Validators.required]],
      digit3: ['', [Validators.required]],
      digit4: ['', [Validators.required]],
      digit5: ['', [Validators.required]],
      digit6: ['', [Validators.required]],
  });

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

  moveToNextOrPreviousInput(event: KeyboardEvent, currentInput: HTMLInputElement, nextInput: HTMLInputElement | null, previousInput: HTMLInputElement | null) {
    if (currentInput.value && currentInput.value.length > 0 && nextInput) {
      nextInput.focus();
    } else if (event.key === 'Backspace' && currentInput.value.length === 0 && previousInput) {
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
  // getOtpCode(): string {
  //   return [
  //     this.digit1.nativeElement.value,
  //     this.digit2.nativeElement.value,
  //     this.digit3.nativeElement.value,
  //     this.digit4.nativeElement.value,
  //     this.digit5.nativeElement.value,
  //     this.digit6.nativeElement.value
  //   ].join('');
  // }

  getOtpCode(): number {
    const otpString = [
      this.digit1.nativeElement.value,
      this.digit2.nativeElement.value,
      this.digit3.nativeElement.value,
      this.digit4.nativeElement.value,
      this.digit5.nativeElement.value,
      this.digit6.nativeElement.value
    ].join('');
  
    return parseInt(otpString, 10);
  }
  

  submitOTP() {
    this.submitted = true;
    alert(this.form.value);
    const otpCode = this.getOtpCode();
    // alert(otpCode);
    if (this.form.valid) {
     
      this.authService.login(this.form.value).subscribe(
        (response) => {
          if (response.status === 'success') {
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