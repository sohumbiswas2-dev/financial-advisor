import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flag, AlertTriangle, CheckCircle } from 'lucide-react';

interface TimelineEvent {
  year: number;
  event: string;
}

interface MarketTimelineStripProps {
  events: TimelineEvent[];
  currentYear: number;
}

export const MarketTimelineStrip: React.FC<MarketTimelineStripProps> = ({ events, currentYear }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Scroll to current year
      const currentEventElement = containerRef.current.querySelector(`[data-year="${currentYear}"]`);
      if (currentEventElement) {
        currentEventElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentYear]);

  return (
    <div className="newspaper-card p-4 overflow-hidden">
      <h3 className="font-serif text-sm text-[var(--ink)] font-bold tracking-widest uppercase mb-4">Timeline</h3>
      
      <div 
        ref={containerRef}
        className="flex overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory"
      >
        <div className="flex items-center min-w-max px-4">
          {events.map((event, index) => {
            const isPast = event.year < currentYear;
            const isCurrent = event.year === currentYear;
            const isFuture = event.year > currentYear;

            return (
              <div 
                key={index} 
                data-year={event.year}
                className="flex flex-col items-center relative snap-center"
              >
                {/* Connecting Line */}
                {index < events.length - 1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-0.5 ${isPast ? 'bg-[var(--dark-sepia)]' : 'bg-[var(--tan-mid)]'}`} />
                )}

                {/* Marker */}
                <motion.div 
                  className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isPast ? 'bg-[var(--dark-sepia)] border-[var(--dark-sepia)] text-[var(--parchment)]' :
                    isCurrent ? 'bg-[var(--parchment)] border-[var(--dark-sepia)] text-[var(--dark-sepia)]' :
                    'bg-[var(--parchment)] border-[var(--tan-mid)] text-[var(--ink)] opacity-50'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {isPast ? <CheckCircle className="w-4 h-4" /> :
                   isCurrent ? <AlertTriangle className="w-4 h-4" /> :
                   <Flag className="w-4 h-4" />}
                </motion.div>

                {/* Label */}
                <div className="mt-3 text-center w-32 px-2">
                  <div className={`font-mono text-xs font-bold ${isCurrent ? 'text-[var(--dark-sepia)]' : 'text-[var(--ink)] opacity-70'}`}>
                    {event.year}
                  </div>
                  <div className={`text-[10px] mt-1 line-clamp-2 ${isCurrent ? 'text-[var(--ink)] font-bold' : 'text-[var(--ink)] opacity-60'}`}>
                    {event.event}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
