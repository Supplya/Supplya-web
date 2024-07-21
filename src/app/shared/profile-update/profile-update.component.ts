import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { HelperService } from '../helpers/helper.service';
import { PasswordMatchValidator } from '../helpers/password-match.validator';
import { MediaUploadService } from '../services/mediaUpload.service';
import { Subscription } from 'rxjs';
declare const google: any; 
@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
})
export class ProfileUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  
  @Output() UpdateSuccess = new EventEmitter<void>();
  @Output() UpdateStart = new EventEmitter<void>();
  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private authService: AuthService,
    private notify: ToastyService,
    private router: Router,
    private ngZone: NgZone,
    private uploadService: MediaUploadService
  ) {}
  @ViewChild('search', { static: false }) searchElementRef!: ElementRef;
  @ViewChild('mapElement', { static: false }) mapElementRef!: ElementRef;
  ngOnDestroy(): void {
    if (this.credentialsSubscription) {
      this.credentialsSubscription.unsubscribe();
    }
  }
  map!: any; // Use 'any' type for map variable
  autocomplete: any; // Autocomplete variable
  private credentialsSubscription: Subscription;
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;
  mapVisible: boolean = false;
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
    if (this.userDetails) {
      this.form.patchValue(this.userDetails);
    }
    // this.credentialsSubscription = this.authService
    //   .getUserCredentialsObservable()
    //   .subscribe((credentials) => {
    //     this.userDetails = credentials;
    //   });
//     if (this.userDetails) { 
// this.getUserByID();
//     } 
  }
  requestLoading;
  // userInfo;
  // getUserByID() {
  //   this.requestLoading = true;
  //   this.authService.getUserById(this.userDetails?._id).subscribe(
  //     (data: any) => {
  //       this.requestLoading = false;
  //       if (data.status) {
  //         this.userInfo = data['data'];

  //         this.form.patchValue(data['data']);
  //       } else {
  //         this.notify.danger(data.message);
  //       }
  //     },
  //     (error) => {
  //       this.requestLoading = false;
  //       this.errorFetching = true;
  //     }
  //   );
  // }
  errorFetching;
  refreshUser() {
    this.errorFetching = false;
    // this.getUserByID();
  }

  imgUrl: string | null = null;
  // imgUrl: string | null = '/assets/Images/Rectangle 136.png';
  uploadProgress: number = 0;
  uploadRequestLoading: boolean = false;

  initForm() {
    this.form = this.fb.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      address: ['', Validators.required],
      city: [''],
      postalCode: [''],
      phoneNumber: [null, Validators.required],
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

  updateProfile(): void {
   
    this.submitted = true;
    if (this.form.valid) {
       this.UpdateStart.emit();
      this.authService
        .updateUserById(this.userDetails?._id, this.form.value)
        .subscribe((data) => {
          if (data?.status) {
            localStorage.setItem('spa-userData', JSON.stringify(data?.data));
            this.submitted = false;
            this.userDetails = data['data'];
              if (this.userDetails) {
                this.form.patchValue(this.userDetails);
              }
            this.UpdateSuccess.emit();
            this.notify.success('Profile Updated Successfully', 4000);
            // this.getUserByID();
          }
        });
    }
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