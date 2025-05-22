
import { io, Socket } from 'socket.io-client';
import { SocketEvent, SocketOptions, PayloadFor } from './socketTypes';
import { toast } from 'sonner';
import debugLog from './debugUtils';

const DEFAULT_RECONNECTION_ATTEMPTS = 5;
const DEFAULT_RECONNECTION_DELAY = 2000;

class SocketCore {
  private socket: Socket | null = null;
  private _url: string = '';
  private options: SocketOptions = {};
  private reconnectionAttempts = 0;
  private maxReconnectionAttempts = DEFAULT_RECONNECTION_ATTEMPTS;
  private reconnectionDelay = DEFAULT_RECONNECTION_DELAY;
  private reconnectionTimer: NodeJS.Timeout | null = null;
  private _connected = false;
  private _mockMode = false;

  constructor() {
    // Initialize with default settings
  }

  // Getter method for url
  public getUrl(): string {
    return this._url;
  }

  // Method to initialize the socket connection
  public init(url: string, options: SocketOptions = {}): void {
    this._url = url;
    this.options = {
      reconnectionAttempts: DEFAULT_RECONNECTION_ATTEMPTS,
      reconnectionDelay: DEFAULT_RECONNECTION_DELAY,
      autoConnect: true,
      ...options,
    };

    this.maxReconnectionAttempts = this.options.reconnectionAttempts || DEFAULT_RECONNECTION_ATTEMPTS;
    this.reconnectionDelay = this.options.reconnectionDelay || DEFAULT_RECONNECTION_DELAY;

    this.connect();
  }

  // Initialize method for backward compatibility
  public initialize(url: string, options: SocketOptions = {}): void {
    this.init(url, options);
  }

  // Connect to the socket server
  public connect(): void {
    if (this._mockMode) {
      console.log('[SocketCore] Mock mode enabled, not connecting to real socket');
      this._connected = true;
      this.emit('connection:status' as SocketEvent, { connected: true });
      return;
    }

    if (!this._url) {
      console.error('[SocketCore] No URL provided for socket connection');
      return;
    }

    try {
      this.socket = io(this._url, {
        ...this.options,
        reconnection: false, // We'll handle reconnection manually
      });

      this.setupEventListeners();
      this._connected = true;
    } catch (error) {
      console.error('[SocketCore] Error connecting to socket:', error);
      this.handleReconnection();
    }
  }

  // Setup socket event listeners
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      debugLog('[SocketCore] Connected to socket server');
      this._connected = true;
      this.reconnectionAttempts = 0;
      this.emit('connection:status' as SocketEvent, { connected: true });
    });

    this.socket.on('disconnect', () => {
      debugLog('[SocketCore] Disconnected from socket server');
      this._connected = false;
      this.emit('connection:status' as SocketEvent, { connected: false });
      this.handleReconnection();
    });

    this.socket.on('connect_error', (error) => {
      debugLog('[SocketCore] Connection error:', error);
      this._connected = false;
      this.emit('connection:error' as SocketEvent, { message: error.message });
      this.handleReconnection();
    });
  }

  // Handle reconnection attempts
  private handleReconnection(): void {
    if (this.reconnectionAttempts >= this.maxReconnectionAttempts) {
      debugLog(`[SocketCore] Maximum reconnection attempts reached (${this.maxReconnectionAttempts})`);
      toast.error(`Maximum reconnection attempts reached (${this.maxReconnectionAttempts}). Try again later.`);
      this.emit('connection:error' as SocketEvent, { 
        message: `Maximum reconnection attempts reached (${this.maxReconnectionAttempts}). Try again later.` 
      });
      return;
    }

    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
    }

    this.reconnectionAttempts++;
    debugLog(`[SocketCore] Attempting to reconnect (${this.reconnectionAttempts}/${this.maxReconnectionAttempts})...`);
    
    // Use exponential backoff for reconnection delay
    const delay = this.reconnectionDelay * Math.pow(1.5, this.reconnectionAttempts - 1);
    
    this.reconnectionTimer = setTimeout(() => {
      debugLog('[SocketCore] Reconnecting...');
      this.connect();
    }, delay);
  }

  // Force a reconnection attempt
  public reconnect(): void {
    debugLog('[SocketCore] Manual reconnection requested');
    
    // Reset reconnection attempts to give a fresh start
    this.reconnectionAttempts = 0;
    
    // Close existing connection if any
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    // Clear any pending reconnection
    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
      this.reconnectionTimer = null;
    }
    
    // Connect again
    toast.info('Attempting to reconnect...');
    this.connect();
  }

  // Disconnect from the socket server
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
      this.reconnectionTimer = null;
    }
    
    this._connected = false;
  }

  // Emit an event to the socket server
  public emit<E extends SocketEvent>(event: E, payload: PayloadFor<E>): void {
    if (this._mockMode) {
      debugLog(`[SocketCore] Mock emit: ${event}`, payload);
      return;
    }

    if (!this.socket) {
      debugLog('[SocketCore] Socket not initialized, cannot emit event');
      return;
    }

    debugLog(`[SocketCore] Emitting event: ${event}`, payload);
    this.socket.emit(event as string, payload);
  }

  // Subscribe to an event from the socket server
  public on<E extends SocketEvent>(
    event: E, 
    callback: (payload: PayloadFor<E>) => void
  ): () => void {
    if (this._mockMode) {
      debugLog(`[SocketCore] Mock subscribe to: ${event}`);
      return () => {};
    }

    if (!this.socket) {
      debugLog('[SocketCore] Socket not initialized, cannot subscribe to event');
      return () => {};
    }

    debugLog(`[SocketCore] Subscribing to event: ${event}`);
    this.socket.on(event as string, callback as any);

    // Return an unsubscribe function
    return () => {
      if (this.socket) {
        debugLog(`[SocketCore] Unsubscribing from event: ${event}`);
        this.socket.off(event as string, callback as any);
      }
    };
  }

  // Unsubscribe from a specific event
  public off<E extends SocketEvent>(event: E): void {
    if (!this.socket) return;
    
    debugLog(`[SocketCore] Unsubscribing from all callbacks for event: ${event}`);
    this.socket.off(event as string);
  }

  // Enable mock mode for testing
  public enableMockMode(): void {
    this._mockMode = true;
    this._connected = true;
    debugLog('[SocketCore] Mock mode enabled');
  }

  // Disable mock mode
  public disableMockMode(): void {
    this._mockMode = false;
    debugLog('[SocketCore] Mock mode disabled');
  }

  // Get connection status
  public get connected(): boolean {
    return this._connected;
  }

  // Get mock mode status
  public get mockMode(): boolean {
    return this._mockMode;
  }

  // Setter for mock mode - making it public to allow external updates
  public set mockMode(value: boolean) {
    this._mockMode = value;
    debugLog(`[SocketCore] Mock mode ${value ? 'enabled' : 'disabled'}`);
  }
}

// Create a singleton instance
const socketCore = new SocketCore();

export default socketCore;
