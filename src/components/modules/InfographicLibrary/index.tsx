import React from 'react';

export const SupplyDemand = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="130" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
    <line x1="40" y1="40" x2="160" y2="110" stroke="#ef4444" strokeWidth="3" />
    <line x1="40" y1="110" x2="160" y2="40" stroke="#22c55e" strokeWidth="3" />
    <text x="165" y="115" fontSize="10" fill="currentColor">D</text>
    <text x="165" y="45" fontSize="10" fill="currentColor">S</text>
    <text x="90" y="145" fontSize="10" fill="currentColor">Quantity</text>
    <text x="5" y="80" fontSize="10" fill="currentColor" transform="rotate(-90 5 80)">Price</text>
  </svg>
);

export const BondYield = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="130" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
    <path d="M 40 40 Q 100 110 160 110" fill="none" stroke="#eab308" strokeWidth="3" />
    <text x="90" y="145" fontSize="10" fill="currentColor">Yield</text>
    <text x="5" y="80" fontSize="10" fill="currentColor" transform="rotate(-90 5 80)">Bond Price</text>
  </svg>
);

export const DebtToEquity = ({ debt = 60, equity = 40 }) => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <rect x="60" y={130 - equity} width="80" height={equity} fill="#3b82f6" />
    <rect x="60" y={130 - equity - debt} width="80" height={debt} fill="#ef4444" />
    <text x="150" y={130 - equity / 2} fontSize="10" fill="currentColor">Equity ({equity}%)</text>
    <text x="150" y={130 - equity - debt / 2} fontSize="10" fill="currentColor">Debt ({debt}%)</text>
  </svg>
);

export const CompoundInterest = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="130" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
    <path d="M 20 130 Q 120 120 180 30" fill="none" stroke="#22c55e" strokeWidth="3" />
    <line x1="20" y1="130" x2="180" y2="80" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
    <text x="90" y="145" fontSize="10" fill="currentColor">Time</text>
    <text x="5" y="80" fontSize="10" fill="currentColor" transform="rotate(-90 5 80)">Value</text>
  </svg>
);

export const RiskReturn = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="130" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="130" x2="170" y2="30" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
    <circle cx="40" cy="110" r="4" fill="#3b82f6" />
    <circle cx="80" cy="90" r="4" fill="#eab308" />
    <circle cx="120" cy="60" r="4" fill="#f97316" />
    <circle cx="160" cy="40" r="4" fill="#ef4444" />
    <text x="90" y="145" fontSize="10" fill="currentColor">Risk</text>
    <text x="5" y="80" fontSize="10" fill="currentColor" transform="rotate(-90 5 80)">Return</text>
  </svg>
);

export const YieldCurve = ({ inverted = false }) => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="130" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
    {inverted ? (
      <path d="M 30 50 Q 100 110 170 120" fill="none" stroke="#ef4444" strokeWidth="3" />
    ) : (
      <path d="M 30 110 Q 100 50 170 40" fill="none" stroke="#22c55e" strokeWidth="3" />
    )}
    <text x="90" y="145" fontSize="10" fill="currentColor">Maturity</text>
    <text x="5" y="80" fontSize="10" fill="currentColor" transform="rotate(-90 5 80)">Yield</text>
  </svg>
);

export const DollarCostAveraging = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="130" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
    <path d="M 20 80 L 60 40 L 100 100 L 140 60 L 180 90" fill="none" stroke="#94a3b8" strokeWidth="2" />
    <circle cx="20" cy="80" r="3" fill="#22c55e" />
    <circle cx="60" cy="40" r="3" fill="#22c55e" />
    <circle cx="100" cy="100" r="3" fill="#22c55e" />
    <circle cx="140" cy="60" r="3" fill="#22c55e" />
    <circle cx="180" cy="90" r="3" fill="#22c55e" />
    <text x="90" y="145" fontSize="10" fill="currentColor">Time</text>
    <text x="5" y="80" fontSize="10" fill="currentColor" transform="rotate(-90 5 80)">Price</text>
  </svg>
);

