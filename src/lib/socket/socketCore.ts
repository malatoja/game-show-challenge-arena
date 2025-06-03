
interface MockSocket {
  connected: boolean;
  mockMode: boolean;
  callbacks: Map<string, Function[]>;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: Function) => () => void;
  disconnect: () => void;
  reconnect: () => void;
  init: (url: string, options: any) => void;
}

class SocketCore implements MockSocket {
  connected = false;
  mockMode = true; // Default to mock mode since we don't have a real server
  callbacks = new Map<string, Function[]>();
  private socket: any = null;

  init(url: string, options: any) {
    if (this.mockMode) {
      this.connected = true;
      this.emit('connection:status', { connected: true });
      return;
    }

    // Real WebSocket implementation would go here
    try {
      // For now, just simulate connection
      setTimeout(() => {
        this.connected = true;
        this.emit('connection:status', { connected: true });
      }, 100);
    } catch (error) {
      this.emit('connection:error', { message: 'Failed to connect' });
    }
  }

  emit(event: string, data: any) {
    if (this.mockMode) {
      console.log('Mock emit:', event, data);
      
      // Simulate some responses for testing
      if (event === 'player:connected') {
        setTimeout(() => {
          this.trigger('player:update', {
            player: {
              id: data.playerId,
              name: data.name,
              points: 0,
              lives: 3
            }
          });
        }, 100);
      }
      
      return;
    }

    // Real socket emit would go here
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: Function): () => void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private trigger(event: string, data: any) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  disconnect() {
    this.connected = false;
    if (this.socket) {
      this.socket.disconnect();
    }
    this.emit('connection:status', { connected: false });
  }

  reconnect() {
    if (this.mockMode) {
      this.connected = true;
      this.emit('connection:status', { connected: true });
      return;
    }
    
    // Real reconnection logic would go here
  }
}

const socketCore = new SocketCore();
export default socketCore;
