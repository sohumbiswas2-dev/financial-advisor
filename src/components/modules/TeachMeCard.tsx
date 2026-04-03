import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import * as Infographics from './InfographicLibrary';

export interface TeachMeProps {
  principleName: string;
  definition: string;
  infographicId: keyof typeof Infographics;
  example: string;
  application: string;
}

export const TeachMeCard: React.FC<TeachMeProps> = ({
  principleName,
  definition,
  infographicId,
  example,
  application
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const InfographicComponent = Infographics[infographicId];

  return (
    <div className="mt-6 border border-tan-mid bg-parchment/50 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-tan-light hover:bg-tan-mid transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ink text-parchment rounded-sm">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-ink uppercase tracking-wider text-sm">Teach Me</h4>
            <p className="text-ink/70 text-xs font-mono">{principleName}</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-ink/50" /> : <ChevronDown className="w-5 h-5 text-ink/50" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-tan-mid space-y-6">
              {/* Definition */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-2">The Principle</h5>
                <p className="text-lg font-serif leading-relaxed text-ink">{definition}</p>
              </div>

              {/* Infographic */}
              <div className="bg-parchment p-6 border border-tan-mid rounded-sm flex justify-center items-center min-h-[200px]">
                <div className="w-full max-w-md aspect-video text-ink">
                  {InfographicComponent ? <InfographicComponent /> : <div className="text-center text-ink/50">Infographic not found</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Real-world example */}
                <div className="bg-tan-light/50 p-4 border-l-2 border-ink">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-2">History's Lesson</h5>
                  <p className="text-sm font-mono leading-relaxed text-ink/80">{example}</p>
                </div>

                {/* Application to decision */}
                <div className="bg-sepia/10 p-4 border-l-2 border-sepia">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-sepia/70 mb-2">Your Decision</h5>
                  <p className="text-sm font-mono leading-relaxed text-ink/80">{application}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
