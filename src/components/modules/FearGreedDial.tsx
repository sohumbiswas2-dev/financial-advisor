import React from 'react';
import { motion } from 'framer-motion';

interface FearGreedDialProps {
  value: number; // 0 to 100
}

export const FearGreedDial: React.FC<FearGreedDialProps> = ({ value }) => {
  // Map 0-100 to -90 to 90 degrees for the needle
  const rotation = (value / 100) * 180 - 90;

  const getLabel = (val: number) => {
    if (val < 25) return 'Extreme Fear';
    if (val < 45) return 'Fear';
    if (val < 55) return 'Neutral';
    if (val < 75) return 'Greed';
    return 'Extreme Greed';
  };

  const getColor = (val: number) => {
    if (val < 25) return 'var(--rust)';
    if (val < 45) return 'var(--dark-sepia)';
    if (val < 55) return 'var(--ink)';
    if (val < 75) return 'var(--sepia)';
    return 'var(--tan-mid)';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 newspaper-card relative overflow-hidden">
      <h3 className="font-serif text-sm text-[var(--ink)] font-bold tracking-widest uppercase mb-6">Market Sentiment</h3>
      
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Dial Gradient Arc */}
        <svg viewBox="0 0 100 50" className="absolute top-0 left-0 w-full h-full">
          <defs>
            <linearGradient id="fearGreedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--rust)" />
              <stop offset="25%" stopColor="var(--dark-sepia)" />
              <stop offset="50%" stopColor="var(--ink)" />
              <stop offset="75%" stopColor="var(--sepia)" />
              <stop offset="100%" stopColor="var(--tan-mid)" />
            </linearGradient>
          </defs>
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#fearGreedGradient)" strokeWidth="12" strokeLinecap="round" />
        </svg>

        {/* Needle */}
        <motion.div 
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-[var(--ink)] origin-bottom rounded-t-full shadow-lg"
          style={{ x: '-50%' }}
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        >
          <div className="absolute -bottom-2 -left-1.5 w-4 h-4 rounded-full bg-[var(--parchment)] border-2 border-[var(--ink)]"></div>
        </motion.div>
      </div>

      <div className="mt-4 text-center">
        <div className="font-mono text-3xl font-bold" style={{ color: getColor(value) }}>
          {value}
        </div>
        <div className="text-xs text-[var(--ink)] opacity-70 uppercase tracking-widest mt-1">
          {getLabel(value)}
        </div>
      </div>
    </div>
  );
};
