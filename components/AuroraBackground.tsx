'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuroraBackgroundProps {
  children?: ReactNode;
  className?: string;
  showRadialGradient?: boolean;
  intensity?: 'subtle' | 'medium' | 'strong';
}

export function AuroraBackground({
  children,
  className = '',
  showRadialGradient = true,
  intensity = 'medium',
}: AuroraBackgroundProps) {
  const intensityConfig = {
    subtle: { blur: 'blur-[100px]', opacity: 0.3 },
    medium: { blur: 'blur-[120px]', opacity: 0.5 },
    strong: { blur: 'blur-[140px]', opacity: 0.7 },
  };

  const config = intensityConfig[intensity];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Aurora layers */}
      <div className="aurora-container absolute inset-0 pointer-events-none">
        {/* Teal-Blue Aurora (Primary) */}
        <motion.div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full ${config.blur}`}
          style={{
            background: 'radial-gradient(circle, oklch(65% 0.15 230 / 0.6) 0%, transparent 70%)',
            opacity: config.opacity,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Sage Green Aurora (Secondary) */}
        <motion.div
          className={`absolute top-1/3 right-1/4 w-[700px] h-[700px] rounded-full ${config.blur}`}
          style={{
            background: 'radial-gradient(circle, oklch(70% 0.12 160 / 0.5) 0%, transparent 70%)',
            opacity: config.opacity,
          }}
          animate={{
            x: [0, -80, 120, 0],
            y: [0, 100, -70, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Warm Amber Aurora (Accent) */}
        <motion.div
          className={`absolute bottom-1/4 left-1/2 w-[500px] h-[500px] rounded-full ${config.blur}`}
          style={{
            background: 'radial-gradient(circle, oklch(72% 0.14 50 / 0.4) 0%, transparent 70%)',
            opacity: config.opacity,
          }}
          animate={{
            x: [0, 90, -120, 0],
            y: [0, -60, 80, 0],
            scale: [1, 1.1, 0.85, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
        />

        {/* Light Teal Accent */}
        <motion.div
          className={`absolute bottom-0 right-1/3 w-[550px] h-[550px] rounded-full ${config.blur}`}
          style={{
            background: 'radial-gradient(circle, oklch(80% 0.11 230 / 0.4) 0%, transparent 70%)',
            opacity: config.opacity,
          }}
          animate={{
            x: [0, -70, 110, 0],
            y: [0, 90, -50, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 7,
          }}
        />

        {/* Radial gradient overlay for depth */}
        {showRadialGradient && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 80% at 50% 0%, transparent 0%, oklch(96% 0.015 160) 100%)',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Simpler version for cards/smaller elements
export function AuroraCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <motion.div
          className="absolute top-0 -left-1/4 w-full h-full"
          style={{
            background:
              'linear-gradient(120deg, oklch(65% 0.15 230 / 0.3) 0%, oklch(70% 0.12 160 / 0.2) 50%, oklch(72% 0.14 50 / 0.25) 100%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: ['-25%', '25%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Aurora border effect for buttons/cards
export function AuroraBorder({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated gradient border */}
      <motion.div
        className="absolute -inset-0.5 rounded-comfort opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'linear-gradient(90deg, oklch(65% 0.15 230), oklch(70% 0.12 160), oklch(72% 0.14 50), oklch(65% 0.15 230))',
          backgroundSize: '200% 100%',
          filter: 'blur(4px)',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '200% 0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative bg-background rounded-comfort">{children}</div>
    </div>
  );
}

