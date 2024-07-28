import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router,
    private uploadService: MediaUploadService
  ) {}

  states = [
    'Abia',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara',
    'Abuja',
  ];

  countries = ['Nigeria', 'Ghana'];
  userDetails;
  ngOnInit(): void {
    this.initForm();
    this.userDetails = this.authService.getUserCredentials();
    this.getUserByID();
  }
  requestLoading;
  userInfo;
  getUserByID() {
    this.requestLoading = true;
    this.authService.getUserById(this.userDetails?._id).subscribe(
      (data: any) => {
        this.requestLoading = false;
        if (data.status) {
          this.userInfo = data['data'];
          this.form.patchValue(data['data']);
          // Remove the first '0' from the phone number if it exists and prepend '234'
          let phoneNumber = this.userInfo.phoneNumber;
          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.substring(1);
          } else if (phoneNumber.startsWith('234')) {
            phoneNumber = phoneNumber.substring(3);
          }
          this.form.patchValue({
            phoneNumber: `234${phoneNumber}`,
          });
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
  handleAddressChange(location: any) {
    this.form.patchValue({
      address: location?.address,
      postalCode: location?.postalCode,
      state: location?.state,
      country: 'Nigeria',
    });
  
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
      storeImage: [''],
      dob: [null],
      _id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
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
          this.form.patchValue({
            storeImage: this.imgUrl,
          });
          this.toggleModal('changePhotoModal', 'open');
        }
      },
      (err) => {
        this.errorUploading = true;
        this.uploadRequestLoading = false;
      }
    );
  }
  availableText: string = '';
  notAvailableText: string = '';
  validatingShop: boolean = false;
  errorValidatingShop: boolean = false;
  unableToValidate: string = '';
  validateStoreName() {
    if (this.form.value.storeName === this.userDetails?.storeName) {
      return;
    } else {
      const storeName = this.form.get('storeName')?.value;
      this.validatingShop = true;
      this.authService.validateShop(storeName).subscribe(
        (response: any) => {
          this.validatingShop = false;
          if (response.status) {
            this.availableText = response.message;
            this.notAvailableText = '';
            this.unableToValidate = '';
          } else {
            this.availableText = '';
            this.unableToValidate = '';
            this.notAvailableText = response.message;
          }
        },
        (error) => {
          this.validatingShop = false;
          this.errorValidatingShop = true;
          this.unableToValidate = 'Unable to Validate Store name';
        }
      );
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const formValues = this.passwordForm.value;
      this.authService.changePassword(formValues).subscribe(
        (response) => {
          if (response.status) {
            this.notify.success('Password changed successfully');
            this.router.navigate(['/auth']);
          } else {
            this.notify.danger(response.message);
          }
        },
        (error) => {
          this.selectedTab = 'security';
        }
      );
    }
  }

  updateProfile(): void {
    this.submitted = true;
    let phoneNumber = this.form.value.phoneNumber;
    if (phoneNumber?.startsWith('0')) {
      phoneNumber = phoneNumber?.substring(1);
    } else if (phoneNumber?.startsWith('234')) {
      phoneNumber = phoneNumber?.substring(3);
    }
    this.form.patchValue({
      phoneNumber: `234${phoneNumber}`,
    });
    if (this.form.valid) {
      
      this.authService
        .updateUserById(this.userDetails?._id, this.form.value)
        .subscribe((data) => {
          if (data?.status) {
            localStorage.setItem('spa-userData', JSON.stringify(data.data));
            this.submitted = false;
            this.userDetails = data['data'];
            this.notify.success('Store Profile Updated Successfully', 4000);
            this.getUserByID();
          }
        });
    }
  }
  updatePicture(): void {
    this.toggleModal('changePhotoModal', 'close');
    this.submitted = true;
    this.authService
      .updateUserById(this.userDetails?._id, this.form.value)
      .subscribe(
        (data) => {
          if (data?.status) {
            localStorage.setItem('spa-userData', JSON.stringify(data.data));
            this.submitted = false;
            this.userDetails = data['data'];
            this.toggleModal('changePhotoModal', 'close');
            this.notify.success('Store Photo Updated Successfully', 4000);
            this.getUserByID();
          }
        },
        (error) => {
          this.toggleModal('changePhotoModal', 'open');
        }
      );
  }
}
