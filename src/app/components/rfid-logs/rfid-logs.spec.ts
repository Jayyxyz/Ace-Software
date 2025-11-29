import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfidLogsComponent } from './rfid-logs'; 

describe('RfidLogs', () => {
  let component: RfidLogsComponent;
  let fixture: ComponentFixture<RfidLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfidLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfidLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
