
export type WebSocketMessageType = 
  | 'QUESTION_UPDATE' 
  | 'TIMER_UPDATE' 
  | 'PLAYER_UPDATE'
  | 'CATEGORY_SELECT'
  | 'ROUND_UPDATE';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Record<WebSocketMessageType, Function[]> = {
    'QUESTION_UPDATE': [],
    'TIMER_UPDATE': [],
    'PLAYER_UPDATE': [],
    'CATEGORY_SELECT': [],
    'ROUND_UPDATE': []
  };

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(url);
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          resolve();
        };
        
        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
          // Attempt to reconnect after a delay
          setTimeout(() => {
            if (this.socket?.readyState === WebSocket.CLOSED) {
              this.connect(url);
            }
          }, 5000);
        };
        
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      this.socket = null;
    }
  }

  addListener(type: WebSocketMessageType, callback: Function): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  removeListener(type: WebSocketMessageType, callback: Function): void {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const { type, data } = message;
    
    if (this.listeners[type]) {
      this.listeners[type].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket listener for ${type}:`, error);
        }
      });
    }
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService();
