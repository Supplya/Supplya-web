import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAddNewProductComponent } from './vendor-add-new-product.component';

describe('VendorAddNewProductComponent', () => {
  let component: VendorAddNewProductComponent;
  let fixture: ComponentFixture<VendorAddNewProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorAddNewProductComponent]
    });
    fixture = TestBed.createComponent(VendorAddNewProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
