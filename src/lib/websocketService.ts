
import socketCore from './socket/socketCore';
import { toast } from 'sonner';
import debugLog from './socket/debugUtils';

// Base WebSocket URL, can be overridden in environment
const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3001';

// Initialize and export WebSocket service
const websocketService = {
  /**
   * Initialize the WebSocket connection
   * @param mockMode Enable mock mode for development without a real server
   */
  init: (mockMode = false) => {
    try {
      if (mockMode) {
        debugLog('WebSocket initializing in mock mode');
        socketCore.mockMode = true;
        return;
      }

      socketCore.init(WS_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        autoConnect: true,
        transports: ['websocket', 'polling']
      });
      
      debugLog(`WebSocket initialized with URL: ${WS_URL}`);
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      toast.error('Failed to initialize WebSocket connection');
    }
  },

  /**
   * Get the connection status
   */
  isConnected: () => {
    return socketCore.connected;
  },

  /**
   * Force a reconnection attempt
   */
  reconnect: () => {
    socketCore.reconnect();
    toast.info('Attempting to reconnect WebSocket...');
  },

  /**
   * Enable or disable mock mode
   */
  setMockMode: (enabled: boolean) => {
    socketCore.mockMode = enabled;
    
    if (enabled) {
      toast.success('WebSocket mock mode enabled');
    } else {
      toast.info('WebSocket mock mode disabled, using real connection');
      socketCore.reconnect();
    }
  }
};

export default websocketService;
