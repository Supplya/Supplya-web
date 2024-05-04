import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formatCurrency]',
})
export class CurrencyFormatDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let inputVal: string = event.target.value;
    const unformattedVal: string = inputVal.replace(/\D/g, ''); // Store unformatted value
    this.control!.control!.setValue(unformattedVal); // Set unformatted value to control
    const formattedVal = this.formatCurrency(unformattedVal);
    this.el.nativeElement.value = formattedVal;
  }

  private formatCurrency(value: string): string {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue)) {
      return this.formatWithCommas(numberValue);
    }
    return value;
  }

  private formatWithCommas(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
