import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { PasswordMatchValidator } from 'src/app/shared/helpers/password-match.validator';
import { MediaUploadService } from 'src/app/shared/services/mediaUpload.service';
declare const google: any; 

@Component({
  selector: 'app-customer-settings',
  templateUrl: './customer-settings.component.html',
  styleUrls: ['./customer-settings.component.scss'],
})
export class CustomerSettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('search', { static: false }) searchElementRef!: ElementRef;
  @ViewChild('mapElement', { static: false }) mapElementRef!: ElementRef;

  map!: any; // Use 'any' type for map variable
  autocomplete: any; // Autocomplete variable

  mapVisible: boolean = false;
  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private authService: AuthService,
    private notify: ToastyService,
    private router: Router,
    private ngZone: NgZone,
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
    this.form.reset();
    this.requestLoading = true;
    this.authService.getUserById(this.userDetails?._id).subscribe(
      (data: any) => {
        this.requestLoading = false;
        if (data.status) {
          this.userInfo = data['data'];
          this.form.patchValue(data['data']);
          this.shippingForm.patchValue(data['data']);
        } else {
          this.notify.danger(data?.message);
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
  shippingForm: FormGroup;
  passwordForm: FormGroup;
  submitted: boolean = false;
  selectedTab: string = 'profile';
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
      // country: ['', Validators.required],
      // state: ['', Validators.required],
      // address: ['', Validators.required],
      // city: [''],
      // postalCode: [''],
      profileImage: [''],
      phoneNumber: [null, Validators.required],
      accountNumber: [''],
      bank: [''],
      dob: [null],
      _id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
    });

    this.shippingForm = this.fb.group({
      country: ['Nigeria', Validators.required],
      state: ['', Validators.required],
      address: ['', Validators.required],
      city: [''],
      postalCode: [''],
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
  getErrorMessageShip(control: string, message: string) {
    return this.helperService.getError(this.shippingForm.get(control), message);
  }
  isInvalidShip(control: string) {
    return (
      (this.shippingForm.get(control)?.touched &&
        this.shippingForm.get(control)?.invalid) ||
      (this.shippingSubmitted && this.shippingForm.get(control)?.invalid)
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
            profileImage: this.imgUrl,
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
    if (this.form.valid) {
      this.authService
        .updateUserById(this.userDetails?._id, this.form.value)
        .subscribe((data) => {
          if (data?.status) {
            localStorage.setItem('spa-userData', JSON.stringify(data.data));
            this.submitted = false;
            this.userDetails = data['data'];
            this.notify.success('Profile Updated Successfully', 4000);
            this.getUserByID();
          }
        });
    }
  }
  shippingSubmitted;
  updateShippingInfo(): void {
    this.shippingSubmitted = true;
    if (this.shippingForm.valid) {
      this.authService
        .updateUserById(this.userDetails?._id, this.shippingForm.value)
        .subscribe((data) => {
          if (data?.status) {
            localStorage.setItem('spa-userData', JSON.stringify(data.data));
            this.shippingSubmitted = false;
            this.userDetails = data['data'];
            this.notify.success('Shipping Info Updated Successfully', 4000);
            this.getUserByID();
          }
        },
          (error: any) => { 
            this.shippingSubmitted = false
          }
        );
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
            this.authService.setCredentialsOnly(data?.data);
            this.submitted = false;
            this.userDetails = data['data'];
            this.toggleModal('changePhotoModal', 'close');
            this.notify.success('Photo Updated Successfully', 4000);
            this.getUserByID();
          }
        },
        (error) => {
          this.toggleModal('changePhotoModal', 'open');
        }
      );
  }
  dropdownConfig = {
    displayKey: '',
    search: true,
    height: '250px', // make sure height is limited for overflow
    placeholder: 'Select an option',
    limitTo: this.states.length, // a number thats limits the no of options displayed in the UI similar to angular limitTo pipe
    moreText: 'more', // text to be displayed when more than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search',
    multiple: true,
    searchOnKey: '', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false,
    inputDirection: 'ltr', // the d
  };

  ngAfterViewInit(): void {
    if (this.mapElementRef) {
      this.initializeMap();
    }
    if (this.searchElementRef) {
      this.initializeAutocomplete();
    }
  }

  initializeMap(): void {
    if (this.mapElementRef && this.mapElementRef.nativeElement) {
      const nigeria = new google.maps.LatLng(9.082, 8.6753);
      this.map = new google.maps.Map(this.mapElementRef.nativeElement, {
        center: nigeria,
        zoom: 6, // Adjust zoom level as needed
      });
    }
  }

  mapMarkers: any[] = [];
  address: string = '';
  state: string = '';
  initializeAutocomplete(): void {
    if (this.searchElementRef && this.searchElementRef.nativeElement) {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          componentRestrictions: { country: 'NG' },
        }
      );
      this.autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = this.autocomplete.getPlace();

          if (!place.geometry) {
            // console.error("No geometry for place", place);
            return;
          }

          // Extract the state from the address components
          let state = '';
          for (const component of place.address_components) {
            if (component.types.includes('administrative_area_level_1')) {
              state = component.long_name;
              break;
            }
          }

          // Log the state
          // console.log('Selected state:', state);

          // Set the state variable in your component if needed
          this.state = state;

          // Your existing code for handling map and markers...
          this.address = place.formatted_address;
          if (this.map) {
            // Clear existing markers
            this.mapMarkers.forEach((marker) => marker.setMap(null));
            this.mapMarkers = [];

            // Set center and zoom level based on selected place
            if (place.geometry.viewport) {
              this.map.fitBounds(place.geometry.viewport);
            } else {
              this.map.setCenter(place.geometry.location);
              this.map.setZoom(17); // Adjust zoom level as needed
            }

            // Add marker for selected place
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map: this.map,
            });
            this.mapMarkers.push(marker);
          }
        });
      });
    }
  }

  onAddressChange(): void {
    const addressControl = this.form.get('address');
    if (addressControl && !addressControl.value) {
      this.mapVisible = false;
    } else {
      this.mapVisible = true;

      if (!this.map) {
        this.initializeMap();
      }
    }
  }
}