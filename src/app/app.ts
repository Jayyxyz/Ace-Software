import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfidStatusComponent } from './components/rfid-status/rfid-status';
import { RfidLogsComponent } from './components/rfid-logs/rfid-logs';
import { DataService } from './services/data.service'; // Updated service

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RfidStatusComponent, RfidLogsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'Ace-softwares';
  public dataService = inject(DataService); 
}