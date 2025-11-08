import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as mqtt from 'mqtt';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private client: mqtt.MqttClient | null = null;
  private http = inject(HttpClient);
  
  // ✅ UPDATE THESE WITH SERVER LAPTOP'S IP
  private readonly serverIp = '192.168.1.15'; // Server laptop IP
  private readonly brokerUrl = `ws://${this.serverIp}:9001`;
  private readonly apiBaseUrl = `http://${this.serverIp}/rfid_system`;
  private readonly topic = 'RFID_LOGIN';
  
  public rfidLogs = signal<any[]>([]);
  public rfidStatus = signal<any[]>([]);
  public connectionStatus = signal<'connected' | 'disconnected' | 'error'>('disconnected');
  public lastUpdate = signal<string>('Not connected');
  public isLoading = signal<boolean>(true);
  public serverIpDisplay = signal<string>(this.serverIp);
  public refreshData() {
    this.loadDataFromDatabase();
  }

  constructor() {
    console.log('🚀 Connecting to server:', this.serverIp);
    this.initializeMQTT();
    this.startAutoRefresh();
  }

  private initializeMQTT() {
    try {
      console.log(`🔌 Connecting to MQTT at: ${this.brokerUrl}`);
      this.client = mqtt.connect(this.brokerUrl);
      
      this.client.on('connect', () => {
        console.log('✅ Connected to MQTT broker on server laptop');
        this.connectionStatus.set('connected');
        this.client!.subscribe(this.topic);
        this.loadDataFromDatabase();
      });

      this.client.on('message', (topic, message) => {
        const payload = message.toString();
        console.log(`📨 MQTT from server: ${payload}`);
        
        if (payload === '1' || payload === '0') {
          setTimeout(() => this.loadDataFromDatabase(), 1000);
        }
      });

      this.client.on('error', (error) => {
        console.error('❌ MQTT connection failed:', error);
        this.connectionStatus.set('error');
      });

    } catch (error) {
      console.error('❌ MQTT initialization failed:', error);
      this.connectionStatus.set('error');
    }
  }

  private startAutoRefresh() {
    interval(3000).subscribe(() => {
      if (this.connectionStatus() === 'connected') {
        this.loadDataFromDatabase();
      }
    });
  }

  private loadDataFromDatabase() {
    this.isLoading.set(true);
    console.log(`🔄 Loading from server: ${this.apiBaseUrl}`);
    
    // Load logs
    this.http.get<any[]>(`${this.apiBaseUrl}/get_logs.php`).subscribe({
      next: (logs) => {
        console.log(`✅ Loaded ${logs.length} logs from server`);
        this.rfidLogs.set(logs);
        this.lastUpdate.set(new Date().toLocaleTimeString());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Failed to load logs from server:', error);
        this.rfidLogs.set([]);
        this.isLoading.set(false);
      }
    });

    // Load status
    this.http.get<any[]>(`${this.apiBaseUrl}/get_status.php`).subscribe({
      next: (status) => {
        console.log(`✅ Loaded ${status.length} status entries from server`);
        this.rfidStatus.set(status);
      },
      error: (error) => {
        console.error('❌ Failed to load status from server:', error);
        this.rfidStatus.set([]);
      }
    });
  }

}