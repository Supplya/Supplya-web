import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopProductComponent } from './shop-product.component';

describe('ShopProductComponent', () => {
  let component: ShopProductComponent;
  let fixture: ComponentFixture<ShopProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopProductComponent]
    });
    fixture = TestBed.createComponent(ShopProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
