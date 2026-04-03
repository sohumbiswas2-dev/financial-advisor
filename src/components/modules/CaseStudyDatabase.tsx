import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, History, Users, Scale } from 'lucide-react';

interface CaseStudy {
  id: string;
  year: string;
  title: string;
  category: string;
  summary: string;
  keyPlayers: string[];
  impact: string;
}

export const CaseStudyDatabase: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    import('../../data/case-studies.json').then(data => {
      setCaseStudies(data.default || data);
    });
  }, []);

  const categories = Array.from(new Set(caseStudies.map(c => c.category)));

  const filteredStudies = caseStudies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          study.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? study.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12 max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4 flex items-center justify-center gap-4">
          <History className="w-12 h-12 text-sepia" />
          Historical Case Studies
        </h2>
        <p className="text-xl italic opacity-80 max-w-2xl mx-auto">
          A database of major financial events, crises, and turning points in economic history.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-parchment border-4 border-dark-sepia p-6 shadow-[8px_8px_0px_0px_var(--sepia)]">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50" />
          <input 
            type="text" 
            placeholder="Search case studies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-tan-light border-2 border-dark-sepia pl-10 pr-4 py-3 font-mono focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-5 h-5 text-ink/50 shrink-0" />
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
              selectedCategory === null ? 'bg-ink text-parchment' : 'border border-dark-sepia hover:bg-tan-light'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-ink text-parchment' : 'border border-dark-sepia hover:bg-tan-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {filteredStudies.map(study => (
          <div key={study.id} className="newspaper-card p-8 md:p-10 border-4 border-dark-sepia bg-parchment shadow-[8px_8px_0px_0px_var(--sepia)]">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 space-y-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-dark-sepia border-b border-dark-sepia pb-1">
                    {study.category}
                  </span>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mt-4 leading-tight">{study.title}</h3>
                  <div className="font-mono text-2xl font-bold text-rust mt-2">{study.year}</div>
                </div>

                <div className="p-4 bg-tan-light border-l-4 border-ink space-y-2">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-2">
                    <Users className="w-3 h-3" /> Key Players
                  </h4>
                  <ul className="list-disc list-inside text-sm font-bold">
                    {study.keyPlayers.map((player, idx) => (
                      <li key={idx}>{player}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="md:w-2/3 space-y-8">
                <div className="space-y-2">
                  <h4 className="font-mono text-xs uppercase tracking-widest opacity-60">Summary</h4>
                  <p className="text-lg font-serif leading-relaxed">{study.summary}</p>
                </div>

                <div className="p-6 bg-sepia/10 border-l-4 border-sepia space-y-2">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-sepia flex items-center gap-2">
                    <Scale className="w-4 h-4" /> Lasting Impact
                  </h4>
                  <p className="text-base leading-relaxed italic">{study.impact}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredStudies.length === 0 && (
          <div className="text-center p-12 border-4 border-dark-sepia border-dashed opacity-50">
            <p className="text-xl font-mono uppercase tracking-widest">No case studies found matching your criteria.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
