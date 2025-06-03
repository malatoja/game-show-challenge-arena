
import React from 'react';

interface HostCameraProps {
  url?: string;
}

export function HostCamera({ url }: HostCameraProps) {
  if (!url) {
    return (
      <div className="w-full h-full bg-gameshow-card rounded-lg border border-gameshow-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gameshow-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎤</span>
          </div>
          <p className="text-gameshow-muted">Host Camera</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gameshow-secondary">
      <iframe 
        src={url} 
        className="w-full h-full"
        allow="camera; microphone"
        title="Host Camera"
      />
    </div>
  );
}

export default HostCamera;
