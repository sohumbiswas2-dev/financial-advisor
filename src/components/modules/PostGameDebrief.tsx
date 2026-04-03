import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Trophy, Target, AlertCircle, BookOpen } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface InvestorResult {
  id: string;
  name: string;
  philosophy: string;
  finalValue: number;
  returnPercentage: number;
  allocations: Record<string, number>;
  quote: string;
}

interface ResultEntry {
  id: string;
  name: string;
  finalValue: number;
  returnPercentage: number;
  isUser: boolean;
}

import { TeachMeCard, TeachMeProps } from './TeachMeCard';
import { DownloadReportButton } from '../ui/DownloadReportButton';

interface PostGameDebriefProps {
  userFinalValue: number;
  userReturnPercentage: number;
  userAllocations: Record<string, number>;
  investors: InvestorResult[];
  scenarioName: string;
  onRestart: () => void;
  onAutopsy?: () => void;
  xpGained?: number;
  repChange?: number;
  teachMe?: TeachMeProps;
}

export const PostGameDebrief: React.FC<PostGameDebriefProps> = ({
  userFinalValue,
  userReturnPercentage,
  userAllocations,
  investors,
  scenarioName,
  onRestart,
  onAutopsy,
  xpGained = 0,
  repChange = 0,
  teachMe
}) => {
  const allResults = useMemo<ResultEntry[]>(() => [
    {
      id: 'user',
      name: 'You',
      finalValue: userFinalValue,
      returnPercentage: userReturnPercentage,
      isUser: true
    },
    ...investors.map(inv => ({
      id: inv.id,
      name: inv.name,
      finalValue: inv.finalValue,
      returnPercentage: inv.returnPercentage,
      isUser: false
    }))
  ].sort((a, b) => b.returnPercentage - a.returnPercentage), [userFinalValue, userReturnPercentage, investors]);

  const chartData = useMemo(() => ({
    labels: allResults.map(r => r.name),
    datasets: [
      {
        label: 'Return (%)',
        data: allResults.map(r => r.returnPercentage),
        backgroundColor: allResults.map(r => r.isUser ? 'rgba(139, 105, 20, 0.8)' : 'rgba(92, 61, 10, 0.8)'),
        borderColor: allResults.map(r => r.isUser ? '#8b6914' : '#5c3d0a'),
        borderWidth: 1,
      }
    ]
  }), [allResults]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#e8d9b5', // var(--tan-light)
        titleColor: '#1a1008', // var(--ink)
        bodyColor: '#1a1008', // var(--ink)
        borderColor: '#5c3d0a', // var(--dark-sepia)
        borderWidth: 1,
        titleFont: { family: 'Playfair Display' },
        bodyFont: { family: 'Courier New' }
      }
    },
    scales: {
      y: {
        grid: { color: '#c9a96e' }, // var(--tan-mid)
        ticks: { color: '#1a1008', font: { family: 'Courier New' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#1a1008', font: { family: 'Playfair Display' } }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--parchment)] text-[var(--ink)] font-sans p-6 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-6xl text-[var(--ink)] font-bold tracking-wide uppercase">Debriefing</h1>
          <p className="font-mono text-[var(--ink)] opacity-70 uppercase tracking-widest text-sm">Scenario: {scenarioName}</p>
          
          {(xpGained > 0 || repChange !== 0) && (
            <div className="flex justify-center gap-6 mt-4 font-mono text-sm uppercase tracking-widest">
              <span className="bg-sepia text-parchment px-4 py-2">+{xpGained} XP</span>
              <span className={`px-4 py-2 ${repChange > 0 ? 'bg-ink text-parchment' : 'bg-rust text-parchment'}`}>
                {repChange > 0 ? '+' : ''}{repChange} Reputation
              </span>
            </div>
          )}
        </div>

        {/* Section A: Returns Comparison */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-[var(--dark-sepia)] pb-2">
            <Trophy className="w-6 h-6 text-[var(--ink)]" />
            <h2 className="font-serif text-2xl text-[var(--ink)] font-bold uppercase tracking-wider">Performance Review</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="newspaper-card p-6 h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>
            
            <div className="newspaper-card p-6 overflow-hidden">
              <table className="w-full text-left font-mono text-sm">
                <thead>
                  <tr className="border-b-2 border-[var(--dark-sepia)] text-[var(--ink)] opacity-80 uppercase tracking-widest">
                    <th className="pb-3">Investor</th>
                    <th className="pb-3 text-right">Final Value</th>
                    <th className="pb-3 text-right">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {allResults.map((result, idx) => (
                    <tr key={result.id} className={`border-b border-[var(--tan-mid)] ${result.isUser ? 'bg-[var(--sepia)]/10' : ''}`}>
                      <td className={`py-4 font-serif text-lg ${result.isUser ? 'text-[var(--ink)] font-bold' : 'text-[var(--ink)]'}`}>
                        {idx === 0 && '🏆 '}{result.name}
                      </td>
                      <td className="py-4 text-right">${result.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className={`py-4 text-right font-bold ${result.returnPercentage >= 0 ? 'text-[var(--sepia)]' : 'text-[var(--rust)]'}`}>
                        {result.returnPercentage > 0 ? '+' : ''}{result.returnPercentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section B: Investor Strategy Cards */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-[var(--dark-sepia)] pb-2">
            <BookOpen className="w-6 h-6 text-[var(--ink)]" />
            <h2 className="font-serif text-2xl text-[var(--ink)] font-bold uppercase tracking-wider">Legendary Strategies Revealed</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {investors.map(investor => (
              <motion.div 
                key={investor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="newspaper-card p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl text-[var(--ink)] font-bold">{investor.name}</h3>
                    <p className="font-mono text-xs text-[var(--ink)] opacity-70 uppercase tracking-widest mt-1">{investor.philosophy}</p>
                  </div>
                  <div className={`font-mono text-lg font-bold ${investor.returnPercentage >= 0 ? 'text-[var(--sepia)]' : 'text-[var(--rust)]'}`}>
                    {investor.returnPercentage > 0 ? '+' : ''}{investor.returnPercentage.toFixed(1)}%
                  </div>
                </div>
                
                <div className="bg-[var(--parchment)] p-4 border border-[var(--tan-mid)]">
                  <h4 className="font-mono text-xs text-[var(--ink)] opacity-70 uppercase tracking-widest mb-2">Final Allocation</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(investor.allocations).map(([asset, amount]) => (
                      <span key={asset} className="px-2 py-1 bg-[var(--tan-mid)] text-[var(--ink)] text-xs font-mono border border-[var(--dark-sepia)]">
                        {asset}: ${(amount as number).toLocaleString()}
                      </span>
                    ))}
                  </div>
                </div>
                
                <blockquote className="border-l-4 border-[var(--dark-sepia)] pl-4 italic font-serif text-[var(--ink)] opacity-90">
                  "{investor.quote}"
                </blockquote>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section C: Your Decision Analysis */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-[var(--dark-sepia)] pb-2">
            <Target className="w-6 h-6 text-[var(--ink)]" />
            <h2 className="font-serif text-2xl text-[var(--ink)] font-bold uppercase tracking-wider">Your Analysis</h2>
          </div>
          
          <div className="newspaper-card p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-lg text-[var(--ink)] font-bold mb-4">Psychological Profile</h3>
                <p className="text-[var(--ink)] opacity-90 leading-relaxed font-serif">
                  {userReturnPercentage > 0 
                    ? "Your strategy demonstrated resilience and a keen eye for opportunity. By navigating the volatility, you managed to secure positive returns in a challenging environment. Consider how your allocation diverged from the legends to find your unique edge."
                    : "Losses are the tuition fees of the market. Your portfolio faced headwinds, likely due to exposure in heavily impacted sectors or mistimed entries. Review the legendary strategies above—notice how they managed risk and positioned for recovery."}
                </p>
              </div>
              
              <div>
                <h3 className="font-serif text-lg text-[var(--ink)] font-bold mb-4">Key Takeaways</h3>
                <ul className="space-y-3 font-mono text-sm text-[var(--ink)] opacity-80">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[var(--ink)] shrink-0 mt-0.5" />
                    <span>Markets are cyclical; extreme fear often precedes generational buying opportunities.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[var(--ink)] shrink-0 mt-0.5" />
                    <span>Diversification is your only free lunch, but concentration builds wealth if you are right.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[var(--ink)] shrink-0 mt-0.5" />
                    <span>Macro indicators (rates, inflation) are the gravity that pulls on all asset prices.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {teachMe && (
          <section className="space-y-6">
            <TeachMeCard {...teachMe} />
          </section>
        )}

        {/* Action */}
        <div className="flex justify-center gap-4 pt-8">
          <DownloadReportButton />
          {onAutopsy && (
            <button 
              onClick={onAutopsy}
              className="px-8 py-4 bg-[var(--parchment)] text-[var(--ink)] border-4 border-[var(--ink)] font-bold text-xl hover:bg-[var(--tan-mid)] transition-all flex items-center gap-2"
            >
              Decision Autopsy <Target className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={onRestart}
            className="primary"
          >
            Return to Archives
          </button>
        </div>

      </div>
    </div>
  );
};
