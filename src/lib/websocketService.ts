
import socketService, { SocketEvent, SocketPayloads } from './socketService';

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

// This WebSocketService is now a wrapper around our new socketService 
// to maintain backward compatibility
class WebSocketService {
  private listeners: Record<WebSocketMessageType, Function[]> = {
    'QUESTION_UPDATE': [],
    'TIMER_UPDATE': [],
    'PLAYER_UPDATE': [],
    'CATEGORY_SELECT': [],
    'ROUND_UPDATE': []
  };

  // Map old event types to new socket events
  private eventMapping: Record<WebSocketMessageType, SocketEvent> = {
    'QUESTION_UPDATE': 'question:show',
    'TIMER_UPDATE': 'overlay:update',
    'PLAYER_UPDATE': 'player:update',
    'CATEGORY_SELECT': 'overlay:update',
    'ROUND_UPDATE': 'round:start'
  };

  connect(url: string): Promise<void> {
    return new Promise((resolve) => {
      // Initialize the new socketService
      socketService.initialize(url);
      
      // Set up listeners for the new socketService to route to old listeners
      this.setupSocketListeners();
      
      // Resolve immediately to maintain backward compatibility
      resolve();
    });
  }

  private setupSocketListeners(): void {
    // Listen to question:show events and convert to QUESTION_UPDATE
    socketService.on('question:show', (data) => {
      this.handleMessage({
        type: 'QUESTION_UPDATE',
        data: data.question
      });
    });

    // Listen to overlay:update events for timer updates
    socketService.on('overlay:update', (data) => {
      if (data.timeRemaining !== undefined) {
        this.handleMessage({
          type: 'TIMER_UPDATE',
          data: { time: data.timeRemaining }
        });
      }
      
      if (data.category !== undefined) {
        this.handleMessage({
          type: 'CATEGORY_SELECT',
          data: {
            category: data.category,
            difficulty: data.difficulty || 10
          }
        });
      }
    });

    // Listen to player:update events
    socketService.on('player:update', (data) => {
      this.handleMessage({
        type: 'PLAYER_UPDATE',
        data: data.player
      });
    });

    // Listen to round:start events
    socketService.on('round:start', (data) => {
      this.handleMessage({
        type: 'ROUND_UPDATE',
        data: { title: data.roundName }
      });
    });
  }

  disconnect(): void {
    socketService.disconnect();
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

// For backward compatibility
export default websocketService;
