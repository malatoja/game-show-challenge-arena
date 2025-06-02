
import React from 'react';
import { useParams } from 'react-router-dom';
import PlayerPanel from '@/components/player/PlayerPanel';

export default function PlayerPage() {
  const { token } = useParams();
  
  return <PlayerPanel playerToken={token} />;
}
