
// Import the socket core service
import socketCore from './socket/socketCore';

// Re-export the types with proper TypeScript syntax
export type { SocketEvent, SocketPayloads } from './socket/socketTypes';

// Create a service object with all the methods we need
const socketService = {
  // Core methods
  init: socketCore.init.bind(socketCore),
  connect: socketCore.connect.bind(socketCore),
  disconnect: socketCore.disconnect.bind(socketCore),
  reconnect: socketCore.reconnect.bind(socketCore),
  on: socketCore.on.bind(socketCore),
  emit: socketCore.emit.bind(socketCore),
  off: socketCore.off.bind(socketCore),
  
  // Properties via getters
  get connected() { return socketCore.connected; },
  get mockMode() { return socketCore.mockMode; },
  set mockMode(value: boolean) { socketCore.mockMode = value; },
  
  // Additional utility methods
  setMockMode: (enabled: boolean) => {
    socketCore.mockMode = enabled;
  },
  
  getUrl: () => {
    return socketCore.getUrl();
  }
};

// Export the service
export default socketService;
