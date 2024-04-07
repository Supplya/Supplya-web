import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetOfflineComponent } from './internet-offline.component';

describe('InternetOfflineComponent', () => {
  let component: InternetOfflineComponent;
  let fixture: ComponentFixture<InternetOfflineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternetOfflineComponent]
    });
    fixture = TestBed.createComponent(InternetOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