export const Diversification = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <circle cx="100" cy="75" r="50" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M 100 75 L 100 25 A 50 50 0 0 1 150 75 Z" fill="#3b82f6" />
    <path d="M 100 75 L 150 75 A 50 50 0 0 1 75 118 Z" fill="#22c55e" />
    <path d="M 100 75 L 75 118 A 50 50 0 0 1 50 75 Z" fill="#eab308" />
    <path d="M 100 75 L 50 75 A 50 50 0 0 1 100 25 Z" fill="#ef4444" />
  </svg>
);

export const PERatio = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="130" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
    <path d="M 20 100 L 180 40" fill="none" stroke="#3b82f6" strokeWidth="2" />
    <path d="M 20 120 L 180 80" fill="none" stroke="#22c55e" strokeWidth="2" />
    <text x="185" y="45" fontSize="10" fill="#3b82f6">Price</text>
    <text x="185" y="85" fontSize="10" fill="#22c55e">Earnings</text>
  </svg>
);

export const FreeCashFlow = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" />
    <rect x="50" y="50" width="40" height="80" fill="#3b82f6" />
    <rect x="110" y="70" width="40" height="60" fill="#22c55e" />
    <text x="55" y="145" fontSize="10" fill="currentColor">Earnings</text>
    <text x="120" y="145" fontSize="10" fill="currentColor">FCF</text>
  </svg>
);

export const LeverageMultiplier = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" />
    <rect x="40" y="90" width="30" height="40" fill="#3b82f6" />
    <rect x="90" y="50" width="30" height="80" fill="#ef4444" />
    <rect x="140" y="30" width="30" height="100" fill="#eab308" />
    <text x="45" y="145" fontSize="10" fill="currentColor">1x</text>
    <text x="95" y="145" fontSize="10" fill="currentColor">2x</text>
    <text x="145" y="145" fontSize="10" fill="currentColor">3x</text>
  </svg>
);

export const OptionsPayoff = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="2" />
    <line x1="100" y1="130" x2="100" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
    <path d="M 20 120 L 100 120 L 160 40" fill="none" stroke="#22c55e" strokeWidth="3" />
    <text x="105" y="145" fontSize="10" fill="currentColor">Strike Price</text>
  </svg>
);

export const MASynergy = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <circle cx="60" cy="75" r="30" fill="#3b82f6" opacity="0.8" />
    <circle cx="100" cy="75" r="30" fill="#eab308" opacity="0.8" />
    <text x="140" y="80" fontSize="16" fill="currentColor" fontWeight="bold">= 3</text>
    <text x="35" y="80" fontSize="16" fill="white" fontWeight="bold">1</text>
    <text x="115" y="80" fontSize="16" fill="white" fontWeight="bold">1</text>
  </svg>
);

export const MarketCycle = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" />
    <path d="M 20 100 Q 60 20 100 75 T 180 50" fill="none" stroke="#3b82f6" strokeWidth="3" />
    <text x="40" y="40" fontSize="10" fill="currentColor">Expansion</text>
    <text x="80" y="30" fontSize="10" fill="currentColor">Peak</text>
    <text x="110" y="110" fontSize="10" fill="currentColor">Contraction</text>
    <text x="150" y="90" fontSize="10" fill="currentColor">Trough</text>
  </svg>
);

export const InterestRateTransmission = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <rect x="20" y="60" width="40" height="30" fill="#3b82f6" rx="4" />
    <text x="25" y="78" fontSize="10" fill="white">Central Bank</text>
    <line x1="60" y1="75" x2="90" y2="75" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
    <rect x="90" y="60" width="40" height="30" fill="#eab308" rx="4" />
    <text x="95" y="78" fontSize="10" fill="white">Banks</text>
    <line x1="130" y1="75" x2="160" y2="75" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
    <rect x="160" y="60" width="40" height="30" fill="#22c55e" rx="4" />
    <text x="162" y="78" fontSize="10" fill="white">Economy</text>
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
      </marker>
    </defs>
  </svg>
);
