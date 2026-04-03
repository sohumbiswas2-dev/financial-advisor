import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Users, BookOpen, TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface DecisionAutopsyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'boardroom' | 'market';
  data: any; // We'll type this better
}

export const DecisionAutopsyModal: React.FC<DecisionAutopsyModalProps> = ({
  isOpen,
  onClose,
  type,
  data
}) => {
  const [whatIfIndex, setWhatIfIndex] = useState(0);

  if (!isOpen) return null;

  const renderBoardroomAutopsy = () => {
    const { caseData, decisions, metrics, npcs } = data;
    const currentRound = caseData.rounds[whatIfIndex];
    const userDecision = decisions[whatIfIndex];
    
    // Calculate "What If" outcomes for the current round
    const whatIfOptions = currentRound.options.map((opt: any) => {
      let simulatedStock = metrics.stockPrice[whatIfIndex] || 100;
      if (opt.impact.stockPrice) {
        simulatedStock *= opt.impact.stockPrice;
      }
      return {
        ...opt,
        simulatedStock
      };
    });

    return (
      <div className="space-y-12">
        {/* Outcome Summary */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="newspaper-card p-8 bg-ink text-parchment">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" /> Final Outcome
            </h3>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between border-b border-parchment/20 pb-2">
                <span className="opacity-70">Company Survival</span>
                <span className="font-bold text-green-400">Secured</span>
              </div>
              <div className="flex justify-between border-b border-parchment/20 pb-2">
                <span className="opacity-70">Stock Performance</span>
                <span className={`font-bold ${metrics.stockPrice[metrics.stockPrice.length - 1] > metrics.stockPrice[0] ? 'text-green-400' : 'text-red-400'}`}>
                  {(((metrics.stockPrice[metrics.stockPrice.length - 1] - metrics.stockPrice[0]) / metrics.stockPrice[0]) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="opacity-70">Market Share</span>
                <span className="font-bold">Maintained</span>
              </div>
            </div>
          </div>

          <div className="newspaper-card p-8 bg-parchment border-4 border-dark-sepia">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" /> NPC Comparison
            </h3>
            <div className="space-y-4">
              {npcs.map((npc: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border-b border-tan-mid pb-2 last:border-0">
                  <div>
                    <span className="font-bold">{npc.name}</span>
                    <p className="text-xs font-mono opacity-70">{npc.strategy}</p>
                  </div>
                  <span className={`font-bold font-mono ${npc.return > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {npc.return > 0 ? '+' : ''}{npc.return}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What If Slider */}
        <section className="newspaper-card p-8 border-4 border-sepia">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-dark-sepia pb-2">
            <SlidersHorizontal className="w-6 h-6 text-ink" />
            <h3 className="font-serif text-2xl font-bold uppercase tracking-wider">"What If" Analysis</h3>
          </div>
          
          <div className="mb-8">
            <label className="font-mono text-sm uppercase tracking-widest opacity-70 block mb-4">
              Select Decision Point: Round {whatIfIndex + 1} - {currentRound.title}
            </label>
            <input 
              type="range" 
              min="0" 
              max={caseData.rounds.length - 1} 
              value={whatIfIndex} 
              onChange={(e) => setWhatIfIndex(parseInt(e.target.value))}
              className="w-full accent-ink"
            />
            <div className="flex justify-between text-xs font-mono mt-2 opacity-50">
              {caseData.rounds.map((_: any, i: number) => <span key={i}>R{i+1}</span>)}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-ink/5 p-6 border border-tan-mid">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Your Choice
              </h4>
              <p className="text-sm italic mb-4">"{userDecision.text}"</p>
              <div className="font-mono text-xs p-3 bg-parchment border border-dark-sepia">
                <span className="opacity-70 block mb-1">Impact:</span>
                {Object.entries(userDecision.impact).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span>{k}</span>
                    <span className={(v as number) > 1 ? 'text-green-600' : 'text-red-600'}>
                      {((v as number) - 1 > 0 ? '+' : '')}{(((v as number) - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ink/5 p-6 border border-tan-mid">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rust" /> Alternative Options
              </h4>
              <div className="space-y-4">
                {whatIfOptions.filter((opt: any) => opt.id !== userDecision.id).map((opt: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    <p className="italic mb-2">"{opt.text}"</p>
                    <div className="font-mono text-xs p-2 bg-parchment border border-dark-sepia">
                      <span className="opacity-70 block mb-1">Simulated Impact:</span>
                      {Object.entries(opt.impact).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span>{k}</span>
                          <span className={(v as number) > 1 ? 'text-green-600' : 'text-red-600'}>
                            {((v as number) - 1 > 0 ? '+' : '')}{(((v as number) - 1) * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lessons Learned */}
        <section className="newspaper-card p-8">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-dark-sepia pb-2">
            <BookOpen className="w-6 h-6 text-ink" />
            <h3 className="font-serif text-2xl font-bold uppercase tracking-wider">Key Takeaways</h3>
          </div>
          <ul className="space-y-4 font-mono text-sm opacity-80">
            {caseData.lessons.slice(0, 3).map((lesson: any, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-ink">{lesson.title}</strong>
                  <span>{lesson.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  };

  const renderMarketAutopsy = () => {
    const { scenario, allocations, finalValue, investors, history } = data;
    const initialInvestment = history[0].value;
    const totalReturn = ((finalValue - initialInvestment) / initialInvestment) * 100;

    return (
      <div className="space-y-12">
        {/* Outcome Summary */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="newspaper-card p-8 bg-ink text-parchment">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" /> Final Outcome
            </h3>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between border-b border-parchment/20 pb-2">
                <span className="opacity-70">Initial Capital</span>
                <span className="font-bold">${initialInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-parchment/20 pb-2">
                <span className="opacity-70">Final Value</span>
                <span className="font-bold">${finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="opacity-70">Total Return</span>
                <span className={`font-bold ${totalReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalReturn > 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="newspaper-card p-8 bg-parchment border-4 border-dark-sepia">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" /> NPC Comparison
            </h3>
            <div className="space-y-4">
              {investors.slice(0, 3).map((npc: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border-b border-tan-mid pb-2 last:border-0">
                  <div>
                    <span className="font-bold">{npc.name}</span>
                    <p className="text-xs font-mono opacity-70">{npc.philosophy}</p>
                  </div>
                  <span className={`font-bold font-mono ${npc.returnPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {npc.returnPercentage > 0 ? '+' : ''}{npc.returnPercentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Event Attribution */}
        {data.eventAttribution && data.eventAttribution.length > 0 && (
          <section className="newspaper-card p-8 border-4 border-rust/30 bg-rust/5">
            <div className="flex items-center gap-3 mb-6 border-b-2 border-rust/30 pb-2">
              <AlertCircle className="w-6 h-6 text-rust" />
              <h3 className="font-serif text-2xl font-bold uppercase tracking-wider text-rust">Event Attribution</h3>
            </div>
            <div className="space-y-4">
              {data.eventAttribution.map((event: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-parchment border border-rust/20">
                  <div className="bg-rust text-parchment px-3 py-1 font-mono text-xs font-bold uppercase">
                    Month {event.month}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-ink">{event.event}</h4>
                    <p className="text-sm font-mono mt-1 opacity-80">
                      Your portfolio {event.impact > 0 ? 'gained' : 'lost'} <span className={`font-bold ${event.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.abs(event.impact).toFixed(1)}%</span> due to this event.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* What If Slider (Market) */}
        <section className="newspaper-card p-8 border-4 border-sepia">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-dark-sepia pb-2">
            <SlidersHorizontal className="w-6 h-6 text-ink" />
            <h3 className="font-serif text-2xl font-bold uppercase tracking-wider">"What If" Analysis</h3>
          </div>
          
          <div className="mb-8">
            <label className="font-mono text-sm uppercase tracking-widest opacity-70 block mb-4">
              Alternative Initial Allocations
            </label>
            <input 
              type="range" 
              min="0" 
              max="2" 
              value={whatIfIndex} 
              onChange={(e) => setWhatIfIndex(parseInt(e.target.value))}
              className="w-full accent-ink"
            />
            <div className="flex justify-between text-xs font-mono mt-2 opacity-50">
              <span>All Tech</span>
              <span>All Bonds</span>
              <span>Equal Weight</span>
            </div>
          </div>

          <div className="bg-ink/5 p-6 border border-tan-mid">
            <h4 className="font-bold mb-4 text-center">Simulated Outcome</h4>
            <div className="text-center font-mono text-xl">
              {whatIfIndex === 0 && "Tech Boom/Bust: High Volatility"}
              {whatIfIndex === 1 && "Safe Haven: Low Return, Low Risk"}
              {whatIfIndex === 2 && "Balanced: Moderate Growth"}
            </div>
          </div>
        </section>

        {/* Lessons Learned */}
        <section className="newspaper-card p-8">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-dark-sepia pb-2">
            <BookOpen className="w-6 h-6 text-ink" />
            <h3 className="font-serif text-2xl font-bold uppercase tracking-wider">Key Takeaways</h3>
          </div>
          <ul className="space-y-4 font-mono text-sm opacity-80">
            <li className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-ink">Diversification is Key</strong>
                <span>Spreading investments reduces exposure to single-sector shocks.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-ink">Market Timing is Difficult</strong>
                <span>Consistent allocation often beats trying to predict market tops and bottoms.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-ink">Stay the Course</strong>
                <span>Long-term strategies generally outperform reactive, emotion-driven trading.</span>
              </div>
            </li>
          </ul>
        </section>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-parchment w-full max-w-5xl max-h-[90vh] overflow-y-auto border-4 border-dark-sepia shadow-[12px_12px_0px_var(--ink)] relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-tan-mid transition-colors z-10"
          >
            <X className="w-6 h-6 text-ink" />
          </button>

          <div className="p-8 md:p-12 space-y-12">
            <div className="text-center space-y-4 border-b-2 border-dark-sepia pb-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Decision Autopsy</h2>
              <p className="text-xl font-mono opacity-60 uppercase tracking-widest">
                {type === 'boardroom' ? 'Strategic Case Review' : 'Market Cycle Analysis'}
              </p>
            </div>

            {type === 'boardroom' ? renderBoardroomAutopsy() : renderMarketAutopsy()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
