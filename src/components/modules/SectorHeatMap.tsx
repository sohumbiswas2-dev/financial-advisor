import React from 'react';
import { motion } from 'framer-motion';

interface SectorPerformance {
  [sectorName: string]: number;
}

interface SectorHeatMapProps {
  performance: SectorPerformance;
}

export const SectorHeatMap: React.FC<SectorHeatMapProps> = ({ performance }) => {
  const getBackgroundColor = (value: number) => {
    if (value <= -10) return 'bg-[var(--rust)] text-[var(--parchment)]';
    if (value < 0) return 'bg-[var(--dark-sepia)] text-[var(--parchment)]';
    if (value === 0) return 'bg-[var(--tan-mid)] text-[var(--ink)]';
    if (value < 10) return 'bg-[var(--sepia)] text-[var(--parchment)]';
    return 'bg-[var(--ink)] text-[var(--parchment)]';
  };

  const sectorEntries = Object.entries(performance);

  return (
    <div className="p-4 newspaper-card" aria-label="Sector Performance Heat Map">
      <h3 className="font-serif text-sm text-[var(--ink)] font-bold tracking-widest uppercase mb-4">Sector Heat Map</h3>
      
      {sectorEntries.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {sectorEntries.map(([sector, value]) => (
            <motion.div
              key={sector}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col items-center justify-center p-3 border border-[var(--dark-sepia)] shadow-sm transition-colors duration-500 ${getBackgroundColor(value)}`}
              whileHover={{ scale: 1.05 }}
              role="group"
              aria-label={`${sector} performance: ${value}%`}
            >
              <span className="text-xs font-medium uppercase tracking-wider mb-1 text-center">
                {sector}
              </span>
              <span className="font-mono text-sm font-bold">
                {value > 0 ? '+' : ''}{value}%
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 opacity-40 italic">
          <p className="text-sm font-serif">No sector data available</p>
        </div>
      )}
    </div>
  );
};

