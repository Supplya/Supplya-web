import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniBreadcrumbComponent } from './mini-breadcrumb.component';

describe('MiniBreadcrumbComponent', () => {
  let component: MiniBreadcrumbComponent;
  let fixture: ComponentFixture<MiniBreadcrumbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniBreadcrumbComponent]
    });
    fixture = TestBed.createComponent(MiniBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
