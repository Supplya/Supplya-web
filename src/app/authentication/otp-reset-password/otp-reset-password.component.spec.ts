import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpResetPasswordComponent } from './otp-reset-password.component';

describe('OtpResetPasswordComponent', () => {
  let component: OtpResetPasswordComponent;
  let fixture: ComponentFixture<OtpResetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtpResetPasswordComponent]
    });
    fixture = TestBed.createComponent(OtpResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
