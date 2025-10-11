'use client';

import { AuroraBackground, AuroraCard, AuroraBorder } from '@/components/AuroraBackground';

export default function AuroraTestPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Full Page Aurora Test */}
      <AuroraBackground intensity="strong" className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold text-white mb-4">🌌 Aurora Effect Test</h1>
          <p className="text-xl text-white/80 mb-8">This should show a beautiful aurora background</p>
          
          {/* Aurora Card Test */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AuroraCard className="p-8 bg-white/20 backdrop-blur-sm rounded-comfort">
              <h2 className="text-2xl font-bold text-white mb-4">Aurora Card</h2>
              <p className="text-white/80">This card has an aurora background effect</p>
            </AuroraCard>
            
            <AuroraCard className="p-8 bg-white/20 backdrop-blur-sm rounded-comfort">
              <h2 className="text-2xl font-bold text-white mb-4">Another Card</h2>
              <p className="text-white/80">Each card has its own aurora effect</p>
            </AuroraCard>
          </div>
          
          {/* Aurora Border Test */}
          <div className="mt-8 flex justify-center">
            <AuroraBorder>
              <button className="px-8 py-4 bg-white/90 backdrop-blur-sm rounded-comfort text-lg font-semibold hover:bg-white transition-colors">
                Hover for Aurora Border
              </button>
            </AuroraBorder>
          </div>
          
          {/* Intensity Tests */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <AuroraBackground intensity="subtle" className="h-32 rounded-comfort flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Subtle</h3>
                <p className="text-white/70 text-sm">Gentle effect</p>
              </div>
            </AuroraBackground>
            
            <AuroraBackground intensity="medium" className="h-32 rounded-comfort flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Medium</h3>
                <p className="text-white/70 text-sm">Balanced</p>
              </div>
            </AuroraBackground>
            
            <AuroraBackground intensity="strong" className="h-32 rounded-comfort flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Strong</h3>
                <p className="text-white/70 text-sm">Bold effect</p>
              </div>
            </AuroraBackground>
          </div>
        </div>
      </AuroraBackground>
    </div>
  );
}
