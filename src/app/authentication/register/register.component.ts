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
  signupWithPhone = false;
  signupMethod;
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
        phoneNumber: [
          '',
          [
            Validators.required,
            // Validators.pattern('^[+][0-9]{1,3}[0-9]{10,12}$'),
          ],
        ],
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
      this.toggleModal('methodModal', 'open');
    } else {
      return;
    }
  }
  setSignupMethod(method: 'email' | 'phone'): void {
    this.signupWithPhone = method === 'phone';

    if (this.signupWithPhone) {
      this.form.get('email')?.disable();
      this.form.get('phoneNumber')?.enable();
    } else {
      this.form.get('phoneNumber')?.disable();
      this.form.get('email')?.enable();
    }
  }
methodError = ''
  fromMethod() {
    const phone = this.form.get('phoneNumber')?.value;
    const email = this.form.get('email')?.value;
    if (phone && email === '') { 
this.methodError = 'Please select a contact method before you proceed.'
    } else {
      this.methodError = '';
      this.toggleModal('methodModal', 'close');
      
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
        let phone = this.form.get('phoneNumber')?.value;
        if (phone) {
          // Remove leading '0' if present
          if (phone.startsWith('0')) {
            phone = phone.substring(1);
          }
          // Prepend '+234' if the phone doesn't already start with '234' or '+234'
          if (!phone.startsWith('234') && !phone.startsWith('+234')) {
            phone = `234${phone}`;
            this.form.patchValue({ phoneNumber: phone });
          }
        }
      this.authService.register(this.form.value).subscribe((response) => {
        if (response) {
          if (response.status) {
            if (this.signupWithPhone) {
              this.authService.sendPhoneForOTP(this.form.value.phoneNumber);
              this.authService.clearEmailOTP()
            } else {
              
              this.authService.sendEmailForOTP(this.form.value.email);
              this.authService.clearPhoneOTP();

            }
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
