import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, TrendingDown, Activity, Users, DollarSign } from 'lucide-react';

interface MacroExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicator: 'interestRate' | 'inflation' | 'gdpGrowth' | 'unemployment' | null;
}

export const MacroExplanationModal: React.FC<MacroExplanationModalProps> = ({
  isOpen,
  onClose,
  indicator
}) => {
  if (!isOpen || !indicator) return null;

  const content = {
    interestRate: {
      title: 'Interest Rates',
      icon: <DollarSign className="w-8 h-8" />,
      description: 'The cost of borrowing money, set by central banks.',
      impact: 'When interest rates rise, borrowing costs increase. This typically hurts growth stocks (which rely on cheap capital to expand) and makes bonds more attractive relative to stocks. Conversely, lowering rates stimulates the economy and boosts stock prices.',
      historical: 'In the early 1980s, the Federal Reserve raised rates to nearly 20% to combat inflation, causing a severe recession but setting the stage for a long bull market.'
    },
    inflation: {
      title: 'Inflation',
      icon: <TrendingUp className="w-8 h-8" />,
      description: 'The rate at which the general level of prices for goods and services is rising.',
      impact: 'Moderate inflation is normal, but high inflation erodes purchasing power. It hurts companies that cannot pass costs onto consumers. Real estate and commodities often act as inflation hedges. Central banks usually raise interest rates to fight high inflation.',
      historical: 'During the 1970s, stagflation (high inflation + stagnant growth) crushed stock returns for a decade.'
    },
    gdpGrowth: {
      title: 'GDP Growth',
      icon: <Activity className="w-8 h-8" />,
      description: 'The total value of goods produced and services provided in a country during one year.',
      impact: 'Strong GDP growth generally leads to higher corporate earnings, which drives stock prices up. However, if growth is too rapid, it can trigger inflation fears. Two consecutive quarters of negative GDP growth define a recession.',
      historical: 'The post-WWII boom saw massive GDP growth, leading to one of the most prosperous periods in American corporate history.'
    },
    unemployment: {
      title: 'Unemployment',
      icon: <Users className="w-8 h-8" />,
      description: 'The percentage of the labor force that is jobless and actively looking for work.',
      impact: 'High unemployment means consumers have less money to spend, hurting retail and consumer discretionary stocks. However, low unemployment can lead to wage inflation, squeezing corporate profit margins.',
      historical: 'During the Great Depression, unemployment peaked at 25%, devastating consumer demand and corporate profits.'
    }
  };

  const data = content[indicator];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-parchment border-4 border-dark-sepia shadow-[12px_12px_0px_0px_var(--sepia)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-parchment border-b-4 border-dark-sepia p-6 flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-ink text-parchment rounded-sm">
                {data.icon}
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">{data.title}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-tan-mid transition-colors rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <h4 className="font-mono text-xs uppercase tracking-widest opacity-60">Definition</h4>
              <p className="text-xl font-serif leading-relaxed">{data.description}</p>
            </div>

            <div className="p-6 bg-tan-light border-l-4 border-ink space-y-2">
              <h4 className="font-mono text-xs uppercase tracking-widest opacity-60">Market Impact</h4>
              <p className="text-lg leading-relaxed">{data.impact}</p>
            </div>

            <div className="p-6 bg-sepia/10 border-l-4 border-sepia space-y-2">
              <h4 className="font-mono text-xs uppercase tracking-widest opacity-60 text-sepia">Historical Context</h4>
              <p className="text-lg leading-relaxed font-serif italic">{data.historical}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
