import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-rfid-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rfid-status.html',
  styleUrl: './rfid-status.scss'
})
export class RfidStatusComponent {
  public dataService = inject(DataService);
  
  rfidStatus = this.dataService.rfidStatus;
  lastUpdate = this.dataService.lastUpdate;
  isLoading = this.dataService.isLoading;

  // ❌ REMOVED: onToggleClick function - no interactions needed
}