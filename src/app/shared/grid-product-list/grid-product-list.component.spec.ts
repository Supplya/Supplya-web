import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridProductListComponent } from './grid-product-list.component';

describe('GridProductListComponent', () => {
  let component: GridProductListComponent;
  let fixture: ComponentFixture<GridProductListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridProductListComponent]
    });
    fixture = TestBed.createComponent(GridProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
