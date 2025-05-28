
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Camera, Users } from 'lucide-react';

const OverlayPage = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 h-screen">
          {/* Player cameras grid */}
          <div className="col-span-8 grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-400">Gracz {i + 1}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right sidebar */}
          <div className="col-span-4 space-y-4">
            {/* Question display */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Aktualne pytanie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Brak aktywnego pytania</p>
              </CardContent>
            </Card>

            {/* Scoreboard */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Tabela wyników
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Brak graczy</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverlayPage;
