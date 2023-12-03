import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  loading: boolean = false;

 
  

  constructor(private fb: FormBuilder, private route: Router, private authService: AuthService, private notify: ToastyService) {
    this.registerForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dob: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],

    })

  }
  ngOnInit(): void {

  }

  
  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  

  register() {
    this,this.loading = true;
    console.log(this.registerForm.controls, 'register');
    this.authService.register(this.registerForm.value).subscribe(
      (response) => {
        if(response){
this.loading = false;
          this.notify.success('Registration Successful');
          this.route.navigate(['/auth/sign-in']);
          console.log('Registration successful:', response);
        }else{
          this.loading = false;
          this.notify.danger(response.msg);
        }
       
        // Handle successful registration, e.g., redirect to login page
      },
      (error) => {
        console.error('Registration failed:', error);
        this.loading = false;
        this.notify.danger(error);
        // Handle registration failure, e.g., display an error message
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
