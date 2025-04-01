import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMediaComponent } from './edit-media.component';

describe('EditMediaComponent', () => {
  let component: EditMediaComponent;
  let fixture: ComponentFixture<EditMediaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMediaComponent]
    });
    fixture = TestBed.createComponent(EditMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
