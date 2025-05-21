
/**
 * SocketDebugger - A utility to help debug WebSocket connections
 * This can be used to log all socket events, check connection status,
 * and test websocket connectivity.
 */

import socketService, { SocketEvent } from './socketService';
import { toast } from 'sonner';

class SocketDebugger {
  private enabled: boolean = false;
  private logHistory: Array<{
    timestamp: Date;
    type: 'sent' | 'received' | 'error' | 'info';
    event?: SocketEvent;
    data?: any;
    message?: string;
  }> = [];
  private unsubscribeFunctions: Array<() => void> = [];

  constructor() {
    // Initialize with debugging disabled by default
    if (import.meta.env.DEV) {
      this.enabled = localStorage.getItem('socketDebug') === 'true';
    }
  }

  // Enable or disable the debugger
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem('socketDebug', enabled.toString());
    
    if (enabled) {
      this.startListening();
      this.log('info', undefined, undefined, 'Socket debugging enabled');
      toast.info('Socket debugging enabled');
    } else {
      this.stopListening();
      this.log('info', undefined, undefined, 'Socket debugging disabled');
    }
  }

  // Check if debugging is enabled
  public isEnabled(): boolean {
    return this.enabled;
  }

  // Listen to all socket events
  private startListening(): void {
    // Clean up any existing listeners first
    this.stopListening();
    
    // Listen for connection status changes
    this.unsubscribeFunctions.push(
      socketService.on('connection:status', (data) => {
        this.log('received', 'connection:status', data);
      })
    );
    
    // Listen for errors
    this.unsubscribeFunctions.push(
      socketService.on('connection:error', (data) => {
        this.log('error', 'connection:error', data);
      })
    );
    
    // Add a monkey patch to capture all emitted events
    const originalEmit = socketService.emit;
    socketService.emit = <E extends SocketEvent>(event: E, data: any) => {
      this.log('sent', event, data);
      return originalEmit.call(socketService, event, data);
    };
    
    // Store this function to restore the original emit later
    this.unsubscribeFunctions.push(() => {
      socketService.emit = originalEmit;
    });
    
    // Log that we started listening
    this.log('info', undefined, undefined, 'Started listening to all socket events');
  }

  // Stop listening to all socket events
  private stopListening(): void {
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    this.unsubscribeFunctions = [];
    
    this.log('info', undefined, undefined, 'Stopped listening to all socket events');
  }

  // Log a socket event
  private log(
    type: 'sent' | 'received' | 'error' | 'info',
    event?: SocketEvent,
    data?: any,
    message?: string
  ): void {
    const logEntry = {
      timestamp: new Date(),
      type,
      event,
      data,
      message
    };
    
    this.logHistory.push(logEntry);
    
    // Trim history if it gets too large
    if (this.logHistory.length > 1000) {
      this.logHistory = this.logHistory.slice(-500);
    }
    
    // Only output to console if debugging is enabled
    if (this.enabled) {
      const prefix = `[Socket][${type.toUpperCase()}]`;
      if (event) {
        console.log(`${prefix} ${event}`, data || '');
      } else if (message) {
        console.log(`${prefix} ${message}`);
      }
    }
  }

  // Get the log history
  public getLogHistory(): Array<{
    timestamp: Date;
    type: 'sent' | 'received' | 'error' | 'info';
    event?: SocketEvent;
    data?: any;
    message?: string;
  }> {
    return [...this.logHistory];
  }

  // Clear the log history
  public clearLogHistory(): void {
    this.logHistory = [];
    this.log('info', undefined, undefined, 'Log history cleared');
  }

  // Test the socket connection
  public async testConnection(url?: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const connected = await socketService.checkConnectivity(url);
      
      if (connected) {
        this.log('info', undefined, undefined, 'Connection test successful');
        return {
          success: true,
          message: 'Connection test successful. Server is reachable.'
        };
      } else {
        this.log('error', undefined, undefined, 'Connection test failed');
        return {
          success: false,
          message: 'Connection test failed. Server is not reachable.'
        };
      }
    } catch (error) {
      this.log('error', undefined, undefined, `Connection test error: ${error}`);
      return {
        success: false,
        message: 'Connection test error',
        details: error
      };
    }
  }

  // Check the current connection status
  public checkStatus(): {
    connected: boolean;
    mockMode: boolean;
    url?: string;
  } {
    return {
      connected: socketService.connected,
      mockMode: socketService.mockMode,
      url: socketService.url
    };
  }

  // Test send a specific event
  public testSendEvent<E extends SocketEvent>(
    event: E,
    data: any
  ): void {
    this.log('info', event, data, 'Manually sending test event');
    socketService.emit(event, data);
  }
}

// Create a singleton instance
export const socketDebugger = new SocketDebugger();

// Export for convenience
export default socketDebugger;
