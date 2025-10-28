import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfidLogs } from './rfid-logs';

describe('RfidLogs', () => {
  let component: RfidLogs;
  let fixture: ComponentFixture<RfidLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfidLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfidLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
