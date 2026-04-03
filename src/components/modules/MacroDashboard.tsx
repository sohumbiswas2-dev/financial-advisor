import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Info } from 'lucide-react';
import { MacroExplanationModal } from './MacroExplanationModal';

interface MacroDashboardProps {
  macroData: {
    interestRate: number[];
    inflation: number[];
    gdpGrowth: number[];
    unemployment: number[];
  };
  currentMonthIndex: number;
}

export const MacroDashboard: React.FC<MacroDashboardProps> = ({ macroData, currentMonthIndex }) => {
  const [selectedIndicator, setSelectedIndicator] = useState<'interestRate' | 'inflation' | 'gdpGrowth' | 'unemployment' | null>(null);

  const renderCard = (
    key: 'interestRate' | 'inflation' | 'gdpGrowth' | 'unemployment',
    title: string,
    data: number[],
    color: string
  ) => {
    const currentValue = data[Math.min(currentMonthIndex, data.length - 1)];
    const historyData = data.slice(0, currentMonthIndex + 1);

    return (
      <div 
        className="bg-parchment border-2 border-dark-sepia p-4 shadow-[4px_4px_0px_var(--sepia)] cursor-pointer hover:bg-tan-light transition-colors group relative"
        onClick={() => setSelectedIndicator(key)}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Info className="w-4 h-4 text-ink/50" />
        </div>
        <div className="flex justify-between items-end mb-2">
          <span className="font-mono text-[10px] uppercase opacity-60 tracking-widest">{title}</span>
          <span className="font-bold text-xl">{currentValue?.toFixed(1)}%</span>
        </div>
        <div className="h-16 w-full mt-2">
          <Line 
            data={{
              labels: historyData.map((_, i) => i.toString()),
              datasets: [{
                data: historyData,
                borderColor: color,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { enabled: false } },
              scales: { x: { display: false }, y: { display: false } }
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold uppercase tracking-widest text-sm border-b border-dark-sepia pb-2">
        Macroeconomic Dashboard
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {renderCard('interestRate', 'Interest Rate', macroData.interestRate, 'var(--ink)')}
        {renderCard('inflation', 'Inflation', macroData.inflation, 'var(--rust)')}
        {renderCard('gdpGrowth', 'GDP Growth', macroData.gdpGrowth, 'var(--green-600)')}
        {renderCard('unemployment', 'Unemployment', macroData.unemployment, 'var(--sepia)')}
      </div>

      <MacroExplanationModal 
        isOpen={selectedIndicator !== null} 
        onClose={() => setSelectedIndicator(null)} 
        indicator={selectedIndicator} 
      />
    </div>
  );
};
