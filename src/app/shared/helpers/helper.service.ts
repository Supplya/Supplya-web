import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

constructor() { }


getError(name: any, value: string, check?: boolean) {
  if (value === 'Phone Number' && name.status === 'INVALID') {
    return 'Invalid Phone Number';
  } else if (name.hasError('required')) {
    return `${value}`;
  } else if (check && name.hasError('pattern')) {
    return 'You have entered an invalid character';
  } else if (name.hasError('minlength')) {
    return value + ' length is too short';
  } else if (name.hasError('maxlength')) {
    return 'Invalid input';
  } else if (name.hasError('min')) {
    return 'Please enter a value more than 0';
  } else if (value === 'Email' && name.hasError('pattern')) {
    return 'Invalid ' + value;
  } else if (value === 'Phone Number' && name.hasError('pattern')) {
    return 'Invalid ' + value;
  } else if (name.hasError('NoPassswordMatch')) {
    return 'Password do not match';
  }
  return '';
}
}
