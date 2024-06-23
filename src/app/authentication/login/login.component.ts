import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { environment } from 'src/assets/environment/environment';
declare const google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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
      },
      { updateOn: 'change' }
    ); // Trigger validation on change
  }
  ngOnInit(): void {
    this.authService.clearCredentials();
    google.accounts.id.initialize(
      {
        client_id: environment.google_Client,
        callback: (res: any) => {
          // console.log(res)
          const credential = res.credential;
          if (credential) {
            const decodedToken = this.decodeJwtToken(credential);
            // console.log('Decoded token:', decodedToken);

            const firstName = decodedToken.given_name
            const lastName = decodedToken.family_name
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
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          if (response.status) {
            this.authService.setCredentials(response);
            this.notify.success('Login Successful', 4000);
          } else {
            // Handle login error
            this.submitted = false;
            this.notify.danger(response.message, 4000);
            console.error('Login error:', response);
          }
        },
        (error) => {
          this.submitted = false;
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
