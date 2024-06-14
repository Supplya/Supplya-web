import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { PasswordMatchValidator } from 'src/app/shared/helpers/password-match.validator';
import { MediaUploadService } from 'src/app/shared/services/mediaUpload.service';

@Component({
  selector: 'app-vendor-settings',
  templateUrl: './vendor-settings.component.html',
  styleUrls: ['./vendor-settings.component.scss'],
})
export class VendorSettingsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private authService: AuthService,
    private notify: ToastyService,
    private uploadService: MediaUploadService
  ) {}

  states = ['Lagos', 'Abuja'];
  countries = ['Nigeria', 'Ghana'];
  userDetails;
  ngOnInit(): void {
    this.initForm();
    this.userDetails = this.authService.getUserCredentials();
    console.log(this.userDetails)
    this.getUserByID();
  }
  requestLoading;
  userInfo;
  getUserByID() {
    this.requestLoading = true;
    this.authService.getUserById(this.userDetails?._id).subscribe(
      (data: any) => {
        this.requestLoading = false;
        if (data.status === 'success') {
          this.userInfo = data['data'];
          this.form.patchValue(data['data']);
        } else {
          this.notify.danger(data.message);
        }
      },
      (error) => {
        this.requestLoading = false;
        this.errorFetching = true;
      }
    );
  }
  errorFetching;
  refreshUser() {
    this.errorFetching = false;
    this.getUserByID();
  }
  form: FormGroup;
  passwordForm: FormGroup;
  submitted: boolean = false;
  selectedTab: string = 'shop';
  showPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  imgUrl: string | null = null;
  // imgUrl: string | null = '/assets/Images/Rectangle 136.png';
  uploadProgress: number = 0;
  uploadRequestLoading: boolean = false;
  errorUploading: boolean = false;
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  initForm() {
    this.form = this.fb.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      address: ['', Validators.required],
      city: [''],
      postalCode: [''],
      storeName: [null],
      storeUrl: [null],
      phoneNumber: [null, Validators.required],
      accountNumber: [''],
      bank: [''],
      dob: [null],
      _id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.passwordForm = this.fb.group(
      {
        password: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: PasswordMatchValidator('newPassword', 'confirmPassword') }
    );
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

  submittedPass;
  getErrorMessagePass(control: string, message: string) {
    return this.helperService.getError(this.passwordForm.get(control), message);
  }
  isInvalidPass(control: string) {
    return (
      (this.passwordForm.get(control)?.touched &&
        this.passwordForm.get(control)?.invalid) ||
      (this.submittedPass && this.passwordForm.get(control)?.invalid)
    );
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  toggleModal = (modalId, action: string, data?: any) => {
    if (action == 'open') {
      document.getElementById(modalId).style.display = 'flex';
    } else {
      document.getElementById(modalId).style.display = 'none';
    }
    if (data) {
      // this.selectedOrder = data;
    }
  };
  resetForm() {
    this.form.reset();
    this.submitted = false;
  }
  addImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDragEnter(event: any) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  }

  onDrop(event: any) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    const file = event.dataTransfer.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    this.toggleModal('changePhotoModal', 'close');
    this.uploadProgress = 0;
    this.uploadRequestLoading = true;

    this.uploadService.uploadImages(file).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = 0;
          this.uploadRequestLoading = false;
          this.imgUrl = event.body.secure_url;
          this.toggleModal('changePhotoModal', 'open');
        }
      },
      (err) => {
        this.errorUploading = true;
        this.uploadRequestLoading = false;
      }
    );
  }
  changePassword() {}

  updateProfile(): void {
    this.submitted = true;
    this.authService.updateUserById(this.userDetails?._id, this.form.value).subscribe((data) => {

      if (data.success === 'success') { 
        this.authService.setCredentials(data);
        this.submitted = false;
        this.userDetails = data['data'];
          this.notify.success('Store Profile Updated Successfully', 4000);
          this.getUserByID();
      }
    
    });
  }
}
