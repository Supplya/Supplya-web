import { Component, ElementRef, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { AuthService } from '../service/auth.service';
import { ToastyService } from 'ng-toasty';

declare const google: any; // Declare the google variable

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit, AfterViewInit {
  @ViewChild('search', { static: false }) searchElementRef!: ElementRef;
  @ViewChild('mapElement', { static: false }) mapElementRef!: ElementRef;

  map!: any; // Use 'any' type for map variable
  autocomplete: any; // Autocomplete variable

  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;
  mapVisible: boolean = false; // Track whether the map should be visible

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private helperService: HelperService,
    private route: Router,
    private authService: AuthService,
    private notify: ToastyService
  ) {
    this.form = this.fb.group({
      country: ['Nigeria', [Validators.required]],
      address: ['', [Validators.required]],
      state: [''],
    });
  }
  userDetails: any;
  ngOnInit(): void {
    this.userDetails = this.authService.getUserCredentials();
  }

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

  getErrorMessage(control: string, message: string) {
    return this.helperService.getError(this.form.get(control), message);
  }

  isInvalid(control: string) {
    return (
      (this.form.get(control)?.touched && this.form.get(control)?.invalid) ||
      (this.submitted && this.form.get(control)?.invalid)
    );
  }

  onSubmitLocation() {
    this.submitted = true;
    if (this.form.valid) {
      this.userDetails.country = 'Nigeria';
      this.userDetails.address = this.address;
      this.userDetails.state = this.state;
      this.updateUserData(this.userDetails?._id, this.userDetails);
    }
  }

  updateUserData(userId: string, userData: any): void {
    this.submitted = true;
    this.authService.updateUserById(userId, userData).subscribe((data) => {
      this.submitted = false;
      this.notify.success('Address Added Successfully', 4000);
      this.route.navigate([`/core/${this.userDetails.role}/dashboard`]);
    });
  }
}
