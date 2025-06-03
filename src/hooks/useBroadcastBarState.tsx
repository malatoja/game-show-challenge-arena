
import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { SocketEvent } from '@/lib/socketService';

export interface BroadcastBarState {
  broadcastBarText: string;
  broadcastBarEnabled: boolean;
  broadcastBarPosition: 'top' | 'bottom';
  broadcastBarColor: string;
  broadcastBarTextColor: string;
  broadcastBarAnimation: 'slide' | 'fade' | 'static';
  broadcastBarSpeed: number;
}

export function useBroadcastBarState(demoMode: boolean) {
  const [broadcastBarText, setBroadcastBarText] = useState('Witamy w Quiz Show! Trwa runda wiedzy');
  const [broadcastBarEnabled, setBroadcastBarEnabled] = useState(true);
  const [broadcastBarPosition, setBroadcastBarPosition] = useState<'top' | 'bottom'>('bottom');
  const [broadcastBarColor, setBroadcastBarColor] = useState('#000000');
  const [broadcastBarTextColor, setBroadcastBarTextColor] = useState('#ffffff');
  const [broadcastBarAnimation, setBroadcastBarAnimation] = useState<'slide' | 'fade' | 'static'>('slide');
  const [broadcastBarSpeed, setBroadcastBarSpeed] = useState(5);
  
  const { on } = useSocket();
  
  // Load broadcast bar settings from storage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('infoBarSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setBroadcastBarEnabled(settings.enabled ?? true);
        setBroadcastBarText(settings.text || broadcastBarText);
        setBroadcastBarAnimation(settings.animation || 'slide');
        setBroadcastBarSpeed(settings.scrollSpeed || 5);
        setBroadcastBarPosition(settings.position || 'bottom');
        setBroadcastBarColor(settings.backgroundColor || '#000000');
        setBroadcastBarTextColor(settings.textColor || '#ffffff');
      }
    } catch (error) {
      console.error('Error loading broadcast bar settings:', error);
    }
  }, []);
  
  // Listen for broadcast bar updates
  useEffect(() => {
    if (demoMode) return;

    const unsubscribe = on('infoBar:update' as SocketEvent, (data: any) => {
      console.log('InfoBar update received:', data);
      
      if (data.text !== undefined) {
        setBroadcastBarText(data.text);
      }
      
      if (data.enabled !== undefined) {
        setBroadcastBarEnabled(data.enabled);
      }
      
      if (data.position !== undefined) {
        setBroadcastBarPosition(data.position);
      }
      
      if (data.backgroundColor !== undefined) {
        setBroadcastBarColor(data.backgroundColor);
      }
      
      if (data.textColor !== undefined) {
        setBroadcastBarTextColor(data.textColor);
      }
      
      if (data.animation !== undefined) {
        setBroadcastBarAnimation(data.animation);
      }
      
      if (data.speed !== undefined) {
        setBroadcastBarSpeed(data.speed);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [demoMode, on]);

  return {
    broadcastBarText,
    broadcastBarEnabled,
    broadcastBarPosition,
    broadcastBarColor,
    broadcastBarTextColor,
    broadcastBarAnimation,
    broadcastBarSpeed
  };
}
