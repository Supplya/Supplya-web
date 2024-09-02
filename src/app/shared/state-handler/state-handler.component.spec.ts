import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateHandlerComponent } from './state-handler.component';

describe('StateHandlerComponent', () => {
  let component: StateHandlerComponent;
  let fixture: ComponentFixture<StateHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateHandlerComponent]
    });
    fixture = TestBed.createComponent(StateHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
