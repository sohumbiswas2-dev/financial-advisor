import React from 'react';
import { motion } from 'motion/react';
import { Line } from 'react-chartjs-2';

export interface StakeholderMetrics {
  shareholders: number[]; // Array of total return % over time
  employees: number;      // Retention rate % (0-100)
  creditors: number;      // Credit rating score (0-100, mapped to AAA-D)
  regulators: number;     // Compliance score (0-100)
  media: number;          // Sentiment score (-100 to +100)
}

interface Props {
  metrics: StakeholderMetrics;
}

const getCreditRating = (score: number) => {
  if (score >= 90) return { rating: 'AAA', color: 'bg-green-600' };
  if (score >= 80) return { rating: 'AA', color: 'bg-green-500' };
  if (score >= 70) return { rating: 'A', color: 'bg-green-400' };
  if (score >= 60) return { rating: 'BBB', color: 'bg-yellow-400' };
  if (score >= 50) return { rating: 'BB', color: 'bg-yellow-500' };
  if (score >= 40) return { rating: 'B', color: 'bg-orange-500' };
  if (score >= 30) return { rating: 'CCC', color: 'bg-orange-600' };
  if (score >= 20) return { rating: 'CC', color: 'bg-red-500' };
  if (score >= 10) return { rating: 'C', color: 'bg-red-600' };
  return { rating: 'D', color: 'bg-red-700' };
};

export const StakeholderDashboard: React.FC<Props> = ({ metrics }) => {
  const credit = getCreditRating(metrics.creditors);
  
  // Normalize media sentiment (-100 to 100) to (0 to 100) for thermometer height
  const mediaHeight = Math.max(0, Math.min(100, (metrics.media + 100) / 2));
  const mediaColor = metrics.media > 20 ? 'bg-green-500' : metrics.media < -20 ? 'bg-red-500' : 'bg-yellow-500';

  // Gauge rotation for regulators (0 to 100 -> -90deg to 90deg)
  const gaugeRotation = (Math.max(0, Math.min(100, metrics.regulators)) / 100) * 180 - 90;

  return (
    <div className="bg-parchment border-2 border-dark-sepia p-6 shadow-[4px_4px_0px_var(--sepia)] space-y-6">
      <h3 className="font-bold uppercase tracking-widest text-sm border-b border-dark-sepia pb-2">
        Stakeholder Dashboard
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Shareholders: Small line chart */}
        <div className="space-y-2 col-span-1 md:col-span-2">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase opacity-60">Shareholders</span>
            <span className="font-bold text-sm">{metrics.shareholders[metrics.shareholders.length - 1]?.toFixed(1)}%</span>
          </div>
          <div className="h-16 w-full border border-tan-mid bg-tan-light/30 p-1">
            <Line 
              data={{
                labels: metrics.shareholders.map((_, i) => i.toString()),
                datasets: [{
                  data: metrics.shareholders,
                  borderColor: 'var(--ink)',
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

        {/* Employees: Horizontal progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase opacity-60">Employees</span>
            <span className="font-bold text-sm">{metrics.employees.toFixed(0)}%</span>
          </div>
          <div className="h-4 w-full bg-tan-mid/30 border border-tan-mid overflow-hidden">
            <motion.div 
              className="h-full bg-ink"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, metrics.employees))}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-[9px] font-mono text-center opacity-50 uppercase">Retention</div>
        </div>

        {/* Creditors: Color-coded vertical scale */}
        <div className="space-y-2 flex flex-col items-center">
          <span className="font-mono text-[10px] uppercase opacity-60 w-full text-left">Creditors</span>
          <div className="flex items-center gap-3 w-full">
            <div className="h-10 w-4 border border-tan-mid bg-tan-mid/30 relative overflow-hidden">
              <motion.div 
                className={`absolute bottom-0 w-full ${credit.color}`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(0, Math.min(100, metrics.creditors))}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="font-bold text-lg font-mono">{credit.rating}</span>
          </div>
          <div className="text-[9px] font-mono text-left w-full opacity-50 uppercase">Rating</div>
        </div>

        {/* Regulators: Gauge / speedometer */}
        <div className="space-y-2 flex flex-col items-center">
          <span className="font-mono text-[10px] uppercase opacity-60 w-full text-left">Regulators</span>
          <div className="relative w-16 h-8 overflow-hidden">
            {/* Gauge background */}
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-red-500 border-r-yellow-500 border-b-green-500 border-l-green-500 transform rotate-45 opacity-50" />
            {/* Needle */}
            <motion.div 
              className="absolute bottom-0 left-1/2 w-0.5 h-7 bg-ink origin-bottom"
              initial={{ rotate: -90 }}
              animate={{ rotate: gaugeRotation }}
              transition={{ duration: 0.5, type: 'spring' }}
            />
            {/* Center dot */}
            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-ink rounded-full transform -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="flex justify-between w-full">
            <span className="font-bold text-sm">{metrics.regulators.toFixed(0)}</span>
            <span className="text-[9px] font-mono opacity-50 uppercase self-end">Score</span>
          </div>
        </div>

        {/* Media/Public: Thermometer */}
        <div className="space-y-2 flex flex-col items-center">
          <span className="font-mono text-[10px] uppercase opacity-60 w-full text-left">Media/Public</span>
          <div className="flex items-center gap-3 w-full">
            <div className="relative w-4 h-10 border border-tan-mid bg-tan-mid/30 rounded-t-full rounded-b-full overflow-hidden flex flex-col justify-end">
              <motion.div 
                className={`w-full ${mediaColor}`}
                initial={{ height: '50%' }}
                animate={{ height: `${mediaHeight}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="font-bold text-sm">{metrics.media > 0 ? '+' : ''}{metrics.media.toFixed(0)}</span>
          </div>
          <div className="text-[9px] font-mono text-left w-full opacity-50 uppercase">Sentiment</div>
        </div>

      </div>
    </div>
  );
};
