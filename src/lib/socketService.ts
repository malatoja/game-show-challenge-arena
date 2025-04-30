
import socketCore from './socket/socketCore';
export { SocketEvent, SocketPayloads } from './socket/socketTypes';

// Re-export the core service with all its methods
const socketService = socketCore;

// Export for backward compatibility and convenience
export default socketService;
