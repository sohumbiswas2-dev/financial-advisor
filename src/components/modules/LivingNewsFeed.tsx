import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { GlossaryText } from '../ui/GlossaryText';

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

interface MonthData {
  month: string;
  date: string;
  news: NewsItem[];
}

interface LivingNewsFeedProps {
  monthsData: MonthData[];
  currentMonthIndex: number;
  beginnerMode?: boolean;
}

export const LivingNewsFeed: React.FC<LivingNewsFeedProps> = ({ 
  monthsData, 
  currentMonthIndex,
  beginnerMode = false 
}) => {
  // Show all months up to current, reversed so newest is at top
  const visibleMonths = monthsData.slice(0, currentMonthIndex + 1).reverse();

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-[var(--sepia)]" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-[var(--rust)]" />;
      default: return <Minus className="w-4 h-4 text-[var(--ink)] opacity-60" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'border-[var(--sepia)] bg-[var(--sepia)]/10';
      case 'bearish': return 'border-[var(--rust)] bg-[var(--rust)]/10';
      default: return 'border-[var(--ink)]/30 bg-[var(--ink)]/5';
    }
  };

  return (
    <div className="flex flex-col h-full newspaper-card overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b-2 border-[var(--dark-sepia)] bg-[var(--tan-mid)]">
        <Newspaper className="w-5 h-5 text-[var(--ink)]" />
        <h3 className="font-serif text-lg text-[var(--ink)] font-bold tracking-wide uppercase">Live Wire</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence initial={false}>
          {visibleMonths.map((monthData, index) => (
            <motion.div
              key={monthData.date}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <div className="sticky top-0 bg-[var(--tan-light)] py-1 z-10 border-b border-[var(--sepia)]">
                <span className="font-mono text-xs text-[var(--dark-sepia)] font-bold uppercase tracking-widest">{monthData.month}</span>
              </div>
              
              <div className="space-y-3">
                {monthData.news.map((news, nIdx) => (
                  <div 
                    key={nIdx} 
                    className={`p-3 border-l-4 border-y border-r ${getSentimentColor(news.sentiment)} transition-colors hover:bg-[var(--parchment)]`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-mono text-[var(--ink)] opacity-70 uppercase">{news.source}</span>
                      {getSentimentIcon(news.sentiment)}
                    </div>
                    <h4 className="font-serif text-sm font-bold leading-tight mb-2 text-[var(--ink)]">{news.title}</h4>
                    <p className="text-xs text-[var(--ink)] opacity-80 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all duration-300">
                      <GlossaryText text={news.summary} beginnerMode={beginnerMode} />
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
