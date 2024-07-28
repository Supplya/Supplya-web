// import {
//   Directive,
//   ElementRef,
//   OnInit,
//   Output,
//   EventEmitter,
// } from '@angular/core';

// declare const google: any;

// @Directive({
//   selector: '[appGooglePlaces]',
// })
// export class GooglePlacesDirective implements OnInit {
//   @Output() addressChange: EventEmitter<any> = new EventEmitter();

//   constructor(private el: ElementRef) {}

//   ngOnInit(): void {
//     const options = {
//       types: ['geocode'],
//       componentRestrictions: { country: 'NG' }, // Restrict results to Nigeria
//     };

//     const autocomplete = new google.maps.places.Autocomplete(
//       this.el.nativeElement,
//       options
//     );

//     autocomplete.addListener('place_changed', () => {
//       const place = autocomplete.getPlace();
//       if (place.geometry) {
//         const location = {
//           address: place.formatted_address,
//           country: this.getAddressComponent(place, 'country'),
//           state: this.getAddressComponent(place, 'administrative_area_level_1'),
//           city: this.getAddressComponent(place, 'locality'),
//           postalCode: this.getAddressComponent(place, 'postal_code'),
//           latitude: place.geometry.location.lat(),
//           longitude: place.geometry.location.lng(),
//         };
//         this.addressChange.emit(location);
//       } else {
//         console.error('No details available for input: ' + place.name);
//       }
//     });
//   }

//   private getAddressComponent(place, type: string) {
//     for (const component of place.address_components) {
//       if (component.types.includes(type)) {
//         return component.long_name;
//       }
//     }
//     return '';
//   }
// }
import {
  Directive,
  ElementRef,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

declare const google: any;

@Directive({
  selector: '[appGooglePlaces]',
})
export class GooglePlacesDirective implements OnInit {
  @Output() addressChange: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const options = {
      types: ['geocode'],
      componentRestrictions: { country: 'NG' }, // Restrict results to Nigeria
    };

    const autocomplete = new google.maps.places.Autocomplete(
      this.el.nativeElement,
      options
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          address: place.formatted_address,
          country: this.getAddressComponent(place, 'country'),
          state: this.getAddressComponent(
            place,
            'administrative_area_level_1',
            true
          ),
          city: this.getAddressComponent(place, 'locality'),
          postalCode: this.getAddressComponent(place, 'postal_code'),
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };
        this.addressChange.emit(location);
      } else {
        console.error('No details available for input: ' + place.name);
      }
    });
  }

  private getAddressComponent(place, type: string, stripStateSuffix = false) {
    for (const component of place.address_components) {
      if (component.types.includes(type)) {
        let longName = component.long_name;
        if (stripStateSuffix && longName.endsWith(' State')) {
          longName = longName.replace(' State', '');
        }
        return longName;
      }
    }
    return '';
  }
}
