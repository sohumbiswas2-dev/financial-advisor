import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MacroData {
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  interestRate: number;
}

interface MacroPulseCardsProps {
  currentData: MacroData;
  previousData?: MacroData;
}

export const MacroPulseCards: React.FC<MacroPulseCardsProps> = ({ currentData, previousData }) => {
  const [pulsing, setPulsing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!previousData) return;

    const newPulsing: Record<string, boolean> = {};
    if (Math.abs(currentData.gdpGrowth - previousData.gdpGrowth) > 1) newPulsing.gdpGrowth = true;
    if (Math.abs(currentData.inflation - previousData.inflation) > 1) newPulsing.inflation = true;
    if (Math.abs(currentData.unemployment - previousData.unemployment) > 1) newPulsing.unemployment = true;
    if (Math.abs(currentData.interestRate - previousData.interestRate) > 0.5) newPulsing.interestRate = true;

    setPulsing(newPulsing);

    const timeout = setTimeout(() => setPulsing({}), 2000);
    return () => clearTimeout(timeout);
  }, [currentData, previousData]);

  const renderCard = (key: keyof MacroData, label: string, value: number, prevValue?: number, isInverseGood: boolean = false) => {
    const isPulsing = pulsing[key];
    const diff = prevValue !== undefined ? value - prevValue : 0;
    
    let Icon = Minus;
    let colorClass = 'text-[var(--ink)] opacity-70';
    
    if (diff > 0) {
      Icon = TrendingUp;
      colorClass = isInverseGood ? 'text-[var(--rust)]' : 'text-[var(--sepia)]';
    } else if (diff < 0) {
      Icon = TrendingDown;
      colorClass = isInverseGood ? 'text-[var(--sepia)]' : 'text-[var(--rust)]';
    }

    return (
      <motion.div
        key={key}
        className={`relative p-4 border-2 ${isPulsing ? 'border-[var(--sepia)] bg-[var(--sepia)]/10' : 'border-[var(--dark-sepia)] bg-[var(--tan-mid)]'} transition-colors duration-500`}
        animate={isPulsing ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-serif text-[var(--ink)] opacity-80 uppercase tracking-widest">{label}</span>
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-[var(--ink)]">{value.toFixed(1)}%</span>
          {diff !== 0 && (
            <span className={`text-xs font-mono font-bold ${colorClass}`}>
              {diff > 0 ? '+' : ''}{diff.toFixed(1)}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="newspaper-card p-4">
      <h3 className="font-serif text-sm text-[var(--ink)] font-bold tracking-widest uppercase mb-4">Macro Indicators</h3>
      <div className="grid grid-cols-2 gap-4">
        {renderCard('gdpGrowth', 'GDP Growth', currentData.gdpGrowth, previousData?.gdpGrowth)}
        {renderCard('inflation', 'Inflation', currentData.inflation, previousData?.inflation, true)}
        {renderCard('unemployment', 'Unemployment', currentData.unemployment, previousData?.unemployment, true)}
        {renderCard('interestRate', 'Interest Rate', currentData.interestRate, previousData?.interestRate, true)}
      </div>
    </div>
  );
};
