import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastPaymentsComponent } from './last-payments.component';

describe('LastPaymentsComponent', () => {
  let component: LastPaymentsComponent;
  let fixture: ComponentFixture<LastPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
