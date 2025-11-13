import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfidStatusComponent } from './rfid-status';

describe('RfidStatus', () => {
  let component: RfidStatusComponent;
  let fixture: ComponentFixture<RfidStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfidStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfidStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
