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
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit, AfterViewInit {

  @ViewChild('search') searchElementRef!: ElementRef;
  @ViewChild('map') mapElementRef!: ElementRef;

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
    });
  }
  userDetails: any;
  ngOnInit(): void {
    this.userDetails = this.authService.getUserCredentials();
  }

  ngAfterViewInit(): void {
    this.initializeAutocomplete();
  }

  initializeMap(): void {
    const nigeria = new google.maps.LatLng(9.0820, 8.6753);
    this.map = new google.maps.Map(this.mapElementRef.nativeElement, {
      center: nigeria,
      zoom: 6 // Adjust zoom level as needed
    });
  }

  initializeAutocomplete(): void {
    this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef?.nativeElement, {
      componentRestrictions: { country: 'NG' }
    });
    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.autocomplete.getPlace();

        if (!place.geometry) {
          // console.error("No geometry for place", place);
          return;
        }

        this.map.setCenter(place.geometry.location);
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: this.map
        });
      });
    });
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
  
}
   this.updateUserData(this.userDetails?._id, this.userDetails)
  }

  updateUserData(userId: string, userData: any): void {

    this.submitted = true;
    this.authService.updateUserById(userId, userData)
      .subscribe(
        (data) => {
          this.submitted = false;
          this.notify.success('Address Added Successfully', 4000);
          this.route.navigate([`/core/${this.userDetails.role}/dashboard`]);
        },
        
      );
  }
}
