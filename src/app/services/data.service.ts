import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  
  private readonly serverIp = '192.168.100.5';
  private readonly apiBaseUrl = `http://${this.serverIp}/rfid_system`;
  
  public rfidLogs = signal<any[]>([]);
  public rfidStatus = signal<any[]>([]);
  public lastUpdate = signal<string>('Not loaded');
  public isLoading = signal<boolean>(true);
  public serverIpDisplay = signal<string>(this.serverIp);

  // Track last data state to detect changes
  private lastLogsCount = 0;

  constructor() {
    this.loadDataFromDatabase(); // Load once on startup
    
    // ✅ REAL-TIME: Check for new RFID scans every 3 seconds
    interval(3000).subscribe(() => {
      this.checkForNewScans();
    });
  }

  // Check if new RFID scans happened (lightweight check)
  private checkForNewScans() {
    this.http.get<any[]>(`${this.apiBaseUrl}/get_logs.php`).subscribe({
      next: (logs) => {
        // If log count increased, there are new scans
        if (logs.length > this.lastLogsCount) {
          console.log('🆕 New RFID scans detected!');
          this.loadDataFromDatabase(); // Refresh everything
        }
        this.lastLogsCount = logs.length;
      },
      error: (error) => {
        console.error('❌ Scan check failed:', error);
      }
    });
  }

  private loadDataFromDatabase() {
    this.isLoading.set(true);
    
    this.http.get<any[]>(`${this.apiBaseUrl}/get_logs.php`).subscribe({
      next: (logs) => {
        this.rfidLogs.set(logs);
        this.lastLogsCount = logs.length; // Update count
        this.lastUpdate.set(new Date().toLocaleTimeString());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Failed to load logs:', error);
        this.rfidLogs.set([]);
        this.isLoading.set(false);
      }
    });

    this.http.get<any[]>(`${this.apiBaseUrl}/get_status.php`).subscribe({
      next: (status) => {
        this.rfidStatus.set(status);
      },
      error: (error) => {
        console.error('❌ Failed to load status:', error);
        this.rfidStatus.set([]);
      }
    });
  }

  toggleRfidStatus(rfidTag: string, currentStatus: number) {
    const newStatus = currentStatus === 1 ? 0 : 1;
    
    console.log(`🔄 Toggling ${rfidTag}: ${currentStatus} → ${newStatus}`);
    
    this.rfidStatus.update(statuses => {
      return statuses.map(status => {
        if (status.rfid_tag === rfidTag) {
          return {
            ...status,
            is_active: newStatus,
            last_scan: new Date().toLocaleString()
          };
        }
        return status;
      });
    });

    this.http.post(`${this.apiBaseUrl}/update_status.php`, {
      rfid_tag: rfidTag,
      new_status: newStatus
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Database updated successfully');
        
        this.loadDataFromDatabase();
      },
      error: (error) => {
        console.error('❌ Database update failed:', error);
      }
    });
  }

  public refreshData() {
    this.loadDataFromDatabase();
  }
}