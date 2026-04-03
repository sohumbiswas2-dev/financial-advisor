import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Investor {
  id: string;
  name: string;
  philosophy: string;
  portfolioValue: number;
  returnPercentage: number;
  strategyLabel: string;
  avatarUrl?: string;
}

interface Competitor extends Investor {
  isUser?: boolean;
}

interface CompetitorBoardProps {
  investors: Investor[];
  userPortfolioValue: number;
  userReturnPercentage: number;
}

const CompetitorAvatar: React.FC<{ name: string; url?: string; isUser?: boolean }> = ({ name, url, isUser }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-sm shrink-0 ${
    isUser ? 'bg-[var(--dark-sepia)] text-[var(--parchment)]' : 'bg-[var(--tan-mid)] text-[var(--ink)]'
  }`}>
    {url ? (
      <img src={url} alt={name} className="w-full h-full rounded-full object-cover" />
    ) : (
      <span aria-hidden="true">{name.charAt(0)}</span>
    )}
  </div>
);

export const CompetitorBoard: React.FC<CompetitorBoardProps> = ({ 
  investors, 
  userPortfolioValue, 
  userReturnPercentage 
}) => {
  const allCompetitors = useMemo(() => {
    const userCompetitor: Competitor = {
      id: 'user',
      name: 'You',
      philosophy: 'Your Strategy',
      portfolioValue: userPortfolioValue,
      returnPercentage: userReturnPercentage,
      strategyLabel: 'Active',
      isUser: true
    };

    return [userCompetitor, ...investors]
      .sort((a, b) => b.returnPercentage - a.returnPercentage);
  }, [investors, userPortfolioValue, userReturnPercentage]);

  const getReturnColor = (val: number) => {
    if (val > 0) return 'text-[var(--sepia)]';
    if (val < 0) return 'text-[var(--rust)]';
    return 'text-[var(--ink)] opacity-70';
  };

  const getReturnIcon = (val: number) => {
    if (val > 0) return <TrendingUp className="w-3 h-3 text-[var(--sepia)]" />;
    if (val < 0) return <TrendingDown className="w-3 h-3 text-[var(--rust)]" />;
    return <Minus className="w-3 h-3 text-[var(--ink)] opacity-70" />;
  };

  return (
    <div className="newspaper-card p-4 h-full flex flex-col" aria-label="Competitor Leaderboard">
      <div className="flex items-center justify-between mb-4 border-b-2 border-[var(--dark-sepia)] pb-2">
        <h3 className="font-serif text-sm text-[var(--ink)] font-bold tracking-widest uppercase">Competitor Board</h3>
        <User className="w-4 h-4 text-[var(--ink)]" aria-hidden="true" />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
        {allCompetitors.length > 0 ? (
          allCompetitors.map((comp, index) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 border-2 transition-colors ${
                comp.isUser 
                  ? 'bg-[var(--sepia)]/10 border-[var(--dark-sepia)] shadow-sm' 
                  : 'bg-[var(--parchment)] border-[var(--tan-mid)]'
              }`}
              role="listitem"
            >
              <div className="flex items-center gap-3">
                <CompetitorAvatar name={comp.name} url={comp.avatarUrl} isUser={comp.isUser} />
                <div>
                  <div className="font-serif font-bold text-sm text-[var(--ink)]">{comp.name}</div>
                  <div className="text-[10px] font-mono text-[var(--ink)] opacity-70 uppercase tracking-wider">{comp.strategyLabel}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-mono font-bold text-sm text-[var(--ink)]">
                  ${comp.portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className={`flex items-center justify-end gap-1 text-xs font-mono font-bold ${getReturnColor(comp.returnPercentage)}`}>
                  {getReturnIcon(comp.returnPercentage)}
                  {comp.returnPercentage > 0 ? '+' : ''}{comp.returnPercentage.toFixed(1)}%
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-40 italic py-8">
            <p className="text-sm font-serif">No competitors found</p>
          </div>
        )}
      </div>
    </div>
  );
};

