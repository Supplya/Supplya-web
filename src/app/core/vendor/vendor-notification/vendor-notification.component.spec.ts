import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorNotificationComponent } from './vendor-notification.component';

describe('VendorNotificationComponent', () => {
  let component: VendorNotificationComponent;
  let fixture: ComponentFixture<VendorNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorNotificationComponent]
    });
    fixture = TestBed.createComponent(VendorNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
