import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEditProductComponent } from './vendor-edit-product.component';

describe('VendorEditProductComponent', () => {
  let component: VendorEditProductComponent;
  let fixture: ComponentFixture<VendorEditProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorEditProductComponent]
    });
    fixture = TestBed.createComponent(VendorEditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
