import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherProductTypesComponent } from './other-product-types.component';

describe('OtherProductTypesComponent', () => {
  let component: OtherProductTypesComponent;
  let fixture: ComponentFixture<OtherProductTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherProductTypesComponent]
    });
    fixture = TestBed.createComponent(OtherProductTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
