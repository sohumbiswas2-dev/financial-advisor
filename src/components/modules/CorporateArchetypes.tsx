import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Building2, TrendingUp, ShieldAlert, RefreshCcw, ShieldCheck, Rocket } from 'lucide-react';

const archetypes = [
  {
    id: 'cash-cow',
    name: 'The Cash Cow',
    icon: <Building2 className="w-8 h-8" />,
    definition: 'Mature companies with dominant market share in slow-growing industries. They generate reliable, steady cash flow and typically pay high dividends.',
    examples: 'Consumer Staples, Telecom, established Pharmaceuticals.',
    profile: {
      growth: 20,
      dividend: 90,
      risk: 20,
      capitalIntensity: 40
    },
    bullMarket: 'Underperforms the broader market as investors chase higher growth.',
    bearMarket: 'Outperforms as investors seek safety and reliable dividend income.'
  },
  {
    id: 'growth-engine',
    name: 'The Growth Engine',
    icon: <TrendingUp className="w-8 h-8" />,
    definition: 'Companies expanding rapidly, often reinvesting all profits back into the business rather than paying dividends. They trade at high valuations based on future expectations.',
    examples: 'Tech Disruptors, E-commerce, Cloud Computing.',
    profile: {
      growth: 95,
      dividend: 0,
      risk: 80,
      capitalIntensity: 60
    },
    bullMarket: 'Significantly outperforms as optimism drives up valuation multiples.',
    bearMarket: 'Suffers heavy losses as investors flee high-risk assets and discount future earnings.'
  },
  {
    id: 'turnaround',
    name: 'The Turnaround',
    icon: <ShieldAlert className="w-8 h-8" />,
    definition: 'Struggling companies whose stock prices have plummeted due to poor management, changing consumer tastes, or excessive debt. They offer high reward if new management can fix the core business.',
    examples: 'Legacy Retailers, struggling Auto Manufacturers.',
    profile: {
      growth: 40,
      dividend: 10,
      risk: 95,
      capitalIntensity: 70
    },
    bullMarket: 'Performance depends entirely on the success of the internal restructuring, independent of the market.',
    bearMarket: 'High risk of bankruptcy if credit markets freeze or consumer demand drops further.'
  },
  {
    id: 'cyclical',
    name: 'The Cyclical',
    icon: <RefreshCcw className="w-8 h-8" />,
    definition: 'Companies whose fortunes are heavily tied to the broader economy. When the economy booms, they boom. When it shrinks, they suffer.',
    examples: 'Airlines, Hotels, Steel Manufacturers, Homebuilders.',
    profile: {
      growth: 60,
      dividend: 40,
      risk: 70,
      capitalIntensity: 85
    },
    bullMarket: 'Strong outperformance during economic expansions as consumer and business spending increases.',
    bearMarket: 'Severe underperformance during recessions as demand dries up.'
  },
  {
    id: 'defensive',
    name: 'The Defensive',
    icon: <ShieldCheck className="w-8 h-8" />,
    definition: 'Companies that provide essential goods and services that people buy regardless of the economic climate.',
    examples: 'Utilities, Healthcare Providers, Discount Retailers.',
    profile: {
      growth: 30,
      dividend: 70,
      risk: 15,
      capitalIntensity: 80
    },
    bullMarket: 'Lags the market as investors favor riskier, high-growth assets.',
    bearMarket: 'Holds value well, providing a safe haven and steady income during downturns.'
  },
  {
    id: 'speculative',
    name: 'The Speculative',
    icon: <Rocket className="w-8 h-8" />,
    definition: 'Early-stage companies with unproven business models or products still in development. They often have no revenue but massive potential.',
    examples: 'Pre-revenue Biotech, Space Exploration, early AI startups.',
    profile: {
      growth: 100,
      dividend: 0,
      risk: 100,
      capitalIntensity: 90
    },
    bullMarket: 'Can see exponential gains driven by hype and speculative capital.',
    bearMarket: 'Often wiped out entirely as funding dries up and risk appetite vanishes.'
  }
];

export const CorporateArchetypes: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(archetypes[0].id);

  const selected = archetypes.find(a => a.id === selectedId)!;

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Corporate Archetypes Library</h2>
        <p className="text-lg italic opacity-80 max-w-2xl mx-auto">
          Understand the fundamental DNA of different companies and how they behave across market cycles.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {archetypes.map(arch => (
          <button
            key={arch.id}
            onClick={() => setSelectedId(arch.id)}
            className={`p-4 border-2 flex flex-col items-center text-center gap-3 transition-all ${
              selectedId === arch.id 
                ? 'border-ink bg-ink text-parchment shadow-[4px_4px_0px_var(--sepia)]' 
                : 'border-dark-sepia bg-parchment hover:bg-tan-light'
            }`}
          >
            {arch.icon}
            <span className="font-bold text-sm leading-tight">{arch.name}</span>
          </button>
        ))}
      </div>

      <div className="newspaper-card p-8 md:p-12 bg-parchment border-4 border-dark-sepia shadow-[12px_12px_0px_0px_var(--sepia)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3">
                {selected.icon} {selected.name}
              </h3>
              <p className="text-xl font-serif leading-relaxed">{selected.definition}</p>
            </div>

            <div className="p-4 bg-tan-light border-l-4 border-ink">
              <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-1">Common Examples</span>
              <p className="font-bold">{selected.examples}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-green-600/30 bg-green-600/5">
                <span className="font-mono text-xs uppercase tracking-widest text-green-700 block mb-2">Bull Market Behavior</span>
                <p className="text-sm">{selected.bullMarket}</p>
              </div>
              <div className="p-4 border border-rust/30 bg-rust/5">
                <span className="font-mono text-xs uppercase tracking-widest text-rust block mb-2">Bear Market Behavior</span>
                <p className="text-sm">{selected.bearMarket}</p>
              </div>
            </div>
          </div>

          <div className="h-[400px] flex items-center justify-center bg-ink/5 p-8 rounded-full border border-ink/10">
            <Radar 
              data={{
                labels: ['Growth Potential', 'Dividend Yield', 'Risk Level', 'Capital Intensity'],
                datasets: [{
                  label: selected.name,
                  data: [selected.profile.growth, selected.profile.dividend, selected.profile.risk, selected.profile.capitalIntensity],
                  backgroundColor: 'rgba(20, 20, 20, 0.2)',
                  borderColor: 'rgba(20, 20, 20, 1)',
                  borderWidth: 2,
                  pointBackgroundColor: 'rgba(20, 20, 20, 1)',
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    angleLines: { color: 'rgba(20, 20, 20, 0.1)' },
                    grid: { color: 'rgba(20, 20, 20, 0.1)' },
                    pointLabels: { font: { family: 'Special Elite', size: 12 }, color: 'rgba(20, 20, 20, 0.8)' },
                    ticks: { display: false },
                    min: 0,
                    max: 100
                  }
                },
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
