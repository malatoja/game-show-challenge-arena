import { SocketEvent, SocketPayloads } from './socketTypes';
import { toast } from 'sonner';

export class MockHandler {
  /**
   * Handle mock events locally to simulate server behavior
   */
  public handleMockEvent<E extends SocketEvent>(
    event: E, 
    data: SocketPayloads[E], 
    notifyListeners: <T extends SocketEvent>(event: T, data: SocketPayloads[T]) => void
  ): void {
    switch (event) {
      case 'round:start':
        console.log('[Mock] Round started:', (data as SocketPayloads['round:start']).roundType);
        // Broadcast to all listeners
        notifyListeners('overlay:update', { 
          question: undefined,
          activePlayerId: undefined,
        });
        break;
        
      case 'question:show':
        console.log('[Mock] Question shown:', (data as SocketPayloads['question:show']).question?.text);
        // Forward to overlay
        notifyListeners('overlay:update', { 
          question: (data as SocketPayloads['question:show']).question 
        });
        break;
        
      case 'player:active':
        console.log('[Mock] Active player changed:', (data as SocketPayloads['player:active']).playerId);
        // Forward to overlay
        notifyListeners('overlay:update', { 
          activePlayerId: (data as SocketPayloads['player:active']).playerId 
        });
        break;
        
      case 'card:use':
        const cardData = data as SocketPayloads['card:use'];
        console.log('[Mock] Card used:', cardData.cardType, 'by player:', cardData.playerId);
        // Auto-resolve the card after a short delay
        setTimeout(() => {
          notifyListeners('card:resolve', {
            playerId: cardData.playerId,
            cardType: cardData.cardType,
            success: true
          });
        }, 500);
        break;
        
      case 'player:eliminate':
        console.log('[Mock] Player eliminated:', (data as SocketPayloads['player:eliminate']).playerId);
        break;
        
      default:
        // Other events don't need special mock handling
        break;
    }
  }
}

export default new MockHandler();
