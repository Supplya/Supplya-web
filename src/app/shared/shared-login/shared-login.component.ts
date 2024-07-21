import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { environment } from 'src/assets/environment/environment';
import { HelperService } from '../helpers/helper.service';
declare const google: any;

@Component({
  selector: 'app-shared-login',
  templateUrl: './shared-login.component.html',
  styleUrls: ['./shared-login.component.scss'],
})
export class SharedLoginComponent implements OnInit {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() loginProcess = new EventEmitter<void>();
  @Output() loginError = new EventEmitter<void>();
  loginForm: FormGroup;
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
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        rememberMe: [false],
      },
      { updateOn: 'change' }
    ); // Trigger validation on change
  }
  ngOnInit(): void {
    this.loadRememberedCredentials();
    // this.authService.clearCredentials();
    google.accounts.id.initialize(
      {
        client_id: environment.google_Client,
        callback: (res: any) => {
          // console.log(res)
          const credential = res.credential;
          if (credential) {
            const decodedToken = this.decodeJwtToken(credential);
            // console.log('Decoded token:', decodedToken);

            const firstName = decodedToken.given_name;
            const lastName = decodedToken.family_name;
            const email = decodedToken.email;
            const name = decodedToken.name;
            const profilePicture = decodedToken.picture;
            // Add more fields as needed
          }
        },
      },
      (error) => {
        console.log(error);
      }
    );

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'filled_black',
      size: 'large',
      shape: 'rectangle',
      width: 300,
    });
  }

  decodeJwtToken(token: string) {
    return JSON.parse(atob(token?.split('.')[1]));
  }

  toggleModal = (modalId, action: string, data?: any) => {
    if (action == 'open') {
      document.getElementById(modalId).style.display = 'flex';
    } else {
      document.getElementById(modalId).style.display = 'none';
    }
  };
  loadRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword'); // This is insecure
    if (rememberedEmail && rememberedPassword) {
      this.loginForm.patchValue({
        email: rememberedEmail,
        password: rememberedPassword,
        rememberMe: true,
      });
    }
  }

  getErrorMessage(control: string, message: string) {
    return this.helperService.getError(this.loginForm.get(control), message);
  }
  isInvalid(control: string) {
    return (
      (this.loginForm.get(control)?.touched &&
        this.loginForm.get(control)?.invalid) ||
      (this.submitted && this.loginForm.get(control)?.invalid)
    );
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  login() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.loginProcess.emit();
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          if (response.status) {
            const { email, password, rememberMe } = this.loginForm.value;
            if (rememberMe) {
              localStorage.setItem('rememberedEmail', email);
              localStorage.setItem('rememberedPassword', password); // This is insecure
            } else {
              localStorage.removeItem('rememberedEmail');
              localStorage.removeItem('rememberedPassword');
            }
            this.authService.setCredentialsOnly(response);
            this.notify.success('Login Successful', 4000);
            this.loginSuccess.emit();
          } else {
            // Handle login error
            this.submitted = false;
            this.notify.danger(response.message, 4000);
            this.loginError.emit();
            console.error('Login error:', response);
          }
        },
        (error) => {
          this.submitted = false;
          this.loginError.emit();
          // Handle HTTP error

          console.error('HTTP error:', error.error);
        }
      );
    }
  }

  signInWithGoogleCallback(response: any): void {
    if (response.error) {
      console.error('Google sign-in error:', response.error);
      // Optionally handle error if Google sign-in fails
    } else {
      // Successful Google sign-in, handle the response
      console.log('Google sign-in success:', response);
      // Call your AuthService method to handle Google sign-in
      // this.authService.signInWithGoogle(response.credential).subscribe(
      //   (data) => {
      //     // Handle success after AuthService completes sign-in process
      //     console.log('AuthService sign-in with Google success:', data);
      //   },
      //   (error) => {
      //     // Handle AuthService error if sign-in with Google fails
      //     console.error('AuthService sign-in with Google error:', error);
      //     // Optionally show error message to user
      //   }
      // );
    }
  }
}