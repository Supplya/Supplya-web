import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorWalletComponent } from './vendor-wallet.component';

describe('VendorWalletComponent', () => {
  let component: VendorWalletComponent;
  let fixture: ComponentFixture<VendorWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorWalletComponent]
    });
    fixture = TestBed.createComponent(VendorWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
