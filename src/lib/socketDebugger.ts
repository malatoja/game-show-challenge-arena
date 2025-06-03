
import socketCore from './socket/socketCore';
import { SocketEvent } from './socket/socketTypes';

interface EventLog {
  timestamp: number;
  type: 'emit' | 'receive';
  event: string;
  payload: any;
}

class SocketDebugger {
  private enabled: boolean = false;
  private eventLogs: EventLog[] = [];
  private maxLogs: number = 100;

  // Enable the debugger
  public enable(): void {
    this.enabled = true;
    console.log('[SocketDebugger] Enabled');
  }

  // Disable the debugger
  public disable(): void {
    this.enabled = false;
    console.log('[SocketDebugger] Disabled');
  }

  // Log an emitted event
  public logEmit(event: SocketEvent, payload: any): void {
    if (!this.enabled) return;

    this.addLog({
      timestamp: Date.now(),
      type: 'emit',
      event,
      payload
    });

    console.log(`[SOCKET EMIT] ${event}`, payload);
  }

  // Log a received event
  public logReceive(event: SocketEvent, payload: any): void {
    if (!this.enabled) return;

    this.addLog({
      timestamp: Date.now(),
      type: 'receive',
      event,
      payload
    });

    console.log(`[SOCKET RECEIVE] ${event}`, payload);
  }

  // Add a log entry and maintain the maximum log size
  private addLog(log: EventLog): void {
    this.eventLogs.unshift(log);
    
    // Trim the log array if it exceeds the maximum size
    if (this.eventLogs.length > this.maxLogs) {
      this.eventLogs = this.eventLogs.slice(0, this.maxLogs);
    }
  }

  // Get all logs
  public getLogs(): EventLog[] {
    return [...this.eventLogs];
  }

  // Clear all logs
  public clearLogs(): void {
    this.eventLogs = [];
    console.log('[SocketDebugger] Logs cleared');
  }

  // Get connection status
  public getConnectionStatus(): { connected: boolean; mockMode: boolean } {
    return {
      connected: socketCore.connected,
      mockMode: socketCore.mockMode
    };
  }

  // Get connection info
  public getConnectionInfo(): { url: string } {
    return {
      url: socketCore.getUrl()
    };
  }

  // Force reconnect
  public forceReconnect(): void {
    socketCore.reconnect();
    console.log('[SocketDebugger] Forced reconnection');
  }
}

// Create a singleton instance
const socketDebugger = new SocketDebugger();

export default socketDebugger;
