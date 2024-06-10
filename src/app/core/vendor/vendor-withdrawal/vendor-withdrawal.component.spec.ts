import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorWithdrawalComponent } from './vendor-withdrawal.component';

describe('VendorWithdrawalComponent', () => {
  let component: VendorWithdrawalComponent;
  let fixture: ComponentFixture<VendorWithdrawalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorWithdrawalComponent]
    });
    fixture = TestBed.createComponent(VendorWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
