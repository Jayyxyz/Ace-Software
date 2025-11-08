import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-rfid-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rfid-logs.html',
  styleUrl: './rfid-logs.scss'
})
export class RfidLogsComponent {
  private dataService = inject(DataService);
  
  rfidLogs = this.dataService.rfidLogs;
  isLoading = this.dataService.isLoading;
  lastUpdate = this.dataService.lastUpdate;
}