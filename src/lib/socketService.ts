
// Import the socket core service
import socketCore from './socket/socketCore';

// Re-export the types with proper TypeScript syntax
export type { SocketEvent, SocketPayloads } from './socket/socketTypes';

// Re-export the core service with all its methods
const socketService = socketCore;

// Export for backward compatibility and convenience
export default socketService;
