import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfidStatus } from './rfid-status';

describe('RfidStatus', () => {
  let component: RfidStatus;
  let fixture: ComponentFixture<RfidStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfidStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfidStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
