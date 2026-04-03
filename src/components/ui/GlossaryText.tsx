import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { simpleTerms } from '../../data/simpleTerms';

const advancedTerms: Record<string, { pro: string, beginner: string }> = {
  'Quantitative Easing': {
    pro: 'A monetary policy where a central bank buys government bonds or other financial assets to inject money into the economy to expand economic activity.',
    beginner: 'When the government creates new money and pumps it into the economy to try and make it grow faster.'
  },
  'P/E Ratio': {
    pro: 'Price-to-Earnings Ratio. The ratio for valuing a company that measures its current share price relative to its per-share earnings.',
    beginner: 'A quick way to check if a stock is expensive. It compares the price of a stock to how much profit the company actually makes.'
  },
  'Yield Curve': {
    pro: 'A line that plots yields (interest rates) of bonds having equal credit quality but differing maturity dates.',
    beginner: 'A chart that shows if investors are feeling safe or scared about the future of the economy.'
  },
  'Inflation': {
    pro: 'The rate at which the general level of prices for goods and services is rising, and, consequently, the purchasing power of currency is falling.',
    beginner: 'When things you buy (like food or gas) keep getting more expensive, meaning your money buys less than it used to.'
  },
  'Interest Rate': {
    pro: 'The amount charged, expressed as a percentage of principal, by a lender to a borrower for the use of assets.',
    beginner: 'The cost of borrowing money, or the reward you get for saving it in a bank.'
  },
  'Recession': {
    pro: 'A macroeconomic term that refers to a significant decline in general economic activity in a designated region.',
    beginner: 'A period when the economy is shrinking, businesses are struggling, and people are losing their jobs.'
  },
  'Bull Market': {
    pro: 'A market in which share prices are rising, encouraging buying.',
    beginner: 'When the overall stock market is going up and people are feeling positive and greedy.'
  },
  'Bear Market': {
    pro: 'A market in which prices are falling, encouraging selling.',
    beginner: 'When the overall stock market is going down and investors are feeling scared and selling off.'
  },
  'Dividend': {
    pro: 'A distribution of a portion of a company\'s earnings, decided by the board of directors, paid to a class of its shareholders.',
    beginner: 'A cash bonus that a company pays out to the people who own its stock, just for holding onto it.'
  },
  'Volatility': {
    pro: 'A statistical measure of the dispersion of returns for a given security or market index.',
    beginner: 'When stock prices jump up and down wildly and unpredictably.'
  },
  'Liquidity': {
    pro: 'The degree to which an asset or security can be quickly bought or sold in the market without affecting the asset\'s price.',
    beginner: 'How easy it is to quickly turn your investments into straight cash without losing money.'
  },
  'Hedge Fund': {
    pro: 'A pooled investment fund that trades in relatively liquid assets and is able to make extensive use of more complex trading, portfolio-construction and risk management techniques.',
    beginner: 'A private group of very rich investors who use aggressive and risky strategies to try and beat the market.'
  },
  'Index Fund': {
    pro: 'A type of mutual fund or exchange-traded fund (ETF) with a portfolio constructed to match or track the components of a financial market index.',
    beginner: 'A safe, boring investment that just buys a tiny bit of every company in the stock market instead of trying to pick winners.'
  },
  'Value Investing': {
    pro: 'An investment strategy that involves picking stocks that appear to be trading for less than their intrinsic or book value.',
    beginner: 'Looking for "bargain" companies that are selling for less than they are actually worth, hoping they bounce back.'
  },
  'Growth Investing': {
    pro: 'An investment style and strategy that is focused on increasing an investor\'s capital. Growth investors typically invest in growth stocks.',
    beginner: 'Investing in fast-growing new companies that might change the world, even if they are very expensive right now.'
  }
};

const glossary: Record<string, string> = {
  ...simpleTerms,
  ...Object.fromEntries(Object.keys(advancedTerms).map(k => [k, advancedTerms[k].pro]))
};

interface GlossaryTextProps {
  text: string;
  beginnerMode?: boolean;
}

export const GlossaryText: React.FC<GlossaryTextProps> = ({ text, beginnerMode = false }) => {
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);
  const [clickedTerm, setClickedTerm] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Create a regex to match any of the glossary terms (case-insensitive)
  // Sort terms by length descending to match longer phrases first
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the matched term
    const term = match[0];
    const originalTerm = terms.find(t => t.toLowerCase() === term.toLowerCase()) || term;
    
    parts.push(
      <span
        key={match.index}
        className={`cursor-help relative inline-block transition-colors duration-200 ${
          beginnerMode 
            ? 'bg-sepia/10 border-b-2 border-sepia font-bold text-sepia' 
            : 'border-b border-dotted border-ink'
        }`}
        onMouseEnter={(e) => {
          if (!clickedTerm) {
            setHoveredTerm(originalTerm);
            setMousePos({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseMove={(e) => {
          if (!clickedTerm) {
            setMousePos({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseLeave={() => setHoveredTerm(null)}
        onClick={(e) => {
          e.stopPropagation();
          setClickedTerm(clickedTerm === originalTerm ? null : originalTerm);
          setHoveredTerm(null);
        }}
      >
        {term}
      </span>
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <span onClick={() => setClickedTerm(null)} className="relative inline">
      {parts.length > 0 ? parts : text}
      {createPortal(
        <AnimatePresence>
          {(hoveredTerm || clickedTerm) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed z-[9999] p-4 max-w-xs text-sm font-mono shadow-[8px_8px_0px_var(--ink)] border-2 border-ink ${
                clickedTerm ? 'bg-parchment pointer-events-auto' : 'bg-ink text-parchment pointer-events-none'
              }`}
              style={clickedTerm ? {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'fixed'
              } : { 
                left: Math.min(mousePos.x + 15, window.innerWidth - 320), 
                top: Math.min(mousePos.y + 15, window.innerHeight - 150) 
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <strong className={`block uppercase tracking-widest ${clickedTerm ? 'text-sepia' : 'text-tan-mid'}`}>
                  {clickedTerm || hoveredTerm}
                </strong>
                {clickedTerm && (
                  <button 
                    onClick={() => setClickedTerm(null)}
                    className="text-ink hover:text-sepia text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className={clickedTerm ? 'text-ink leading-relaxed' : 'text-parchment leading-relaxed'}>
                {advancedTerms[clickedTerm || hoveredTerm || ''] 
                  ? (beginnerMode ? advancedTerms[clickedTerm || hoveredTerm || ''].beginner : advancedTerms[clickedTerm || hoveredTerm || ''].pro)
                  : glossary[clickedTerm || hoveredTerm || '']}
              </div>
              {clickedTerm && (
                <div className="mt-4 pt-2 border-t border-tan-mid text-[10px] uppercase tracking-widest text-sepia font-bold">
                  Click anywhere to close
                </div>
              )}
            </motion.div>
          )}
          {clickedTerm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/20 backdrop-blur-[2px] z-[9998] pointer-events-auto"
              onClick={() => setClickedTerm(null)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
};
