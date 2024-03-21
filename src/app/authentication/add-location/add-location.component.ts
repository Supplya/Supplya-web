import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
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
export class AddLocationComponent implements OnInit {

  @ViewChild('search') searchElementRef!: ElementRef;
  @ViewChild('map') mapElementRef!: ElementRef;

  map!: any; // Use 'any' type for map variable

  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;

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

  ngAfterViewInit() {
    // Set initial center to Lagos
    const lagos = new google.maps.LatLng(6.5244, 3.3792);

    // Initialize map
    this.map = new google.maps.Map(this.mapElementRef.nativeElement, {
      center: lagos,
      zoom: 12 // Adjust zoom level as needed
    });

    // Initialize autocomplete without specifying administrative area
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      componentRestrictions: { country: 'NG' }
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        console.log(place);
      });
    });
  }
  

  ngOnInit(): void {
    // Implement ngOnInit if necessary
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
}
