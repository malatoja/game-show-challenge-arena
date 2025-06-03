
import React from 'react';

interface HostCameraProps {
  url: string;
}

export const HostCamera: React.FC<HostCameraProps> = ({ url }) => {
  if (!url) {
    return (
      <div className="bg-gray-900 w-full h-full flex items-center justify-center">
        <p className="text-gray-400">Brak kamery</p>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      <iframe 
        src={url} 
        className="absolute inset-0 w-full h-full border-0"
        allow="camera; microphone"
        title="Host Camera"
      />
    </div>
  );
};

export default HostCamera;
