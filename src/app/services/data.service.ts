import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  
  private readonly serverIp = '10.89.255.120';
  private readonly apiBaseUrl = `http://${this.serverIp}/rfid_system`;
  
  public rfidLogs = signal<any[]>([]);
  public rfidStatus = signal<any[]>([]);
  public lastUpdate = signal<string>('Not loaded');
  public isLoading = signal<boolean>(true);
  public serverIpDisplay = signal<string>(this.serverIp);

  constructor() {
    this.loadDataFromDatabase(); // Load once on startup
    
    // ✅ SIMPLE AUTO-REFRESH: Refresh all data every 3 seconds
    interval(1000).subscribe(() => {
      console.log('🔄 Auto-refreshing data...');
      this.loadDataFromDatabase();
    });
  }

  private loadDataFromDatabase() {
    this.isLoading.set(true);
    
    // Load RFID logs
    this.http.get<any[]>(`${this.apiBaseUrl}/get_logs.php`).subscribe({
      next: (logs) => {
        this.rfidLogs.set(logs);
        this.lastUpdate.set(new Date().toLocaleTimeString());
        this.isLoading.set(false);
        console.log('✅ Logs loaded:', logs.length, 'items');
      },
      error: (error) => {
        console.error('❌ Failed to load logs:', error);
        this.rfidLogs.set([]);
        this.isLoading.set(false);
      }
    });

    // Load RFID status
    this.http.get<any[]>(`${this.apiBaseUrl}/get_status.php`).subscribe({
      next: (status) => {
        this.rfidStatus.set(status);
        console.log('✅ Status loaded:', status.length, 'items');
      },
      error: (error) => {
        console.error('❌ Failed to load status:', error);
        this.rfidStatus.set([]);
      }
    });
  }
  public refreshData() {
    this.loadDataFromDatabase();
  }
}