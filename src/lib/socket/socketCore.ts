
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
    transports: ['websocket'],
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
    
    this.url = url;
    
    try {
      this.socket = io(url, this.socketOptions);
      
      this.socket.on('connect', () => {
        console.log('[Socket] Connected to server');
        this._connected = true;
        this.notifyListeners('connection:status', { connected: true });
        toast.success('Połączono z serwerem');
        
        // Log connection information
        console.log('[Socket] Connection established:', {
          id: this.socket?.id,
          transport: this.socket?.io?.engine?.transport?.name
        });
      });
      
      this.socket.on('disconnect', () => {
        console.log('[Socket] Disconnected from server');
        this._connected = false;
        this.notifyListeners('connection:status', { connected: false });
        toast.error('Utracono połączenie z serwerem');
      });
      
      this.socket.on('connect_error', (error: Error) => {
        console.error('[Socket] Connection error:', error);
        this._connected = false;
        this.notifyListeners('connection:error', { message: error.message });
        toast.error(`Błąd połączenia: ${error.message}`);
        
        // Write to error log
        this.logError('connection_error', error);
      });
      
      // Set up Discord Game Show specific event handlers
      this.registerDiscordGameShowEvents();
      
      this.socket.connect();
    } catch (error) {
      console.error('[Socket] Failed to initialize:', error);
      toast.error('Nie można nawiązać połączenia z serwerem');
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
        return;
      }
      this.initialize(this.url);
      return;
    }
    
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }
  
  // Disconnect from the server
  public disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
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
