import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { SocketEvent, SocketPayloads, SocketOptions } from './socketTypes';
import mockHandler from './mockHandler';
import debugUtils from './debugUtils';

class SocketCore {
  private socket: Socket | null = null;
  private listeners: Map<SocketEvent, Array<(data: any) => void>> = new Map();
  private url: string = '';
  private socketOptions: SocketOptions = {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false,
    transports: ['websocket', 'polling'], // Added polling as fallback
    cors: {
      origin: [
        'http://localhost:3000', 
        'https://discord-game-show.vercel.app'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    }
  };
  
  // Connection status
  private _connected: boolean = false;
  public get connected(): boolean {
    return this._connected;
  }
  
  // Mock mode - for development without a server
  private _mockMode: boolean = true;
  public get mockMode(): boolean {
    return this._mockMode;
  }
  public set mockMode(value: boolean) {
    this._mockMode = value;
    
    if (value) {
      this.disconnect();
      this._connected = false;
      this.notifyListeners('connection:status', { connected: false });
      console.log('[Socket] Switched to mock mode');
    }
  }

  // Initialize socket connection
  public initialize(url: string): void {
    if (this._mockMode) {
      console.log('[Socket] Mock mode active, skipping real connection');
      return;
    }
    
    // Disconnect any existing socket
    if (this.socket && this.socket.connected) {
      console.log('[Socket] Disconnecting existing socket before initialization');
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.url = url;
    
    try {
      console.log(`[Socket] Initializing connection to ${url}`);
      this.socket = io(url, this.socketOptions);
      
      // Important: Clear any existing listeners to prevent duplicates
      if (this.socket) {
        this.socket.removeAllListeners();
      }
      
      this.socket.on('connect', () => {
        console.log('[Socket] Connected to server');
        this._connected = true;
        this.notifyListeners('connection:status', { connected: true });
        
        // Log connection information
        console.log('[Socket] Connection established:', {
          id: this.socket?.id,
          transport: this.socket?.io?.engine?.transport?.name
        });
      });
      
      this.socket.on('disconnect', (reason) => {
        console.log(`[Socket] Disconnected from server: ${reason}`);
        this._connected = false;
        this.notifyListeners('connection:status', { connected: false });
        
        // Only show toast if it wasn't an intentional disconnect
        if (reason !== 'io client disconnect') {
          this.notifyListeners('connection:error', { message: `Rozłączono: ${reason}` });
        }
      });
      
      this.socket.on('connect_error', (error: Error) => {
        console.error('[Socket] Connection error:', error);
        this._connected = false;
        this.notifyListeners('connection:error', { message: error.message });
        
        // Write to error log
        this.logError('connection_error', error);
      });
      
      this.socket.on('error', (error: Error) => {
        console.error('[Socket] Socket error:', error);
        this.notifyListeners('connection:error', { message: error.message });
        this.logError('socket_error', error);
      });
      
      this.socket.io.on('reconnect_attempt', (attempt) => {
        console.log(`[Socket] Reconnection attempt ${attempt}`);
      });
      
      this.socket.io.on('reconnect_failed', () => {
        console.log('[Socket] Failed to reconnect');
        this.notifyListeners('connection:error', { message: 'Nie udało się ponownie połączyć' });
      });
      
      this.socket.io.on('reconnect', (attempt) => {
        console.log(`[Socket] Reconnected after ${attempt} attempts`);
        this._connected = true;
        this.notifyListeners('connection:status', { connected: true });
      });
      
      // Set up Discord Game Show specific event handlers
      this.registerDiscordGameShowEvents();
      
      console.log('[Socket] Attempting to connect...');
      this.socket.connect();
    } catch (error) {
      console.error('[Socket] Failed to initialize:', error);
      this.notifyListeners('connection:error', { message: error instanceof Error ? error.message : 'Unknown error' });
      this.logError('initialization_error', error as Error);
    }
  }
  
  // Register Discord Game Show specific events
  private registerDiscordGameShowEvents(): void {
    if (!this.socket) return;
    
    const discordEvents: SocketEvent[] = [
      'updatePlayer',
      'questionUpdate',
      'cardUsed',
      'elimination',
      'victory'
    ];
    
    discordEvents.forEach(event => {
      this.socket?.on(event, (data: any) => {
        console.log(`[Socket] Received Discord event: ${event}`, data);
        this.notifyListeners(event, data);
      });
    });
  }
  
  // Connect to the server
  public connect(): void {
    if (this._mockMode) {
      console.log('[Socket] Mock mode active, using mock connection');
      this._connected = true;
      this.notifyListeners('connection:status', { connected: true });
      return;
    }
    
    if (!this.socket) {
      if (!this.url) {
        console.error('[Socket] No URL provided for connection');
        this.notifyListeners('connection:error', { message: 'No URL provided for connection' });
        return;
      }
      this.initialize(this.url);
      return;
    }
    
    if (!this.socket.connected) {
      console.log('[Socket] Attempting to connect to server');
      this.socket.connect();
    } else {
      console.log('[Socket] Already connected');
    }
  }
  
  // Disconnect from the server
  public disconnect(): void {
    if (this.socket) {
      console.log('[Socket] Disconnecting from server');
      this.socket.disconnect();
      this._connected = false;
    }
  }
  
  // Subscribe to an event
  public on<E extends SocketEvent>(event: E, callback: (data: SocketPayloads[E]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
      
      // If we have a real socket and it's not a connection event, register the listener
      if (this.socket && !event.startsWith('connection:')) {
        // Fix TypeScript error by using a type assertion
        this.socket.on(event, ((data: any) => {
          this.notifyListeners(event, data as SocketPayloads[E]);
        }) as any);
      }
    }
    
    const eventListeners = this.listeners.get(event)!;
    eventListeners.push(callback as (data: any) => void);
    
    // Return an unsubscribe function
    return () => {
      const index = eventListeners.indexOf(callback as (data: any) => void);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    };
  }
  
  // Emit an event
  public emit<E extends SocketEvent>(event: E, data: SocketPayloads[E]): void {
    console.log(`[Socket] Emitting event: ${event}`, data);
    
    if (this._mockMode) {
      // In mock mode, we just route the events locally
      setTimeout(() => {
        this.notifyListeners(event, data);
        mockHandler.handleMockEvent(event, data, this.notifyListeners.bind(this));
      }, 10);
      return;
    }
    
    if (this.socket && this._connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`[Socket] Cannot emit event ${event}: Socket not connected`);
      // For specific events, we might want to buffer them and send later when connected
    }
  }
  
  // Notify all listeners for an event
  private notifyListeners<E extends SocketEvent>(event: E, data: SocketPayloads[E]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[Socket] Error in listener for event ${event}:`, error);
          this.logError(`listener_error_${event}`, error as Error);
        }
      });
    }
  }

  // Log error to console and file if possible
  private logError(type: string, error: Error): void {
    const errorMessage = `[${new Date().toISOString()}][${type}] ${error.message}\n${error.stack || ''}`;
    
    // Log to console
    console.error(errorMessage);
    
    // In a real application, we would also log to a file
    // For now we just create a structured error object that could be sent to a logging service
    const errorLog = {
      timestamp: new Date().toISOString(),
      type,
      message: error.message,
      stack: error.stack,
      socketId: this.socket?.id
    };
    
    // We could send this to a logging endpoint or service
    console.debug('[Socket] Error logged:', errorLog);
  }

  // Check if socket can connect to a server
  public checkConnectivity(url: string = this.url): Promise<boolean> {
    return new Promise((resolve) => {
      // Use fetch to check if the server is reachable
      fetch(`${url}/health-check`, { 
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(() => {
          console.log('[Socket] Server is reachable');
          resolve(true);
        })
        .catch((error) => {
          console.error('[Socket] Server is not reachable:', error);
          resolve(false);
        });
    });
  }

  // Debug methods
  public get debug() {
    return {
      testEmit: <E extends SocketEvent>(event: E, data: Partial<SocketPayloads[E]>): void => {
        debugUtils.testEmit(event, data, this.emit.bind(this));
      },
      
      debugAllEvents: (): (() => void) => {
        return debugUtils.debugAllEvents(this.on.bind(this));
      },
      
      testConnection: (): void => {
        debugUtils.testConnection(this.socket, this._connected, this._mockMode);
      }
    };
  }
}

// Create a singleton instance
export const socketCore = new SocketCore();

// Export default for convenience
export default socketCore;
