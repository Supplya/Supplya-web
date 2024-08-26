import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { HelperService } from 'src/app/shared/helpers/helper.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private authService: AuthService,
    private notify: ToastyService
  ) {}
  userDetails;
  ngOnInit(): void {
    this.userDetails = this.authService.getUserCredentials();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: [this.userDetails?.name || '', Validators.required],
      email: [this.userDetails?.email || '', Validators.required],
      phone: [this.userDetails?.phoneNumber || '', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
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

  sentMessage = '';
  sendMessage(): void {
    this.submitted = true;
    this.sentMessage = '';
    //  const formData = { ...this.form.value };
     if (this.userDetails) {
       this.form.value.name = `${this.userDetails?.firstName} ${this.userDetails?.lastName}`;
       this.form.value.email = this.userDetails?.email;
       this.form.value.phone = this.userDetails?.phoneNumber;
     }
     this.authService.sendMessage(this.form.value).subscribe(
       (data) => {
         this.submitted = false;
         this.form.reset();
         this.sentMessage =
           "Message was successfully sent. We'll get in touch with you shortly";
         this.notify.success('Message was successfully sent');
       },
       (error: any) => {
         this.sentMessage = '';
       }
     );
   
  }
}
