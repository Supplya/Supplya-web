import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { HelperService } from 'src/app/shared/helpers/helper.service';
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
  initialFormValues = {
    accountNumber: '',
    address: 'Oloja St, Somolu, Lagos 102216, Lagos, Nigeria',
    bank: '',
    country: 'Nigeria',
    createdAt: '2024-06-08T18:33:34.676Z',
    dob: null,
    email: 'ashconceptdigital@gmail.com',
    firstName: 'Pius',
    shopName: 'Pius Store',
    shopUrl: 'http://supplya.com/ash',
    isSoleProprietor: false,
    lastName: 'Ashogbon',
    phoneNumber: '09067009945',
    role: 'vendor',
    state: 'Lagos',
    _id: '6664a5b92dd055006ba503de',
  };

  states = ['Lagos', 'Abuja'];
  countries = ['Nigeria', 'Ghana'];
  ngOnInit(): void {
    this.initForm();
    this.form.patchValue(this.initialFormValues);
  }
  form: FormGroup;
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
      accountNumber: [''],
      address: [''],
      bank: [''],
      country: ['', Validators.required],
      shopName: ['', Validators.required],
      shopUrl: ['', Validators.required],
      createdAt: ['', Validators.required],
      dob: [null, Validators.required],
      email: [''],
      confirmPassword: [''],
      password: ['password'],
      newPassword: [''],
      firstName: ['', Validators.required],
      isSoleProprietor: [false],
      lastName: ['', Validators.required],
      phoneNumber: [null, Validators.required],
      role: ['', Validators.required],
      state: ['', Validators.required],
      _id: [''],
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
  updateProfile() {}
}
