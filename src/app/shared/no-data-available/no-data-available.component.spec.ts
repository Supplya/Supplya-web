import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataAvailableComponent } from './no-data-available.component';

describe('NoDataAvailableComponent', () => {
  let component: NoDataAvailableComponent;
  let fixture: ComponentFixture<NoDataAvailableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoDataAvailableComponent]
    });
    fixture = TestBed.createComponent(NoDataAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
