'use client';

import { AuroraBackground } from './AuroraBackground';

export function AuroraDebug() {
  return (
    <div className="min-h-screen bg-background">
      <AuroraBackground intensity="strong" className="min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-comfort">
            <h1 className="text-4xl font-bold text-white mb-4">🌌 Aurora Debug</h1>
            <p className="text-white/80 mb-4">If you can see this text, the aurora is working!</p>
            <div className="text-sm text-white/60">
              <p>• Check browser console for errors</p>
              <p>• Ensure Framer Motion is installed</p>
              <p>• Verify Tailwind CSS is working</p>
            </div>
          </div>
        </div>
      </AuroraBackground>
    </div>
  );
}
