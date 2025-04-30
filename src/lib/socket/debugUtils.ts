
import { SocketEvent, SocketPayloads } from './socketTypes';
import { toast } from 'sonner';

export class SocketDebugUtils {
  /**
   * Debug listener to see all events
   */
  public debugAllEvents(
    onCallback: <E extends SocketEvent>(event: E, callback: (data: SocketPayloads[E]) => void) => (() => void)
  ): () => void {
    const unsubscribers: Array<() => void> = [];
    
    // Subscribe to all events
    const events: SocketEvent[] = [
      'round:start', 'round:end', 'question:show', 'question:answer', 'player:eliminate',
      'card:use', 'card:resolve', 'player:update', 'player:active', 'player:reset',
      'overlay:update', 'overlay:confetti'
    ];
    
    events.forEach(event => {
      const unsub = onCallback(event, (data) => {
        console.log(`[Socket:DEBUG] Event received: ${event}`, data);
      });
      unsubscribers.push(unsub);
    });
    
    // Return a function to unsubscribe from all debug listeners
    return () => {
      unsubscribers.forEach(unsub => unsub());
      console.log('[Socket:DEBUG] Removed all debug listeners');
    };
  }

  /**
   * Test emit a specific event for debugging
   */
  public testEmit<E extends SocketEvent>(
    event: E, 
    data: Partial<SocketPayloads[E]>,
    emitCallback: <T extends SocketEvent>(event: T, data: SocketPayloads[T]) => void
  ): void {
    console.log(`[Socket:TEST] Emitting test event: ${event}`, data);
    emitCallback(event, data as SocketPayloads[E]);
  }

  /**
   * Test the connection by sending a ping event
   */
  public testConnection(socket: any | null, connected: boolean, mockMode: boolean): void {
    if (mockMode) {
      console.log('[Socket:TEST] Connection test in mock mode - always successful');
      toast.success('Test połączenia w trybie mock - pomyślny');
      return;
    }
    
    if (!socket || !connected) {
      console.error('[Socket:TEST] Cannot test connection: Socket not connected');
      toast.error('Test połączenia nieudany - brak połączenia z serwerem');
      return;
    }
    
    // Try to send a small message to check if connection is working
    try {
      socket.emit('ping');
      toast.success('Test połączenia udany');
      console.log('[Socket:TEST] Connection test successful');
    } catch (error) {
      console.error('[Socket:TEST] Connection test failed:', error);
      toast.error('Test połączenia nieudany');
    }
  }
}

export default new SocketDebugUtils();
