/// <reference types="vite/client" />
import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  History, 
  Briefcase, 
  PieChart, 
  Award,
  ChevronRight,
  RefreshCcw,
  ArrowRight,
  Activity,
  Globe,
  Layers,
  BarChart3,
  Scale,
  Zap,
  Pause,
  Play,
  Newspaper,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Target,
  Lock,
  Trophy,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import scenariosData from './data/scenarios.json';
import boardroomData from './data/boardroom.json';
import { detailedCompanyInfo } from './data/companyInfo';

import { LivingNewsFeed } from './components/modules/LivingNewsFeed';
import { FearGreedDial } from './components/modules/FearGreedDial';
import { SectorHeatMap } from './components/modules/SectorHeatMap';
import { MacroPulseCards } from './components/modules/MacroPulseCards';
import { MarketTimelineStrip } from './components/modules/MarketTimelineStrip';
import { ProgressiveLessons } from './components/modules/ProgressiveLessons';
import { CompetitorBoard } from './components/modules/CompetitorBoard';
import { PostGameDebrief } from './components/modules/PostGameDebrief';
import { DecisionAutopsyModal } from './components/modules/DecisionAutopsyModal';
import { ConflictingMentors } from './components/modules/ConflictingMentors';
import { getMentorAdvice, MentorAdvice } from './data/mentorLogic';

ChartJS.register(...registerables);

interface Company {
  name: string;
  sector: string;
  initialPrice: number;
  finalPrice: number;
  description: string;
}

interface Sector {
  name: string;
  performance: string;
  description: string;
  companies: Company[];
}

interface TimelineEvent {
  year: number;
  event: string;
}

interface MacroData {
  interestRate: number[];
  inflation: number[];
  gdpGrowth: number[];
  unemployment: number[];
}

interface Lesson {
  title: string;
  text: string;
}

interface MonthlyEvent {
  date: string;
  headline: string;
  description: string;
  impact: string;
  macro?: {
    interestRate: number;
    inflation: number;
    gdpGrowth: number;
    unemployment: number;
  };
  lesson?: Lesson;
}

interface Scenario {
  id: string;
  name: string;
  year: number;
  description: string;
  macro: MacroData;
  timeline: TimelineEvent[];
  sectors: Sector[];
  lessons: Lesson[];
  months: MonthlyEvent[];
  events?: {
    triggerMonth: number;
    title: string;
    description: string;
    sectorImpacts: Record<string, number>; // e.g., { "Energy": 1.15, "Technology": 0.9 }
  }[];
}

interface BoardroomOption {
  id: string;
  text: string;
  impact: Record<string, number>;
  stakeholderImpact?: {
    shareholders: number; // e.g., +5 for +5%
    employees: number;    // e.g., -10 for -10% retention
    creditors: number;    // e.g., +5 to score
    regulators: number;   // e.g., -5 to score
    media: number;        // e.g., +20 to sentiment
  };
  lesson: string;
  teachMe?: {
    principleName: string;
    definition: string;
    infographicId: string;
    example: string;
    application: string;
  };
}

interface BoardroomRound {
  step: number;
  title: string;
  description: string;
  options: BoardroomOption[];
}

interface BoardroomCase {
  id: string;
  company: string;
  year: number;
  industryContext: string;
  financialSituation: {
    revenue?: string;
    subscribers?: string;
    marketCap?: string;
    cashOnHand?: string;
    cashBurn?: string;
    stockPrice?: string;
    stores?: string;
    stockStatus?: string;
    cableProfit?: string;
    licensingRev?: string;
    marketShare?: string;
    revenue_eur?: string;
    metrics: { label: string; value: string }[];
  };
  rounds: BoardroomRound[];
  historicalReality: string;
  lessons: Lesson[];
}

import { TeachMeCard } from './components/modules/TeachMeCard';

import { StakeholderDashboard } from './components/modules/StakeholderDashboard';
import { MacroDashboard } from './components/modules/MacroDashboard';
import { CorporateArchetypes } from './components/modules/CorporateArchetypes';
import { CaseStudyDatabase } from './components/modules/CaseStudyDatabase';
import { GlossaryText } from './components/ui/GlossaryText';
import { DownloadReportButton } from './components/ui/DownloadReportButton';

export default function App() {
  const [currentModule, setCurrentModule] = useState<'archive' | 'boardroom' | 'academy' | 'case-studies'>('archive');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [extendedScenarioData, setExtendedScenarioData] = useState<any>(null);
  const [currentTrigger, setCurrentTrigger] = useState<{ type: string; value?: any }>({ type: 'init' });
  const [step, setStep] = useState<'selection' | 'macro' | 'sectors' | 'portfolio' | 'simulation' | 'result'>('selection');
  
  // Anonymization State
  const [companyMap, setCompanyMap] = useState<Record<string, string>>({});
  const [companyDetails, setCompanyDetails] = useState<Record<string, { overview: string, investmentCase: string }>>({});
  
  // Market Event State
  const [currentMarketEvent, setCurrentMarketEvent] = useState<{ title: string, description: string, sectorImpacts: Record<string, number>, lessonId?: string } | null>(null);
  const [eventAttribution, setEventAttribution] = useState<{ event: string; impact: number; month: number }[]>([]);

  // Result Gamification State
  const [lastXpGained, setLastXpGained] = useState(0);
  const [lastRepChange, setLastRepChange] = useState(0);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [blackSwansEnabled, setBlackSwansEnabled] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (selectedScenario) {
      const map: Record<string, string> = {};
      const details: Record<string, { overview: string, investmentCase: string }> = {};
      let counter = 1;
      selectedScenario.sectors.forEach(sector => {
        sector.companies.forEach(company => {
          // A, B, C... AA, AB...
          let name = '';
          let temp = counter;
          while (temp > 0) {
            let rem = (temp - 1) % 26;
            name = String.fromCharCode(65 + rem) + name;
            temp = Math.floor((temp - rem) / 26);
          }
          const anonymizedName = `Company ${name}`;
          map[company.name] = anonymizedName;
          
          // Add detailed info if available, otherwise use a generic fallback
          details[company.name] = detailedCompanyInfo[company.name] || {
            overview: company.description || "A significant player in its respective sector with established operations.",
            investmentCase: "A potential candidate for diversification within this historical context."
          };

          counter++;
        });
      });
      setCompanyMap(map);
      setCompanyDetails(details);
    }
  }, [selectedScenario]);

  // Gamification State
  const [xp, setXp] = useState(() => Number(localStorage.getItem('fa_xp')) || 0);
  const [reputation, setReputation] = useState(() => Number(localStorage.getItem('fa_reputation')) || 50);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('fa_badges');
    return saved ? JSON.parse(saved) : [];
  });

  // Black Swan State
  const [currentBlackSwan, setCurrentBlackSwan] = useState<{headline: string, impactText: string} | null>(null);

  useEffect(() => {
    localStorage.setItem('fa_xp', xp.toString());
    localStorage.setItem('fa_reputation', reputation.toString());
    localStorage.setItem('fa_badges', JSON.stringify(unlockedBadges));
  }, [xp, reputation, unlockedBadges]);

  const resetProgress = () => {
    if(window.confirm("Are you sure you want to reset all progress, badges, and reputation?")) {
      setXp(0);
      setReputation(50);
      setUnlockedBadges([]);
    }
  };
  
  // Competitors State
  const [competitorPortfolios, setCompetitorPortfolios] = useState<Record<string, number>>({
    'Value Investor': 10000,
    'Growth Investor': 10000,
    'Hedge Fund': 10000,
    'Index Fund': 10000
  });
  const [competitorThoughts, setCompetitorThoughts] = useState<Record<string, string>>({});
  
  // Academy State
  const [academyTopics, setAcademyTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [academyView, setAcademyView] = useState<'curriculum' | 'archetypes'>('curriculum');

  // Autopsy State
  const [isAutopsyOpen, setIsAutopsyOpen] = useState(false);
  const [autopsyType, setAutopsyType] = useState<'boardroom' | 'market'>('boardroom');
  const [autopsyData, setAutopsyData] = useState<any>(null);

  useEffect(() => {
    import('./data/academy.json').then(data => setAcademyTopics(data.default || data));
  }, []);
  
  // Boardroom State
  const [selectedBoardroomCase, setSelectedBoardroomCase] = useState<BoardroomCase | null>(null);
  const [currentBoardroomRound, setCurrentBoardroomRound] = useState(0);
  const [boardroomDecisions, setBoardroomDecisions] = useState<BoardroomOption[]>([]);
  const [boardroomStep, setBoardroomStep] = useState<'selection' | 'meeting' | 'decision' | 'outcome' | 'summary'>('selection');
  const [boardroomMetrics, setBoardroomMetrics] = useState<Record<string, number[]>>({});
  const [stakeholderMetrics, setStakeholderMetrics] = useState<{
    shareholders: number[];
    employees: number;
    creditors: number;
    regulators: number;
    media: number;
  }>({
    shareholders: [0],
    employees: 85,
    creditors: 75,
    regulators: 80,
    media: 10
  });
  
  // Portfolio State
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [allocations, setAllocations] = useState<Record<string, number>>({}); // companyName -> amount
  const [horizon, setHorizon] = useState<number>(10);
  const [riskTolerance, setRiskTolerance] = useState<number>(50); // 0-100
  const [leverage, setLeverage] = useState<number>(1); // 1x to 3x

  // Simulation State
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulatedData, setSimulatedData] = useState<number[]>([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [cash, setCash] = useState(0);
  const [currentHoldings, setCurrentHoldings] = useState<Record<string, number>>({}); // companyName -> current value
  const [simulationHistory, setSimulationHistory] = useState<{date: string, value: number}[]>([]);

  const [currentNews, setCurrentNews] = useState<string>("");
  const [mentorAdvice, setMentorAdvice] = useState<MentorAdvice[]>([]);

  // Update Mentor Advice when news changes
  useEffect(() => {
    if (selectedScenario && selectedScenario.months[currentMonthIndex]) {
      // Clear advice first for visual feedback of change
      setMentorAdvice([]);
      
      const timer = setTimeout(() => {
        const currentEvent = selectedScenario.months[currentMonthIndex];
        // Basic sentiment detection
        let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
        const headline = currentEvent.headline.toLowerCase();
        if (headline.includes('surge') || headline.includes('boom') || headline.includes('recovery') || headline.includes('profit')) {
          sentiment = 'bullish';
        } else if (headline.includes('crash') || headline.includes('collapse') || headline.includes('crisis') || headline.includes('failure') || headline.includes('panic')) {
          sentiment = 'bearish';
        }
        
        const advice = getMentorAdvice(currentEvent.headline, sentiment, beginnerMode, selectedScenario.id, currentMonthIndex);
        setMentorAdvice(advice);
      }, 300); // Small delay for effect

      return () => clearTimeout(timer);
    }
  }, [currentMonthIndex, selectedScenario, beginnerMode]);

  // Boardroom Logic
  const handleSelectBoardroomCase = (caseStudy: BoardroomCase) => {
    setSelectedBoardroomCase(caseStudy);
    setCurrentBoardroomRound(0);
    setBoardroomDecisions([]);
    setBoardroomStep('meeting');
    setStakeholderMetrics({
      shareholders: [0],
      employees: 85,
      creditors: 75,
      regulators: 80,
      media: 10
    });
    
    // Initialize metrics with base values (100 as index)
    const initialMetrics: Record<string, number[]> = {};
    const firstRound = caseStudy.rounds[0];
    if (firstRound) {
      Object.keys(firstRound.options[0].impact).forEach(key => {
        initialMetrics[key] = [100];
      });
    }
    setBoardroomMetrics(initialMetrics);
  };

  const handleBoardroomDecision = (option: BoardroomOption) => {
    const newDecisions = [...boardroomDecisions, option];
    setBoardroomDecisions(newDecisions);
    
    // Update metrics based on impact
    const newMetrics = { ...boardroomMetrics };
    Object.entries(option.impact).forEach(([key, multiplier]) => {
      if (newMetrics[key]) {
        const lastValue = newMetrics[key][newMetrics[key].length - 1];
        newMetrics[key] = [...newMetrics[key], lastValue * multiplier];
      }
    });
    setBoardroomMetrics(newMetrics);

    if (option.stakeholderImpact) {
      setStakeholderMetrics(prev => ({
        shareholders: [...prev.shareholders, prev.shareholders[prev.shareholders.length - 1] + option.stakeholderImpact!.shareholders],
        employees: Math.max(0, Math.min(100, prev.employees + option.stakeholderImpact!.employees)),
        creditors: Math.max(0, Math.min(100, prev.creditors + option.stakeholderImpact!.creditors)),
        regulators: Math.max(0, Math.min(100, prev.regulators + option.stakeholderImpact!.regulators)),
        media: Math.max(-100, Math.min(100, prev.media + option.stakeholderImpact!.media))
      }));
    } else {
      // Default impact if not specified
      setStakeholderMetrics(prev => ({
        ...prev,
        shareholders: [...prev.shareholders, prev.shareholders[prev.shareholders.length - 1] + (option.impact.margin > 1 ? 5 : -5)]
      }));
    }

    setBoardroomStep('outcome');
  };

  const nextBoardroomStep = () => {
    if (!selectedBoardroomCase) return;
    
    if (currentBoardroomRound < selectedBoardroomCase.rounds.length - 1) {
      setCurrentBoardroomRound(prev => prev + 1);
      setBoardroomStep('meeting');
    } else {
      setBoardroomStep('summary');
      
      // Calculate Gamification Rewards for Boardroom
      let xpGained = 150; // Base completion
      let repChange = 0;
      
      // Evaluate metrics (e.g., stockPrice, cashFlow)
      if (boardroomMetrics['stockPrice'] && boardroomMetrics['stockPrice'].length > 0) {
        const initialStock = boardroomMetrics['stockPrice'][0];
        const finalStock = boardroomMetrics['stockPrice'][boardroomMetrics['stockPrice'].length - 1];
        const stockGrowth = (finalStock - initialStock) / initialStock;
        
        if (stockGrowth > 0.2) {
          xpGained += 150;
          repChange += 5;
        } else if (stockGrowth > 0) {
          xpGained += 50;
          repChange += 2;
        } else if (stockGrowth < -0.1) {
          repChange -= 3;
        }
      }
      
      setXp(prev => prev + xpGained);
      setReputation(prev => Math.max(0, Math.min(100, prev + repChange)));
      setLastXpGained(xpGained);
      setLastRepChange(repChange);
    }
  };

  const totalAllocated = useMemo(() => Object.values(allocations).reduce((a: number, b: number) => a + b, 0), [allocations]);
  const remainingCapital = investmentAmount - totalAllocated;

  const getMacroInsight = (macro: MacroData) => {
    const avgInflation = macro.inflation.reduce((a: number, b: number) => a + b, 0) / macro.inflation.length;
    const avgRates = macro.interestRate.reduce((a: number, b: number) => a + b, 0) / macro.interestRate.length;
    
    if (avgInflation > 5 && avgRates > 5) return "Stagflationary pressure: High prices and high borrowing costs create a challenging environment for growth.";
    if (avgInflation < 2 && avgRates < 2) return "Deflationary risk: Low rates and low inflation suggest economic stagnation or recovery phase.";
    if (avgRates > avgInflation + 3) return "Restrictive policy: Real interest rates are high, likely cooling an overheating economy.";
    return "Balanced environment: Moderate inflation and rates suggest a stable growth trajectory.";
  };

  const getSectorOutlook = (sector: Sector, macro: MacroData) => {
    const avgRates = macro.interestRate.reduce((a: number, b: number) => a + b, 0) / macro.interestRate.length;
    if (sector.name === "Technology" && avgRates > 5) return "Headwinds: High rates discount future earnings of growth stocks.";
    if (sector.name === "Banking" && avgRates > 5) return "Tailwinds: Higher rates can improve net interest margins for lenders.";
    if (sector.name === "Energy" && avgRates < 2) return "Neutral: Energy demand is more tied to global GDP growth than interest rates.";
    return "Stable: Sector performance is expected to track broader market trends.";
  };

  const getRiskAnalysis = (data: number[], initial: number, risk: number, lev: number) => {
    const final = data[data.length - 1];
    const totalReturn = ((final - initial) / initial) * 100;
    
    if (lev > 2 && totalReturn < 0) return "Aggressive leverage backfired. The magnifying effect of borrowed capital turned a market downturn into a significant capital loss.";
    if (risk > 70 && totalReturn > 50) return "High-risk strategy succeeded. Your tolerance for volatility allowed you to capture the full upside of the market boom.";
    if (risk < 30 && totalReturn < 10) return "Conservative approach limited growth. While you avoided major drawdowns, you missed out on significant wealth creation opportunities.";
    return "Balanced strategy. Your portfolio maintained a reasonable risk-reward profile throughout the historical period.";
  };

  const generateDynamicLessons = (scenario: Scenario, data: number[], initial: number, risk: number, lev: number, allocs: Record<string, number>) => {
    const final = data[data.length - 1];
    const totalReturn = ((final - initial) / initial) * 100;
    const dynamicLessons = [...scenario.lessons];

    // Performance Lesson
    if (totalReturn > 50) {
      dynamicLessons.push({
        title: "Capitalizing on Growth",
        text: `Your aggressive allocation during the ${scenario.name} resulted in a ${totalReturn.toFixed(1)}% return, demonstrating how identifying high-growth sectors early can lead to exponential wealth creation.`
      });
    } else if (totalReturn < 0) {
      dynamicLessons.push({
        title: "Capital Preservation",
        text: `The ${totalReturn.toFixed(1)}% loss highlights the importance of defensive positioning during systemic shocks. In the ${scenario.year} era, liquidity was often more valuable than equity.`
      });
    }

    // Leverage Lesson
    if (lev > 1.5) {
      dynamicLessons.push({
        title: "The Double-Edged Sword",
        text: `Using ${lev}x leverage magnified your results. While it boosts returns in bull markets, it significantly increases the risk of a margin call during the volatility seen in this archive.`
      });
    }

    // Sector Lesson
    const topSector = scenario.sectors.reduce((prev, current) => {
      const prevAvg = prev.companies.reduce((acc: number, c) => acc + (c.finalPrice - c.initialPrice) / c.initialPrice, 0) / prev.companies.length;
      const currAvg = current.companies.reduce((acc: number, c) => acc + (c.finalPrice - c.initialPrice) / c.initialPrice, 0) / current.companies.length;
      return currAvg > prevAvg ? current : prev;
    });

    const userInTopSector = Object.keys(allocs).some(name => 
      topSector.companies.some(c => c.name === name)
    );

    if (userInTopSector) {
      dynamicLessons.push({
        title: "Sector Alpha",
        text: `Your exposure to the ${topSector.name} sector was a key driver of performance. This sector outperformed others due to the specific macroeconomic tailwinds of the ${scenario.year}s.`
      });
    }

    return dynamicLessons.slice(-5); // Keep up to 5 lessons
  };

  const projectedReturn = useMemo(() => {
    if (!selectedScenario) return 0;
    const companyData = Object.entries(allocations).map(([name, amt]: [string, number]) => {
      const company = selectedScenario.sectors.flatMap(s => s.companies).find(c => c.name === name);
      if (!company) return 0;
      const totalRoi = (company.finalPrice - company.initialPrice) / company.initialPrice;
      const annualReturn = Math.pow(1 + totalRoi, 1 / 10) - 1; 
      return annualReturn * (amt / investmentAmount);
    });
    const baseReturn = companyData.reduce((a, b) => a + b, 0);
    return baseReturn * leverage * 100; // Percentage
  }, [allocations, selectedScenario, leverage, investmentAmount]);

  const projectedFinalValue = useMemo(() => {
    return investmentAmount * Math.pow(1 + (projectedReturn / 100), horizon);
  }, [investmentAmount, projectedReturn, horizon]);

  const handleScenarioSelect = async (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setStep('macro');
    setAllocations({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      const scenarioModules = import.meta.glob('./data/scenarios/*.json');
      const modulePath = `./data/scenarios/${scenario.id}.json`;
      
      if (scenarioModules[modulePath]) {
        const data = await scenarioModules[modulePath]() as any;
        setExtendedScenarioData(data.default || data);
      } else {
        setExtendedScenarioData(null);
      }
    } catch (error) {
      console.error("Failed to load extended scenario data:", error);
      setExtendedScenarioData(null);
    }
  };

  const handleRunSimulation = () => {
    if (!selectedScenario) return;
    
    // Initialize simulation state
    const initialHoldings: Record<string, number> = {};
    (Object.entries(allocations) as [string, number][]).forEach(([name, amt]) => {
      initialHoldings[name] = amt;
    });
    
    const remainingCapital = investmentAmount - totalAllocated;
    setCash(remainingCapital);
    setCurrentHoldings(initialHoldings);
    setCurrentMonthIndex(0);
    setSimulationHistory([{ date: selectedScenario.months[0]?.date || selectedScenario.year.toString(), value: investmentAmount }]);
    setEventAttribution([]);
    setStep('simulation');
  };

  const advanceMonth = () => {
    if (!selectedScenario || currentMonthIndex >= selectedScenario.months.length - 1) {
      if (currentMonthIndex >= selectedScenario.months.length - 1) {
        // Finalize simulation
        const finalValue = Object.values(currentHoldings).reduce((a: number, b: number) => a + b, 0) + cash;
        setSimulatedData(simulationHistory.map(h => h.value));
        setStep('result');
        
        // Gamification Rewards
        const roi = (finalValue - investmentAmount) / investmentAmount;
        let xpGained = 100; // Base completion XP
        let repChange = 0;
        
        let earnedBadges = [...unlockedBadges];

        if (roi > 0.1) {
          xpGained += 200;
          repChange += 5;
          if (!earnedBadges.includes('rainmaker')) earnedBadges.push('rainmaker');
        } else if (roi > 0) {
          xpGained += 50;
          repChange += 1;
        } else if (roi < -0.2) {
          repChange -= 5;
        }

        if (cash > investmentAmount * 0.5) {
          if (!earnedBadges.includes('cash_king')) earnedBadges.push('cash_king');
        }

        const marketDrop = Math.min(...simulationHistory.map(h => h.value)) < investmentAmount * 0.8;
        if (roi > 0 && marketDrop) {
          if (!earnedBadges.includes('contrarian')) earnedBadges.push('contrarian');
        }

        // Suppose they hold through drop without selling (simplified)
        if (marketDrop && cash < investmentAmount * 0.1) {
          if (!earnedBadges.includes('diamond_hands')) earnedBadges.push('diamond_hands');
        }
        
        setUnlockedBadges(earnedBadges);
        setXp(prev => prev + xpGained);
        setReputation(prev => Math.max(0, Math.min(100, prev + repChange)));
        setLastXpGained(xpGained);
        setLastRepChange(repChange);
      }
      return;
    }

    const nextIndex = currentMonthIndex + 1;
    const currentMonth = selectedScenario.months[nextIndex];
    
    // Check for scenario-specific events
    let activeEvent = null;
    if (selectedScenario.events) {
      const eventForMonth = selectedScenario.events.find(e => e.triggerMonth === nextIndex);
      if (eventForMonth) {
        activeEvent = eventForMonth;
        setCurrentMarketEvent(activeEvent);
      } else {
        setCurrentMarketEvent(null);
      }
    } else {
      setCurrentMarketEvent(null);
    }

    // Black Swan Generation
    let bsSector = '';
    let bsImpact = 0;
    let bsHeadline = '';
    let bsText = '';
    
    setCurrentBlackSwan(null);

    // 8% chance to trigger a black swan event if there isn't already a historical activeEvent AND user opted in
    if (blackSwansEnabled && !activeEvent && Math.random() < 0.08) {
      const isNegative = Math.random() > 0.5;
      bsImpact = isNegative ? -0.15 : 0.15; // 15% shock
      const sectors = Array.from(new Set(selectedScenario.sectors.map((s: any) => s.name))) as string[];
      bsSector = sectors[Math.floor(Math.random() * sectors.length)];
      
      bsHeadline = isNegative ? `Black Swan: Crisis hits ${bsSector}` : `Windfall: Breakthrough in ${bsSector}`;
      bsText = beginnerMode 
        ? `A totally unexpected event just caused companies in ${bsSector} to ${isNegative ? 'crash' : 'shoot up'}!`
        : `An unforeseen macroeconomic shock has caused acute volatility specifically targeting the ${bsSector} sector.`;
      
      setCurrentBlackSwan({ headline: bsHeadline, impactText: bsText });
    }

    // Calculate market movement for this month
    const newHoldings = { ...currentHoldings };
    let totalEventImpactDollar = 0;

    Object.keys(newHoldings).forEach(name => {
      const company = selectedScenario.sectors.flatMap(s => s.companies).find(c => c.name === name);
      const sector = selectedScenario.sectors.find(s => s.companies.some(c => c.name === name));
      
      if (company && sector) {
        const totalRoi = (company.finalPrice - company.initialPrice) / company.initialPrice;
        const monthlyBaseReturn = Math.pow(1 + totalRoi, 1 / (selectedScenario.months.length || 12)) - 1;
        
        // Add some volatility and impact
        const volatility = (Math.random() - 0.5) * 0.05;
        const impactFactor = currentMonth.impact.toLowerCase().includes('decline') || currentMonth.impact.toLowerCase().includes('panic') ? -0.04 : 0.02;
        
        let eventImpact = (activeEvent?.sectorImpacts[sector.name] || 1) - 1;
        
        if (sector.name === bsSector) {
           eventImpact += bsImpact;
        }

        if (activeEvent || bsSector) {
          totalEventImpactDollar += newHoldings[name] * eventImpact;
        }

        newHoldings[name] = newHoldings[name] * (1 + monthlyBaseReturn + volatility + impactFactor + eventImpact);
      }
    });

    if (activeEvent) {
      const previousTotal = (Object.values(currentHoldings) as number[]).reduce((a: number, b: number) => a + b, 0) + cash;
      const impactPercentage = previousTotal > 0 ? (totalEventImpactDollar / previousTotal) * 100 : 0;
      setEventAttribution(prev => [...prev, { event: activeEvent!.title, impact: impactPercentage, month: nextIndex }]);
    }

    const totalValue = (Object.values(newHoldings) as number[]).reduce((a: number, b: number) => a + b, 0) + cash;
    
    // Update Competitors
    const newCompetitorPortfolios = { ...competitorPortfolios };
    const newCompetitorThoughts = { ...competitorThoughts };

    const previousTotal = (Object.values(currentHoldings) as number[]).reduce((a: number, b: number) => a + b, 0) + cash;
    const marketAvgReturn = previousTotal > 0 ? (totalValue / previousTotal) - 1 : 0;
    
    // Determine impact factor for this month to drive competitor logic
    const impactFactor = currentMonth.impact.toLowerCase().includes('decline') || currentMonth.impact.toLowerCase().includes('panic') ? -0.04 : 0.02;

    newCompetitorPortfolios['Index Fund'] *= (1 + marketAvgReturn);
    newCompetitorThoughts['Index Fund'] = "Maintaining passive allocation across all sectors.";

    if (impactFactor < 0) {
      newCompetitorPortfolios['Value Investor'] *= (1 + marketAvgReturn + 0.02); // Outperforms in down market
      newCompetitorThoughts['Value Investor'] = "Market panic creates buying opportunities. Accumulating undervalued assets.";
      
      newCompetitorPortfolios['Growth Investor'] *= (1 + marketAvgReturn - 0.03); // Underperforms in down market
      newCompetitorThoughts['Growth Investor'] = "Taking a hit on high-multiple stocks, but holding for long-term innovation.";
      
      newCompetitorPortfolios['Hedge Fund'] *= (1 + marketAvgReturn - 0.05 + Math.random() * 0.1); // High variance
      newCompetitorThoughts['Hedge Fund'] = "Deploying short strategies to hedge against the downturn.";
    } else {
      newCompetitorPortfolios['Value Investor'] *= (1 + marketAvgReturn - 0.01); 
      newCompetitorThoughts['Value Investor'] = "Valuations are getting stretched. Trimming positions.";
      
      newCompetitorPortfolios['Growth Investor'] *= (1 + marketAvgReturn + 0.03); 
      newCompetitorThoughts['Growth Investor'] = "Momentum is strong. Increasing exposure to tech and consumer discretionary.";
      
      newCompetitorPortfolios['Hedge Fund'] *= (1 + marketAvgReturn + Math.random() * 0.1);
      newCompetitorThoughts['Hedge Fund'] = "Leveraging up on momentum trades. Risk-on environment.";
    }

    setCompetitorPortfolios(newCompetitorPortfolios);
    setCompetitorThoughts(newCompetitorThoughts);

    setCurrentHoldings(newHoldings);
    setCurrentMonthIndex(nextIndex);
    setSimulationHistory(prev => [...prev, { date: currentMonth.date, value: totalValue }]);
    setCurrentTrigger({ type: 'onPeriodChange', value: nextIndex });
  };

  const handleBuy = (companyName: string, amount: number) => {
    if (cash < amount) return;
    setCash(prev => prev - amount);
    setCurrentHoldings(prev => ({
      ...prev,
      [companyName]: (prev[companyName] || 0) + amount
    }));
    setCurrentTrigger({ type: 'onDecision', value: 'buy' });
  };

  const handleSell = (companyName: string, percent: number) => {
    const currentVal = currentHoldings[companyName] || 0;
    const sellAmt = currentVal * (percent / 100);
    setCash(prev => prev + sellAmt);
    setCurrentHoldings(prev => ({
      ...prev,
      [companyName]: currentVal - sellAmt
    }));
    setCurrentTrigger({ type: 'onDecision', value: 'sell' });
  };

  const handleMoveToCash = () => {
    const totalHoldings = Object.values(currentHoldings).reduce((a: number, b: number) => a + b, 0);
    setCash(prev => prev + totalHoldings);
    setCurrentHoldings({});
    setCurrentTrigger({ type: 'onDecision', value: 'sell' });
  };

  useEffect(() => {
    let interval: any;
    if (isAutoPlaying && step === 'simulation') {
      interval = setInterval(() => {
        advanceMonth();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, step, currentMonthIndex]);

  useEffect(() => {
    if (selectedScenario && step === 'simulation') {
      const timelineCount = selectedScenario.timeline.length;
      const index = Math.min(
        Math.floor((simulationProgress / 100) * timelineCount),
        timelineCount - 1
      );
      setCurrentTimelineIndex(index);
      setCurrentNews(selectedScenario.timeline[index]?.event || "Market evolving...");
    }
  }, [simulationProgress, selectedScenario, step]);

  const resetSimulation = () => {
    setSelectedScenario(null);
    setStep('selection');
    setAllocations({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chart Data Helpers
  const macroChartData = (label: string, data: number[], color: string) => ({
    labels: ['Start', 'Phase 1', 'Phase 2', 'Phase 3'],
    datasets: [{
      label,
      data,
      borderColor: color,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: false
    }]
  });

  const portfolioPieData = {
    labels: Object.keys(allocations).length > 0 ? Object.keys(allocations).map(n => companyMap[n] || n) : ['Unallocated'],
    datasets: [{
      data: Object.keys(allocations).length > 0 ? Object.values(allocations) : [investmentAmount],
      backgroundColor: [
        '#2c2c2c', '#555555', '#888888', '#aaaaaa', '#cccccc', '#eeeeee'
      ],
      borderWidth: 1,
      borderColor: '#f4f1ea'
    }]
  };

  return (
    <div className="min-h-screen max-w-[1100px] mx-auto px-6 py-12">
      {/* Header */}
      <header className="text-center mb-12 relative masthead">
        <div className="absolute top-0 left-0 flex gap-4 p-2 bg-tan-light dark:bg-tan-mid border border-tan-mid font-mono text-[10px] uppercase tracking-widest text-ink">
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3 text-sepia" /> LVL {Math.floor(xp / 1000) + 1} ({xp} XP)
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-rust" /> REP: {reputation}
          </div>
        </div>
        <div className="absolute top-0 right-0 flex gap-2 p-1 bg-tan-light dark:bg-tan-mid border border-tan-mid items-center">
          <button 
            onClick={() => setBeginnerMode(!beginnerMode)}
            className={`px-3 py-1 font-mono text-[10px] uppercase transition-all flex items-center gap-2 ${beginnerMode ? 'bg-sepia text-parchment' : 'hover:bg-tan-mid'}`}
            title="Toggle Beginner Mode (Simplified Language)"
          >
            <BookOpen className="w-3 h-3" />
            {beginnerMode ? 'Beginner' : 'Pro'}
          </button>
          <div className="w-px h-4 bg-dark-sepia opacity-30"></div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-2 py-1 hover:bg-tan-mid transition-colors"
            title="Toggle Terminal Theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <div className="w-px h-4 bg-dark-sepia opacity-30"></div>
          <button 
            onClick={() => setBlackSwansEnabled(!blackSwansEnabled)}
            className={`px-3 py-1 font-mono text-[10px] uppercase transition-all flex items-center gap-1 ${blackSwansEnabled ? 'bg-rust text-parchment' : 'hover:bg-tan-mid'}`}
            title="Toggle random Black Swan volatility events"
          >
            <Zap className="w-3 h-3" />
            {blackSwansEnabled ? '🦢 ON' : '🦢 OFF'}
          </button>
          <div className="w-px h-4 bg-dark-sepia opacity-30"></div>
          <button 
            onClick={() => setCurrentModule('archive')}
            className={`px-3 py-1 font-mono text-[10px] uppercase transition-all ${currentModule === 'archive' ? 'bg-sepia text-ink' : 'hover:bg-tan-mid'}`}
          >
            Archive
          </button>
          <button 
            onClick={() => setCurrentModule('boardroom')}
            className={`px-3 py-1 font-mono text-[10px] uppercase transition-all ${currentModule === 'boardroom' ? 'bg-sepia text-ink' : 'hover:bg-tan-mid'}`}
          >
            Boardroom
          </button>
          <button 
            onClick={() => setCurrentModule('case-studies')}
            className={`px-3 py-1 font-mono text-[10px] uppercase transition-all ${currentModule === 'case-studies' ? 'bg-sepia text-ink' : 'hover:bg-tan-mid'}`}
          >
            Case Studies
          </button>
          <button 
            onClick={() => setCurrentModule('academy')}
            className={`px-3 py-1 font-mono text-[10px] uppercase transition-all ${currentModule === 'academy' ? 'bg-sepia text-ink' : 'hover:bg-tan-mid'}`}
          >
            Academy
          </button>
        </div>
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-dark-sepia mb-2 border-b border-dark-sepia pb-1">
          <span>VOL. I NO. 1</span>
          <span>ESTABLISHED IN THE YEAR OF OUR LORD 2025</span>
          <span>PRICE: ONE GOLD COIN</span>
        </div>
        <h1 className="masthead-title mb-2">THE FINANCIAL ARCHIVE</h1>
        <p className="masthead-subtitle">Historical Market Simulation Laboratory</p>
        <div className="section-divider" />
        <div className="flex justify-between text-xs font-mono uppercase tracking-widest opacity-80 text-dark-sepia">
          <span>Archive Serial: {selectedScenario?.id || 'GLOBAL-INDEX'}</span>
          <span>Restricted Economic Records</span>
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </header>

      {/* Stock Ticker */}
      <div className="border-y-2 border-dark-sepia py-2 mb-12 overflow-hidden stock-ticker bg-tan-light dark:bg-tan-mid">
        <div className="stock-ticker-content font-mono text-sm uppercase text-ink font-bold">
          <span className="mx-8">DJIA +1.2%</span>
          <span className="mx-8">NASDAQ -0.5%</span>
          <span className="mx-8">GOLD $1,850</span>
          <span className="mx-8">OIL $72.40</span>
          <span className="mx-8">S&P 500 +0.8%</span>
          <span className="mx-8">BTC $42,000</span>
          <span className="mx-8">EUR/USD 1.08</span>
          <span className="mx-8">NIKKEI +2.1%</span>
          <span className="mx-8">FTSE -0.3%</span>
          <span className="mx-8">BRENT $85.20</span>
          <span className="mx-8">VIX 14.50</span>
        </div>
      </div>

      <main>
        <AnimatePresence mode="wait">
          {currentModule === 'archive' && (
            <>
              {/* Step 1: Selection */}
              {step === 'selection' && (
            <motion.section 
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div className="md:col-span-full mb-6">
                <h2 className="text-4xl mb-2 flex items-center gap-3">
                  <History className="w-10 h-10 text-sepia" />
                  Select Case File
                </h2>
                <p className="text-sepia text-lg italic">Choose a historical epoch to analyze and simulate.</p>
              </div>
              
              {scenariosData.map((scenario: any) => {
                return (
                  <div 
                    key={scenario.id}
                    onClick={() => handleScenarioSelect(scenario)}
                    className="newspaper-card p-8 flex flex-col justify-between group h-full cursor-pointer"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-mono text-sm border border-dark-sepia px-2 py-0.5 bg-parchment">{scenario.year}</span>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-rust" />
                      </div>
                      <h3 className="text-2xl mb-3 flex items-center gap-2">
                        {scenario.name}
                      </h3>
                      <p className="text-ink leading-relaxed text-sm">
                        <GlossaryText text={scenario.description} beginnerMode={beginnerMode} />
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-tan-mid flex items-center gap-2 text-xs font-mono uppercase tracking-tighter text-dark-sepia">
                      <BookOpen className="w-4 h-4" />
                      Access Records
                    </div>
                  </div>
                );
              })}
            </motion.section>
          )}

          {/* Step 2: Macro Context */}
          {step === 'macro' && selectedScenario && (
            <motion.section 
              key="macro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('selection')} className="flex items-center gap-2 font-mono text-sm hover:underline text-rust">
                  <RefreshCcw className="w-4 h-4" /> Back to Archives
                </button>
                <h2 className="text-4xl">Macroeconomic Context</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="newspaper-card p-6">
                  <h4 className="font-mono text-xs uppercase mb-4 border-b border-dark-sepia pb-1">Interest Rates</h4>
                  <div className="h-32">
                    <Line data={macroChartData('Rate %', selectedScenario.macro.interestRate, '#1a1008')} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
                  </div>
                  <p className="text-xs mt-4 opacity-80 italic">Monetary policy stance during the epoch.</p>
                </div>
                <div className="newspaper-card p-6">
                  <h4 className="font-mono text-xs uppercase mb-4 border-b border-dark-sepia pb-1">Inflation</h4>
                  <div className="h-32">
                    <Line data={macroChartData('CPI %', selectedScenario.macro.inflation, '#5c3d0a')} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
                  </div>
                  <p className="text-xs mt-4 opacity-80 italic">Purchasing power and price stability.</p>
                </div>
                <div className="newspaper-card p-6">
                  <h4 className="font-mono text-xs uppercase mb-4 border-b border-dark-sepia pb-1">GDP Growth</h4>
                  <div className="h-32">
                    <Line data={macroChartData('GDP %', selectedScenario.macro.gdpGrowth, '#8b6914')} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
                  </div>
                  <p className="text-xs mt-4 opacity-80 italic">Overall economic output and expansion.</p>
                </div>
                <div className="newspaper-card p-6">
                  <h4 className="font-mono text-xs uppercase mb-4 border-b border-dark-sepia pb-1">Unemployment</h4>
                  <div className="h-32">
                    <Line data={macroChartData('UE %', selectedScenario.macro.unemployment, '#7a2e0a')} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
                  </div>
                  <p className="text-xs mt-4 opacity-80 italic">Labor market health and social impact.</p>
                </div>
              </div>

              <div className="important-panel p-10 bg-tan-light relative">
                <div className="absolute -top-4 -right-4 bg-ink text-parchment px-4 py-1 font-mono text-xs uppercase transform rotate-2 border border-parchment">
                  Archival Analysis
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 column-rule">
                  <div>
                    <h3 className="text-2xl mb-4 flex items-center gap-2"><Globe className="w-6 h-6 text-sepia" /> Market Sentiment</h3>
                    <p className="text-lg italic leading-relaxed">
                      <GlossaryText text={getMacroInsight(selectedScenario.macro)} beginnerMode={beginnerMode} />
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl mb-4 flex items-center gap-2"><Zap className="w-6 h-6 text-sepia" /> Government Policy</h3>
                    <p className="text-lg italic leading-relaxed">
                      <GlossaryText text={`Policy makers focused on ${selectedScenario.macro.inflation[0] > 5 ? 'curbing inflation' : 'stimulating growth'}, leading to significant structural shifts in the ${selectedScenario.sectors[0].name} sector.`} beginnerMode={beginnerMode} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center ornament">
                <button onClick={() => setStep('sectors')} className="primary flex items-center gap-3 mt-8">
                  Explore Sectors <ArrowRight className="w-6 h-6" />
                </button>

              </div>
            </motion.section>
          )}

          {/* Step 3: Sector Exploration */}
          {step === 'sectors' && selectedScenario && (
            <motion.section 
              key="sectors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('macro')} className="flex items-center gap-2 font-mono text-sm hover:underline text-rust">
                  <RefreshCcw className="w-4 h-4" /> Macro Context
                </button>
                <h2 className="text-4xl">Sector Analysis</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedScenario.sectors.map((sector) => (
                  <div key={sector.name} className="newspaper-card p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl">{sector.name}</h3>
                        <span className="px-3 py-1 bg-ink text-parchment text-xs font-mono uppercase">{sector.performance}</span>
                      </div>
                      <p className="text-ink mb-4">{sector.description}</p>
                      <div className="mb-6 p-3 bg-tan-light border-l-2 border-dark-sepia italic text-xs">
                        {getSectorOutlook(sector, selectedScenario.macro)}
                      </div>
                      <div className="space-y-4">
                        <h5 className="font-mono text-xs uppercase opacity-80 text-dark-sepia">Key Assets</h5>
                        <div className="space-y-4">
                          {sector.companies.map(c => (
                            <div key={c.name} className="p-4 bg-parchment border border-tan-mid shadow-sm hover:border-ink transition-colors">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-sm text-ink">{companyMap[c.name]}</span>
                                <span className="text-[10px] font-mono opacity-60 uppercase">Sector: {sector.name}</span>
                              </div>
                              <p className="text-xs italic leading-relaxed text-ink/80 mb-2">
                                <GlossaryText text={companyDetails[c.name]?.overview} beginnerMode={beginnerMode} />
                              </p>
                              <div className="pt-2 border-t border-tan-mid/30">
                                <span className="text-[10px] font-mono font-bold text-sepia uppercase tracking-widest block mb-1">Investment Case</span>
                                <p className="text-[10px] leading-tight opacity-70">
                                  <GlossaryText text={companyDetails[c.name]?.investmentCase} beginnerMode={beginnerMode} />
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 h-24 opacity-30">
                      <Bar 
                        data={{
                          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                          datasets: [{ data: [Math.random()*10, Math.random()*10, Math.random()*10, Math.random()*10], backgroundColor: '#1a1008' }]
                        }}
                        options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center ornament">
                <button onClick={() => setStep('portfolio')} className="primary flex items-center gap-3 mt-8">
                  Build Portfolio <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.section>
          )}

          {/* Step 4: Portfolio Builder */}
          {step === 'portfolio' && selectedScenario && (
            <motion.section 
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('sectors')} className="flex items-center gap-2 font-mono text-sm hover:underline text-rust">
                  <RefreshCcw className="w-4 h-4" /> Sector Analysis
                </button>
                <h2 className="text-4xl">Portfolio Construction</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Controls */}
                <div className="lg:col-span-1 space-y-8 newspaper-card p-8">
                  <div>
                    <label className="block font-mono text-xs uppercase mb-4 flex justify-between text-dark-sepia">
                      Initial Capital <span>${investmentAmount.toLocaleString()}</span>
                    </label>
                    <input 
                      type="range" min="1000" max="100000" step="1000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase mb-4 flex justify-between group relative text-dark-sepia">
                      Investment Horizon <span>{horizon} Years</span>
                      <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-ink text-parchment text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        The duration of your investment. Longer horizons typically allow for compounding but expose you to more historical cycles.
                      </div>
                    </label>
                    <input 
                      type="range" min="1" max="20"
                      value={horizon}
                      onChange={(e) => setHorizon(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase mb-4 flex justify-between group relative text-dark-sepia">
                      Risk Tolerance <span>{riskTolerance}%</span>
                      <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-ink text-parchment text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Higher risk tolerance increases volatility. It magnifies both potential gains and potential losses during market swings.
                      </div>
                    </label>
                    <input 
                      type="range" min="0" max="100"
                      value={riskTolerance}
                      onChange={(e) => setRiskTolerance(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase mb-4 flex justify-between group relative text-dark-sepia">
                      Leverage <span>{leverage}x</span>
                      <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-ink text-parchment text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Borrowing capital to increase investment size. 2x leverage doubles your returns AND your losses. Dangerous in volatile markets.
                      </div>
                    </label>
                    <input 
                      type="range" min="1" max="3" step="0.5"
                      value={leverage}
                      onChange={(e) => setLeverage(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="pt-6 border-t border-tan-mid">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-xs uppercase text-dark-sepia">Remaining Capital</span>
                      <span className={`font-bold ${remainingCapital < 0 ? 'text-rust' : 'text-ink'}`}>
                        ${remainingCapital.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-tan-mid w-full overflow-hidden">
                      <div 
                        className="h-full bg-ink transition-all duration-300" 
                        style={{ width: `${Math.min(100, (totalAllocated / investmentAmount) * 100)}%` }}
                      />
                    </div>
                    <div className="mt-6 pt-4 border-t border-tan-mid">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs uppercase text-dark-sepia">Est. Annual Return</span>
                        <span className={`font-bold ${projectedReturn > 0 ? 'text-ink' : 'text-rust'}`}>
                          {projectedReturn.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-mono text-xs uppercase text-dark-sepia">Est. Final Value</span>
                        <span className="font-bold text-ink">
                          ${projectedFinalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-tan-mid">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-mono text-xs uppercase text-dark-sepia">Portfolio Risk</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 border ${riskTolerance > 70 || leverage > 2 ? 'border-rust text-rust' : 'border-dark-sepia text-dark-sepia opacity-80'}`}>
                            {riskTolerance > 70 || leverage > 2 ? 'HIGH SPECULATION' : riskTolerance < 30 ? 'CONSERVATIVE' : 'BALANCED'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] opacity-80 mt-1 italic text-sepia">Based on historical sector averages for this era.</p>
                    </div>
                  </div>
                </div>

                {/* Center: Allocation */}
                <div className="lg:col-span-1 space-y-6">
                  <h4 className="font-mono text-xs uppercase tracking-widest border-b border-dark-sepia pb-1 text-dark-sepia">Asset Allocation</h4>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {selectedScenario.sectors.flatMap(s => s.companies).map(company => (
                      <div key={company.name} className="newspaper-card p-4">
                        <div className="flex justify-between items-center mb-2 border-b border-tan-mid pb-2">
                          <span className="font-bold text-ink">{companyMap[company.name]}</span>
                          <span className="text-[10px] opacity-60 font-mono text-sepia">{company.sector}</span>
                        </div>
                        <div className="text-[10px] leading-relaxed italic text-ink/80 mb-4 space-y-2">
                          <GlossaryText text={companyDetails[company.name]?.overview} beginnerMode={beginnerMode} />
                        </div>
                        <div className="mb-4 p-2 bg-tan-mid/10 border-l-2 border-sepia">
                          <span className="text-[9px] font-mono font-bold text-sepia uppercase tracking-widest block mb-1">Investment Context</span>
                          <div className="text-[9px] leading-tight opacity-70 italic">
                            <GlossaryText text={companyDetails[company.name]?.investmentCase} beginnerMode={beginnerMode} />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <input 
                            type="number"
                            placeholder="Amount"
                            value={allocations[company.name] || ''}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setAllocations(prev => ({ ...prev, [company.name]: val }));
                            }}
                            className="bg-transparent border-b border-dark-sepia w-24 font-mono text-sm focus:outline-none text-ink"
                          />
                          <button 
                            onClick={() => {
                              const current = allocations[company.name] || 0;
                              setAllocations(prev => ({ ...prev, [company.name]: current + 1000 }));
                            }}
                            className="text-xs border border-ink px-2 py-1 hover:bg-ink hover:text-parchment"
                          >
                            +1k
                          </button>
                          <button 
                            onClick={() => {
                              setAllocations(prev => {
                                const next = { ...prev };
                                delete next[company.name];
                                return next;
                              });
                            }}
                            className="text-xs opacity-40 hover:opacity-100"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Visualization */}
                <div className="lg:col-span-1 space-y-6">
                  <h4 className="font-mono text-xs uppercase tracking-widest border-b border-ink pb-1">Portfolio Mix</h4>
                  <div className="newspaper-card p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-full h-64">
                      <Pie data={portfolioPieData} options={{ plugins: { legend: { position: 'bottom', labels: { font: { family: 'IM Fell English', size: 10 } } } } }} />
                    </div>
                  </div>
                  <div className="p-4 bg-ink/5 border border-ink/10 italic text-sm">
                    "A diversified portfolio across {Object.keys(allocations).length} assets. Leverage of {leverage}x increases both potential gains and systemic risk."
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-10">
                <button 
                  disabled={totalAllocated === 0 || remainingCapital < 0}
                  onClick={handleRunSimulation}
                  className={`px-16 py-5 font-bold text-2xl transition-all flex items-center gap-4 ${totalAllocated > 0 && remainingCapital >= 0 ? 'bg-ink text-parchment hover:bg-ink/90' : 'bg-tan-mid text-ink/70 cursor-not-allowed'}`}
                >
                  Execute Strategy <Zap className="w-8 h-8" />
                </button>
              </div>
            </motion.section>
          )}

          {/* Step 5: Simulation */}
          {step === 'simulation' && selectedScenario && (
            <motion.section 
              key="simulation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 py-10"
            >
              {/* Simulation Header & Timeline */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-ink text-parchment p-6 border-b-4 border-tan-mid">
                <div>
                  <h2 className="text-3xl tracking-tighter flex items-center gap-3">
                    <History className="w-8 h-8 text-tan-mid" />
                    {selectedScenario.months[currentMonthIndex]?.date || "Simulation Active"}
                  </h2>
                  <p className="font-mono text-xs opacity-70 uppercase tracking-widest mt-1">Archive Entry: {selectedScenario.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="flex items-center gap-2 px-4 py-2 border border-parchment/30 hover:bg-parchment/10 transition-colors font-mono text-xs uppercase"
                  >
                    {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isAutoPlaying ? "Pause" : "Auto-Play"}
                  </button>
                  <button 
                    onClick={advanceMonth}
                    className="flex items-center gap-2 px-6 py-2 bg-parchment text-ink font-bold hover:bg-tan-mid transition-colors"
                  >
                    Next Month <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Random Market Event Alert */}
              <AnimatePresence>
                {currentMarketEvent && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-rust text-parchment p-6 border-4 border-ink shadow-[8px_8px_0px_var(--ink)] relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ink/10 rounded-bl-full -z-10" />
                    <h3 className="text-2xl font-bold uppercase tracking-tighter mb-2 flex items-center gap-2">
                      <Zap className="w-6 h-6" /> Breaking News: {currentMarketEvent.title}
                    </h3>
                    <p className="text-lg italic opacity-90 mb-4">{currentMarketEvent.description}</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                      <div className="flex gap-4 text-sm font-mono flex-wrap">
                        {Object.entries(currentMarketEvent.sectorImpacts).map(([sector, impact]) => {
                          const numImpact = impact as number;
                          return (
                          <span key={sector} className={`px-2 py-1 ${numImpact > 0 ? 'bg-parchment text-ink' : 'bg-ink text-parchment'}`}>
                            {sector}: {numImpact > 0 ? '+' : ''}{(numImpact * 100).toFixed(0)}%
                          </span>
                        )})}
                      </div>
                      {currentMarketEvent.lessonId && (
                        <button 
                          onClick={() => {
                            const topic = academyTopics.find(t => t.id === currentMarketEvent.lessonId);
                            if (topic) {
                              setSelectedTopic(topic);
                              setCurrentModule('academy');
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-parchment text-ink font-bold hover:bg-tan-mid transition-colors text-sm uppercase tracking-widest whitespace-nowrap"
                        >
                          <BookOpen className="w-4 h-4" /> Study Concept
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Black Swan Alert */}
              <AnimatePresence>
                {currentBlackSwan && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-black text-white p-8 border-4 border-rust shadow-[8px_8px_0px_var(--rust)] relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-rust/20 rounded-bl-full -z-10" />
                    <h3 className="text-3xl font-bold uppercase tracking-tighter mb-3 flex items-center gap-3 text-rust">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      {currentBlackSwan.headline}
                    </h3>
                    <p className="text-lg italic opacity-90 font-mono">
                      <GlossaryText text={currentBlackSwan.impactText} beginnerMode={beginnerMode} />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Timeline Strip */}
              {extendedScenarioData && (
                <MarketTimelineStrip 
                  events={extendedScenarioData.scenarioMeta.timeline} 
                  currentYear={parseInt(selectedScenario.months[currentMonthIndex]?.date?.split('-')[0] || selectedScenario.year.toString())} 
                />
              )}

              {/* Macro Dashboard */}
              <MacroDashboard 
                macroData={selectedScenario.macro} 
                currentMonthIndex={currentMonthIndex} 
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: News & Lessons */}
                <div className="lg:col-span-2 space-y-8">
                  {/* News Feed */}
                  {extendedScenarioData ? (
                    <div className="h-[500px]">
                      <LivingNewsFeed 
                        monthsData={extendedScenarioData.monthlyData} 
                        currentMonthIndex={currentMonthIndex} 
                        beginnerMode={beginnerMode}
                      />
                    </div>
                  ) : (
                    <motion.div 
                      key={currentMonthIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-parchment border-4 border-dark-sepia p-8 shadow-[12px_12px_0px_0px_var(--sepia)] relative overflow-hidden min-h-[400px] flex flex-col"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Newspaper className="w-32 h-32" />
                      </div>

                      <div className="flex justify-between items-start mb-8 border-b-4 border-dark-sepia pb-4">
                        <div className="space-y-1">
                          <div className="bg-ink text-parchment px-3 py-1 text-[10px] font-mono uppercase tracking-[0.4em] inline-block mb-2">
                            Historical Archive
                          </div>
                          <div className="font-mono text-xs uppercase tracking-widest text-tan-mid">
                            {selectedScenario.months[currentMonthIndex]?.date || `Month ${currentMonthIndex + 1}`} • {selectedScenario.year}
                          </div>
                        </div>
                        <div className="text-right font-mono text-[10px] uppercase tracking-tighter opacity-40">
                          Vol. {selectedScenario.id.toUpperCase()} <br />
                          No. {currentMonthIndex + 1}
                        </div>
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-5xl mt-2 leading-[0.9] tracking-tighter uppercase mb-8 border-b border-tan-mid pb-6">
                          <GlossaryText text={selectedScenario.months[currentMonthIndex]?.headline || "Market Continues Steady Progression"} beginnerMode={beginnerMode} />
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <div className="md:col-span-3">
                            <p className="text-2xl font-serif italic leading-tight opacity-90 first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
                              <GlossaryText text={selectedScenario.months[currentMonthIndex]?.description || "The global financial markets continue to react to the ongoing economic climate. Investors remain focused on long-term indicators as the simulation progresses through this historical period."} beginnerMode={beginnerMode} />
                            </p>
                          </div>
                          <div className="space-y-4">
                            <div className="border-t-2 border-dark-sepia pt-2">
                              <span className="font-mono text-[10px] uppercase font-bold block mb-1">Market Sentiment</span>
                              <div className="flex items-center gap-1">
                                <div className="h-1 w-full bg-tan-mid/20 overflow-hidden">
                                  <div className="h-full bg-ink w-[65%]" />
                                </div>
                              </div>
                            </div>
                            <div className="border-t-2 border-dark-sepia pt-2">
                              <span className="font-mono text-[10px] uppercase font-bold block mb-1">Volatility Index</span>
                              <div className="flex items-center gap-1">
                                <div className="h-1 w-full bg-tan-mid/20 overflow-hidden">
                                  <div className="h-full bg-ink w-[30%]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 flex items-center gap-4">
                        <div className="flex-grow h-[2px] bg-tan-mid/30" />
                        <div className="bg-ink text-parchment px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                          <div className="w-2 h-2 bg-rust animate-pulse" />
                          Impact: {selectedScenario.months[currentMonthIndex]?.impact || "Neutral Market Movement"}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Conflicting Mentors */}
                  {mentorAdvice.length > 0 && (
                    <ConflictingMentors 
                      mentors={mentorAdvice} 
                      beginnerMode={beginnerMode} 
                    />
                  )}

                  {/* Economic Lesson (if available) */}
                  {selectedScenario.months[currentMonthIndex]?.lesson && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-tan-mid/10 border-l-8 border-dark-sepia p-6 italic"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-bold uppercase text-xs tracking-widest">Archival Insight: {selectedScenario.months[currentMonthIndex].lesson?.title}</span>
                      </div>
                      <p className="text-sm opacity-80">
                        <GlossaryText text={selectedScenario.months[currentMonthIndex].lesson?.text || ""} beginnerMode={beginnerMode} />
                      </p>
                    </motion.div>
                  )}

                  {/* Infographics */}
                  {extendedScenarioData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FearGreedDial value={extendedScenarioData.monthlyData[currentMonthIndex]?.fearGreedIndex || 50} />
                      <SectorHeatMap performance={extendedScenarioData.monthlyData[currentMonthIndex]?.sectorPerformance || {}} />
                    </div>
                  )}

                  {/* Live Chart */}
                  <div className="bg-parchment border-2 border-dark-sepia p-6 shadow-[4px_4px_0px_var(--sepia)]">
                    <h4 className="font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Portfolio Performance
                    </h4>
                    <div className="h-[300px]">
                      <Line 
                        data={{
                          labels: simulationHistory.map(h => h.date),
                          datasets: [{
                            label: 'Portfolio Value',
                            data: simulationHistory.map(h => h.value),
                            borderColor: '#141414',
                            backgroundColor: 'rgba(20, 20, 20, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 0
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            y: { 
                              beginAtZero: false,
                              grid: { color: 'rgba(20, 20, 20, 0.05)' },
                              ticks: { font: { family: 'Special Elite' } }
                            },
                            x: { 
                              grid: { display: false },
                              ticks: { font: { family: 'Special Elite' } }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Portfolio & Decisions */}
                <div className="space-y-8">
                  {/* Portfolio Stats */}
                  <div className="bg-ink text-parchment p-8 shadow-[4px_4px_0px_var(--sepia)] space-y-6">
                    <div className="border-b border-parchment/20 pb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Total Portfolio Value</span>
                      <div className="text-4xl font-bold mt-1">
                        ${((Object.values(currentHoldings) as number[]).reduce((a: number, b: number) => a + b, 0) + cash).toLocaleString()}
                      </div>
                      <div className={`text-xs font-mono mt-2 flex items-center gap-1 ${(((Object.values(currentHoldings) as number[]).reduce((a: number, b: number) => a + b, 0) + cash) - investmentAmount) >= 0 ? 'text-parchment' : 'text-rust'}`}>
                        {(((Object.values(currentHoldings) as number[]).reduce((a: number, b: number) => a + b, 0) + cash) - investmentAmount) >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {(((((Object.values(currentHoldings) as number[]).reduce((a: number, b: number) => a + b, 0) + cash) - investmentAmount) / investmentAmount) * 100).toFixed(1)}% Total P&L
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-mono text-[10px] uppercase opacity-60">Cash Reserve</span>
                        <div className="text-xl font-bold">${cash.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase opacity-60">Invested Capital</span>
                        <div className="text-xl font-bold">${(Object.values(currentHoldings) as number[]).reduce((a: number, b: number) => a + b, 0).toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Mini Allocation Chart */}
                    <div className="h-32 pt-4">
                      <Pie 
                        data={{
                          labels: ['Cash', ...Object.keys(currentHoldings).map(n => companyMap[n] || n)],
                          datasets: [{
                            data: [cash, ...Object.values(currentHoldings)],
                            backgroundColor: ['#8E9299', '#F27D26', '#5A5A40', '#4a4a4a', '#d1d1d1'],
                            borderWidth: 0
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } }
                        }}
                      />
                    </div>
                  </div>

                  {/* Decision Panel */}
                  <div className="bg-parchment border-2 border-dark-sepia p-6 shadow-[4px_4px_0px_var(--sepia)] space-y-6">
                    <h4 className="font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Investor Decisions
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-tan-mid bg-tan-mid/5">
                        <span className="font-mono text-[10px] uppercase opacity-60 block mb-3">Quick Actions</span>
                        <div className="grid grid-cols-1 gap-2">
                          <button 
                            onClick={handleMoveToCash}
                            className="w-full py-2 border border-ink hover:bg-ink hover:text-parchment transition-all font-mono text-[10px] uppercase"
                          >
                            Liquidate All to Cash
                          </button>
                          <button 
                            onClick={() => {
                              const total = (Object.values(currentHoldings) as number[]).reduce((a: number, b: number) => a + b, 0) + cash;
                              const perCompany = total / selectedScenario.sectors.flatMap(s => s.companies).length;
                              const newHoldings: Record<string, number> = {};
                              selectedScenario.sectors.flatMap(s => s.companies).forEach(c => {
                                newHoldings[c.name] = perCompany;
                              });
                              setCurrentHoldings(newHoldings);
                              setCash(0);
                            }}
                            className="w-full py-2 border border-ink hover:bg-ink hover:text-parchment transition-all font-mono text-[10px] uppercase"
                          >
                            Equalize Rebalance
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="font-mono text-[10px] uppercase opacity-60 block">Manage Holdings</span>
                        {selectedScenario.sectors.flatMap(s => s.companies).map(company => (
                          <div key={company.name} className="flex flex-col gap-2 p-3 border border-tan-mid">
                            <div className="flex justify-between items-center border-b border-tan-mid/30 pb-1">
                              <span className="font-bold text-sm">{companyMap[company.name]}</span>
                              <span className="font-mono text-xs">${(currentHoldings[company.name] || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <p className="text-[9px] italic opacity-60 line-clamp-1 mb-1">
                              {companyDetails[company.name]?.overview}
                            </p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleBuy(company.name, 1000)}
                                disabled={cash < 1000}
                                className="flex-1 py-1 bg-ink text-parchment text-[10px] uppercase font-bold disabled:opacity-30"
                              >
                                Buy $1k
                              </button>
                              <button 
                                onClick={() => handleSell(company.name, 50)}
                                disabled={!currentHoldings[company.name]}
                                className="flex-1 py-1 border border-ink text-[10px] uppercase font-bold disabled:opacity-30"
                              >
                                Sell 50%
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Competitor Leaderboard */}
                  <div className="bg-parchment border-2 border-dark-sepia p-6 shadow-[4px_4px_0px_var(--sepia)] space-y-6">
                    <h4 className="font-bold uppercase text-xs tracking-widest flex items-center gap-2 border-b border-dark-sepia pb-2">
                      <Users className="w-4 h-4" /> Competitor Leaderboard
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(competitorPortfolios)
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .map(([name, value], idx) => {
                          const numValue = value as number;
                          return (
                          <div key={name} className="flex flex-col gap-1 border-b border-tan-mid pb-2 last:border-0">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm flex items-center gap-2">
                                <span className="font-mono text-[10px] opacity-50">{idx + 1}.</span> {name}
                              </span>
                              <span className="font-mono text-xs">${numValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            {competitorThoughts[name] && (
                              <p className="text-[10px] italic opacity-70 leading-relaxed">"{competitorThoughts[name]}"</p>
                            )}
                          </div>
                        )})}
                    </div>
                  </div>

                  {/* Monthly Macro Indicators */}
                  {extendedScenarioData ? (
                    <MacroPulseCards macroData={extendedScenarioData.monthlyData[currentMonthIndex]?.macro || {
                      gdp: selectedScenario.macro.gdpGrowth[0],
                      inflation: selectedScenario.macro.inflation[0],
                      unemployment: selectedScenario.macro.unemployment[0],
                      interestRate: selectedScenario.macro.interestRate[0]
                    }} />
                  ) : (
                    <div className="bg-tan-mid/10 p-6 border border-tan-mid">
                      <h4 className="font-mono text-[10px] uppercase tracking-widest mb-4">Live Economic Indicators</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] opacity-60 uppercase">Interest Rate</span>
                          <div className="text-lg font-bold">{selectedScenario.months[currentMonthIndex]?.macro?.interestRate || selectedScenario.macro.interestRate[0]}%</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] opacity-60 uppercase">Inflation</span>
                          <div className="text-lg font-bold">{selectedScenario.months[currentMonthIndex]?.macro?.inflation || selectedScenario.macro.inflation[0]}%</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] opacity-60 uppercase">GDP Growth</span>
                          <div className="text-lg font-bold">{selectedScenario.months[currentMonthIndex]?.macro?.gdpGrowth || selectedScenario.macro.gdpGrowth[0]}%</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] opacity-60 uppercase">Unemployment</span>
                          <div className="text-lg font-bold">{selectedScenario.months[currentMonthIndex]?.macro?.unemployment || selectedScenario.macro.unemployment[0]}%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Competitor Board */}
                  {extendedScenarioData && (
                    <CompetitorBoard 
                      userPortfolioValue={(Object.values(currentHoldings) as number[]).reduce((a: number, b: number) => a + b, 0) + cash}
                      userReturn={((((Object.values(currentHoldings) as number[]).reduce((a: number, b: number) => a + b, 0) + cash) - investmentAmount) / investmentAmount) * 100}
                      investors={extendedScenarioData.investors}
                      currentMonthIndex={currentMonthIndex}
                    />
                  )}
                </div>
              </div>

              {/* Progressive Lessons */}
              {extendedScenarioData?.lessonsTriggered && (
                <ProgressiveLessons 
                  lessons={extendedScenarioData.lessonsTriggered} 
                  currentTrigger={currentTrigger} 
                />
              )}
            </motion.section>
          )}

          {/* Step 6: Results */}
          {step === 'result' && selectedScenario && (
            extendedScenarioData ? (
              <PostGameDebrief 
                userFinalValue={simulatedData[simulatedData.length - 1] || 0}
                userReturnPercentage={(((simulatedData[simulatedData.length - 1] - investmentAmount) / investmentAmount) * 100)}
                userAllocations={currentHoldings}
                scenarioName={selectedScenario.name}
                onRestart={resetSimulation}
                investors={extendedScenarioData.investors.map((inv: any) => {
                  let finalVal = 0;
                  let initialVal = 0;
                  Object.entries(inv.allocations).forEach(([companyName, amount]) => {
                    const amt = amount as number;
                    initialVal += amt;
                    const company = selectedScenario.sectors.flatMap(s => s.companies).find(c => c.name === companyName);
                    if (company) {
                      finalVal += amt * (company.finalPrice / company.initialPrice);
                    } else {
                      finalVal += amt;
                    }
                  });
                  const quoteObj = extendedScenarioData.legendaryQuotes?.find((q: any) => q.investorId === inv.investorId);
                  return {
                    id: inv.investorId,
                    name: inv.name,
                    philosophy: inv.philosophy,
                    finalValue: finalVal,
                    returnPercentage: initialVal > 0 ? ((finalVal - initialVal) / initialVal) * 100 : 0,
                    allocations: inv.allocations,
                    quote: quoteObj?.quote || "Stay the course."
                  };
                })}
                xpGained={lastXpGained}
                repChange={lastRepChange}
                onAutopsy={() => {
                  setAutopsyType('market');
                  setAutopsyData({
                    scenario: selectedScenario,
                    allocations: allocations,
                    finalValue: simulatedData[simulatedData.length - 1] || 0,
                    eventAttribution: eventAttribution,
                    investors: extendedScenarioData.investors.map((inv: any) => {
                      let finalVal = 0;
                      let initialVal = 0;
                      Object.entries(inv.allocations).forEach(([companyName, amount]) => {
                        const amt = amount as number;
                        initialVal += amt;
                        const company = selectedScenario.sectors.flatMap(s => s.companies).find(c => c.name === companyName);
                        if (company) {
                          finalVal += amt * (company.finalPrice / company.initialPrice);
                        } else {
                          finalVal += amt;
                        }
                      });
                      return {
                        name: inv.name,
                        philosophy: inv.philosophy,
                        returnPercentage: initialVal > 0 ? ((finalVal - initialVal) / initialVal) * 100 : 0,
                      };
                    }),
                    history: simulatedData.map((val, idx) => ({ month: idx, value: val }))
                  });
                  setIsAutopsyOpen(true);
                }}
                teachMe={{
                  principleName: "Diversification",
                  definition: "A risk management strategy that mixes a wide variety of investments within a portfolio.",
                  infographicId: "Diversification",
                  example: "During the 2008 crash, while real estate and banking plummeted, healthcare and consumer staples provided a buffer for diversified portfolios.",
                  application: `You allocated your capital across ${Object.keys(currentHoldings).length} different assets, spreading your risk.`
                }}
              />
            ) : (
              <motion.section 
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12 relative"
              >
                <div className="absolute top-0 right-0 border-4 border-rust/40 text-rust/40 px-6 py-2 font-black text-3xl uppercase tracking-widest transform rotate-12 pointer-events-none select-none">
                  Declassified
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-bold uppercase tracking-tight flex items-center gap-3">
                    <BarChart3 className="w-10 h-10" />
                    Simulation Analytics
                  </h2>
                  <button onClick={resetSimulation} className="flex items-center gap-2 font-mono text-sm hover:underline">
                    <RefreshCcw className="w-4 h-4" /> New Simulation
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Summary Stats */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="newspaper-card p-8 text-center bg-ink text-parchment">
                      <span className="font-mono text-xs uppercase block mb-2 opacity-60">Final Portfolio Value</span>
                      <span className="text-4xl font-black">
                        ${simulatedData[simulatedData.length - 1]?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="newspaper-card p-6 space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-mono uppercase opacity-60">Initial Capital</span>
                        <span className="font-bold">${investmentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-mono uppercase opacity-60">Total Return</span>
                        <span className={`font-bold ${simulatedData[simulatedData.length - 1] > investmentAmount ? 'text-ink' : 'text-rust'}`}>
                          {(((simulatedData[simulatedData.length - 1] - investmentAmount) / investmentAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-mono uppercase opacity-60">Leverage Factor</span>
                        <span className="font-bold">{leverage}x</span>
                      </div>
                      <div className="pt-4 border-t border-tan-mid">
                        <p className="text-xs italic leading-relaxed opacity-80">
                          {getRiskAnalysis(simulatedData, investmentAmount, riskTolerance, leverage)}
                        </p>
                      </div>
                      
                      {(lastXpGained > 0 || lastRepChange !== 0) && (
                        <div className="pt-4 border-t border-tan-mid space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-mono uppercase opacity-60 flex items-center gap-1"><Award className="w-4 h-4" /> XP Gained</span>
                            <span className="font-bold text-sepia">+{lastXpGained}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-mono uppercase opacity-60 flex items-center gap-1"><Activity className="w-4 h-4" /> Reputation</span>
                            <span className={`font-bold ${lastRepChange > 0 ? 'text-ink' : 'text-rust'}`}>
                              {lastRepChange > 0 ? '+' : ''}{lastRepChange}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Growth Chart */}
                  <div className="lg:col-span-3 newspaper-card p-8">
                    <h4 className="font-mono text-xs uppercase tracking-widest mb-6 border-b border-dark-sepia pb-1">Historical Growth Curve</h4>
                    <div className="h-80">
                      <Line 
                        data={{
                          labels: simulationHistory.map(h => h.date),
                          datasets: [{
                            label: 'Portfolio Value',
                            data: simulatedData,
                            borderColor: 'var(--ink)',
                            backgroundColor: 'rgba(26, 16, 8, 0.1)',
                            fill: true,
                            tension: 0.3,
                            pointRadius: 0
                          }]
                        }}
                        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { font: { family: 'IM Fell English' } } }, x: { display: false } } }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="newspaper-card p-8">
                    <h4 className="font-mono text-xs uppercase tracking-widest mb-6 border-b border-dark-sepia pb-1">Sector Performance Comparison</h4>
                    <div className="h-64">
                      <Bar 
                        data={{
                          labels: selectedScenario.sectors.map(s => s.name),
                          datasets: [{
                            label: 'Relative Performance',
                            data: selectedScenario.sectors.map(s => {
                              const avgRoi = s.companies.reduce((acc: number, c) => acc + (c.finalPrice - c.initialPrice) / c.initialPrice, 0) / s.companies.length;
                              return (avgRoi * 100) + (Math.random() * 20 - 10);
                            }),
                            backgroundColor: 'var(--ink)'
                          }]
                        }}
                        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                      />
                    </div>
                  </div>
                  <div className="newspaper-card p-8">
                    <h4 className="font-mono text-xs uppercase tracking-widest mb-6 border-b border-dark-sepia pb-1">Company Identities Revealed</h4>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {selectedScenario.sectors.flatMap(s => s.companies).map(company => (
                        <div key={company.name} className="flex justify-between items-center border-b border-tan-mid pb-2">
                          <span className="font-mono text-sm opacity-70">{companyMap[company.name]}</span>
                          <span className="font-bold text-ink">{company.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Economic Lessons */}
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold flex items-center gap-3"><Layers className="w-8 h-8" /> Economic Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {generateDynamicLessons(selectedScenario, simulatedData, investmentAmount, riskTolerance, leverage, allocations).map((lesson, i) => (
                      <div key={i} className="border-2 border-dark-sepia p-8 bg-parchment/20 relative group hover:bg-parchment/40 transition-colors">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-dark-sepia" />
                        <h4 className="text-xl font-bold mb-3">{lesson.title}</h4>
                        <p className="text-sm italic leading-relaxed">{lesson.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10 no-print">
                  <button onClick={() => window.print()} className="bg-parchment text-ink border-2 border-ink px-8 py-4 font-bold text-lg hover:bg-tan-mid transition-all flex items-center justify-center gap-3">
                    Export Report <Printer className="w-5 h-5" />
                  </button>
                  <button onClick={resetSimulation} className="bg-ink text-parchment px-12 py-4 font-bold text-xl hover:bg-ink/90 transition-all flex items-center justify-center gap-3">
                    Archive Case File <BookOpen className="w-6 h-6" />
                  </button>
                </div>
              </motion.section>
            )
          )}
            </>
          )}
          
          {currentModule === 'boardroom' && (
            <motion.div key="boardroom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
              {/* Boardroom Selection & Trophy Case */}
              {boardroomStep === 'selection' && (
                <div className="space-y-12">
                  <div className="newspaper-card p-10 border-4 border-ink bg-tan-light shadow-[8px_8px_0px_var(--ink)]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b-4 border-ink pb-6">
                      <div>
                        <h2 className="text-4xl font-bold flex items-center gap-3 uppercase tracking-tighter">
                          <Trophy className="w-10 h-10 text-sepia" />
                          Executive Trophy Case
                        </h2>
                        <p className="text-ink text-lg font-mono mt-2 opacity-80">Track your historical investing career.</p>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center bg-parchment border-2 border-ink px-6 py-2">
                          <div className="text-xs uppercase font-mono tracking-widest opacity-60">Reputation</div>
                          <div className="text-3xl font-bold text-ink">{reputation}</div>
                        </div>
                        <div className="text-center bg-ink text-parchment border-2 border-ink px-6 py-2">
                          <div className="text-xs uppercase font-mono tracking-widest opacity-60">Career XP</div>
                          <div className="text-3xl font-bold">{xp}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { id: 'rainmaker', name: 'The Rainmaker', desc: 'Beat the index fund by 10%.' },
                        { id: 'diamond_hands', name: 'Diamond Hands', desc: 'Hold equity through a major crash.' },
                        { id: 'cash_king', name: 'Cash is King', desc: 'Hold >50% cash during a panic.' },
                        { id: 'contrarian', name: 'The Contrarian', desc: 'Profit while the market falls.' }
                      ].map(badge => {
                        const isUnlocked = unlockedBadges.includes(badge.id);
                        return (
                          <div key={badge.id} className={`p-6 border-2 flex flex-col items-center text-center transition-all ${isUnlocked ? 'border-sepia bg-parchment/60' : 'border-ink/20 bg-ink/5 opacity-60 grayscale'}`}>
                            {isUnlocked ? <Award className="w-10 h-10 text-sepia mb-3" /> : <Lock className="w-10 h-10 text-ink/40 mb-3" />}
                            <div className="font-bold uppercase tracking-widest text-sm mb-1">{badge.name}</div>
                            <div className="text-xs italic font-mono opacity-80">{badge.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button onClick={resetProgress} className="text-xs font-mono uppercase border border-rust text-rust px-4 py-2 hover:bg-rust hover:text-parchment transition-colors">
                        Wipe Career Data
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-full mb-2">
                      <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Briefcase className="w-8 h-8" />
                        Boardroom Decision Simulator
                      </h2>
                      <p className="text-ink/70 text-lg">Assume the role of a strategic decision maker in corporate history.</p>
                    </div>
                  {boardroomData.map((caseStudy) => (
                    <div 
                      key={caseStudy.id}
                      onClick={() => handleSelectBoardroomCase(caseStudy as any)}
                      className="newspaper-card p-8 cursor-pointer flex flex-col justify-between group h-full border-t-8 border-t-dark-sepia"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-mono text-sm border border-dark-sepia px-2 py-0.5">{caseStudy.year}</span>
                          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{caseStudy.company}</h3>
                        <p className="text-ink/70 leading-relaxed text-sm">{caseStudy.industryContext.substring(0, 100)}...</p>
                      </div>
                      <div className="mt-8 pt-4 border-t border-tan-mid flex items-center gap-2 text-xs font-mono uppercase tracking-tighter">
                        <Scale className="w-4 h-4" />
                        Enter Boardroom
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              )}

              {/* Boardroom Meeting / Agenda */}
              {boardroomStep === 'meeting' && selectedBoardroomCase && (
                <div className="max-w-4xl mx-auto space-y-10">
                  <div className="flex items-center justify-between border-b-2 border-dark-sepia pb-4">
                    <button onClick={() => setBoardroomStep('selection')} className="flex items-center gap-2 font-mono text-sm hover:underline">
                      <RefreshCcw className="w-4 h-4" /> Exit Boardroom
                    </button>
                    <div className="text-right">
                      <h2 className="text-3xl font-bold uppercase">{selectedBoardroomCase.company}</h2>
                      <p className="font-mono text-xs opacity-60">Strategic Agenda • Round {currentBoardroomRound + 1}</p>
                    </div>
                  </div>

                  <StakeholderDashboard metrics={stakeholderMetrics} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 space-y-8">
                      <div className="bg-parchment p-10 shadow-[4px_4px_0px_var(--sepia)] border border-tan-mid relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-ink" />
                        <h3 className="text-2xl font-bold mb-6 border-b border-tan-mid pb-2">{selectedBoardroomCase.rounds[currentBoardroomRound].title}</h3>
                        <p className="text-lg leading-relaxed italic mb-8">
                          {selectedBoardroomCase.rounds[currentBoardroomRound].description}
                        </p>
                        
                        {/* Board Member Commentary */}
                        <div className="mb-10 space-y-4">
                          <h4 className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4 border-b border-dark-sepia pb-1">Board Member Commentary:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-tan-light border-l-4 border-ink">
                              <p className="font-bold text-xs uppercase mb-1">Chief Executive Officer</p>
                              <p className="text-sm italic opacity-80">"{selectedBoardroomCase.rounds[currentBoardroomRound].opinions?.CEO || 'We must take bold action to secure our market position.'}"</p>
                            </div>
                            <div className="p-4 bg-tan-light border-l-4 border-sepia">
                              <p className="font-bold text-xs uppercase mb-1">Chief Financial Officer</p>
                              <p className="text-sm italic opacity-80">"{selectedBoardroomCase.rounds[currentBoardroomRound].opinions?.CFO || 'We need to carefully consider the impact on our margins and cash flow.'}"</p>
                            </div>
                            <div className="p-4 bg-tan-light border-l-4 border-rust">
                              <p className="font-bold text-xs uppercase mb-1">Lead Investor</p>
                              <p className="text-sm italic opacity-80">"{selectedBoardroomCase.rounds[currentBoardroomRound].opinions?.Investor || 'I am looking for strategies that maximize shareholder value in the medium term.'}"</p>
                            </div>
                            <div className="p-4 bg-tan-light border-l-4 border-dark-sepia">
                              <p className="font-bold text-xs uppercase mb-1">Strategy Director</p>
                              <p className="text-sm italic opacity-80">"{selectedBoardroomCase.rounds[currentBoardroomRound].opinions?.StrategyDirector || 'Our focus should be on long-term competitive advantage and market trends.'}"</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Strategic Options:</h4>
                          {selectedBoardroomCase.rounds[currentBoardroomRound].options.map((option) => (
                            <button 
                              key={option.id}
                              onClick={() => handleBoardroomDecision(option)}
                              className="w-full text-left p-6 border-2 border-dark-sepia/10 hover:border-dark-sepia hover:bg-ink/5 transition-all group relative"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">{option.text}</span>
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="newspaper-card p-6 bg-ink text-parchment">
                        <h4 className="font-mono text-[10px] uppercase tracking-widest mb-4 border-b border-parchment/20 pb-1">Current Financials ({selectedBoardroomCase.year})</h4>
                        <div className="space-y-4">
                          {selectedBoardroomCase.financialSituation.metrics.map((m, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span className="text-xs opacity-60">{m.label}</span>
                              <span className="font-bold">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 border-2 border-dark-sepia border-dashed">
                        <h4 className="font-mono text-[10px] uppercase tracking-widest mb-2">Industry Context</h4>
                        <p className="text-xs leading-relaxed opacity-70">
                          {selectedBoardroomCase.industryContext}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Boardroom Outcome / Simulation */}
              {boardroomStep === 'outcome' && selectedBoardroomCase && (
                <div className="max-w-5xl mx-auto space-y-10">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Strategic Impact Analysis</h2>
                    <p className="text-ink/70">Simulating the consequences of your boardroom decision...</p>
                  </div>

                  <StakeholderDashboard metrics={stakeholderMetrics} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="newspaper-card p-8">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" /> Projected Metrics
                      </h3>
                      <div className="h-64">
                        <Line 
                          data={{
                            labels: boardroomMetrics[Object.keys(boardroomMetrics)[0]]?.map((_, i) => `T+${i}`) || [],
                            datasets: Object.entries(boardroomMetrics).map(([key, values], idx) => ({
                              label: key.toUpperCase(),
                              data: values,
                              borderColor: ['var(--ink)', 'var(--sepia)', 'var(--rust)'][idx % 3],
                              tension: 0.4,
                              pointRadius: 4
                            }))
                          }}
                          options={{ responsive: true, maintainAspectRatio: false }}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-ink text-parchment p-8 shadow-[4px_4px_0px_var(--sepia)]">
                        <h4 className="font-mono text-xs uppercase tracking-widest mb-4 border-b border-parchment/20 pb-1">Executive Summary</h4>
                        <p className="text-xl italic leading-relaxed">
                          {boardroomDecisions[boardroomDecisions.length - 1]?.lesson}
                        </p>
                      </div>
                      
                      {boardroomDecisions[boardroomDecisions.length - 1]?.teachMe && (
                        <TeachMeCard {...boardroomDecisions[boardroomDecisions.length - 1].teachMe!} />
                      )}
                      
                      <div className="flex justify-center">
                        <button 
                          onClick={nextBoardroomStep}
                          className="bg-ink text-parchment px-12 py-4 font-bold text-xl hover:bg-ink/90 transition-all flex items-center gap-3"
                        >
                          {currentBoardroomRound < selectedBoardroomCase.rounds.length - 1 ? 'Next Agenda Item' : 'Final Case Review'} <ArrowRight className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Boardroom Summary */}
              {boardroomStep === 'summary' && selectedBoardroomCase && (
                <div className="max-w-4xl mx-auto space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-5xl font-black uppercase tracking-tighter">Historical Case Review</h2>
                    <p className="text-xl font-mono opacity-60">{selectedBoardroomCase.company} • {selectedBoardroomCase.year}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div className="newspaper-card p-8 bg-parchment border-4 border-dark-sepia">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><History className="w-6 h-6" /> Historical Reality</h3>
                        <p className="text-lg leading-relaxed italic">
                          {selectedBoardroomCase.historicalReality}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-mono text-xs uppercase tracking-widest opacity-60">Strategic Lessons:</h4>
                        {selectedBoardroomCase.lessons.map((lesson, i) => (
                          <div key={i} className="p-6 border-l-4 border-dark-sepia bg-ink/5">
                            <h5 className="font-bold mb-1">{lesson.title}</h5>
                            <p className="text-sm opacity-70">{lesson.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="newspaper-card p-8">
                        <h3 className="text-2xl font-bold mb-6">Your Strategic Path</h3>
                        <div className="space-y-6">
                          {boardroomDecisions.map((decision, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-ink text-parchment flex items-center justify-center font-bold text-sm">
                                {i + 1}
                              </div>
                              <div>
                                <p className="font-bold text-sm mb-1">{decision.text}</p>
                                <p className="text-xs opacity-60 italic">{decision.lesson}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {(lastXpGained > 0 || lastRepChange !== 0) && (
                        <div className="newspaper-card p-6 bg-parchment border-4 border-sepia mt-8">
                          <h3 className="text-xl font-bold mb-4 text-center">Executive Assessment</h3>
                          <div className="flex justify-center gap-8 text-lg font-mono uppercase tracking-widest">
                            <span className="flex items-center gap-2 text-sepia"><Award className="w-6 h-6" /> +{lastXpGained} XP</span>
                            <span className={`flex items-center gap-2 ${lastRepChange > 0 ? 'text-ink' : 'text-rust'}`}>
                              <Activity className="w-6 h-6" /> {lastRepChange > 0 ? '+' : ''}{lastRepChange} REP
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="col-span-2 flex justify-center mb-4">
                          <DownloadReportButton />
                        </div>
                        <button 
                          onClick={() => {
                            setAutopsyType('boardroom');
                            setAutopsyData({
                              caseData: selectedBoardroomCase,
                              decisions: boardroomDecisions,
                              metrics: boardroomMetrics,
                              npcs: [
                                { name: "Aggressive Growth Fund", strategy: "High risk, high reward", return: (((boardroomMetrics.stockPrice[boardroomMetrics.stockPrice.length - 1] - boardroomMetrics.stockPrice[0]) / boardroomMetrics.stockPrice[0]) * 100 + 15).toFixed(1) },
                                { name: "Conservative Value", strategy: "Capital preservation", return: (((boardroomMetrics.stockPrice[boardroomMetrics.stockPrice.length - 1] - boardroomMetrics.stockPrice[0]) / boardroomMetrics.stockPrice[0]) * 100 - 5).toFixed(1) }
                              ]
                            });
                            setIsAutopsyOpen(true);
                          }}
                          className="w-full bg-parchment text-ink border-4 border-ink py-6 font-bold text-xl hover:bg-tan-mid transition-all flex items-center justify-center gap-2"
                        >
                          Decision Autopsy <Target className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setBoardroomStep('selection')}
                          className="w-full bg-ink text-parchment py-6 font-bold text-xl hover:bg-ink/90 transition-all flex items-center justify-center gap-2"
                        >
                          New Case Study <RefreshCcw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Academy Module */}
          {currentModule === 'academy' && (
            <motion.div
              key="academy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold mb-4 flex items-center justify-center gap-4">
                  <BookOpen className="w-12 h-12 text-sepia" />
                  Finance Academy
                </h2>
                <p className="text-xl italic opacity-80 max-w-2xl mx-auto mb-8">
                  Master the principles of economics and finance through structured lessons and historical case studies.
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setAcademyView('curriculum')}
                    className={`px-6 py-2 font-bold uppercase tracking-widest text-sm transition-colors ${
                      academyView === 'curriculum' 
                        ? 'bg-ink text-parchment' 
                        : 'border-2 border-ink text-ink hover:bg-ink/10'
                    }`}
                  >
                    Curriculum
                  </button>
                  <button
                    onClick={() => setAcademyView('archetypes')}
                    className={`px-6 py-2 font-bold uppercase tracking-widest text-sm transition-colors ${
                      academyView === 'archetypes' 
                        ? 'bg-ink text-parchment' 
                        : 'border-2 border-ink text-ink hover:bg-ink/10'
                    }`}
                  >
                    Corporate Archetypes
                  </button>
                </div>
              </div>

              {academyView === 'archetypes' ? (
                <CorporateArchetypes />
              ) : !selectedTopic ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {academyTopics.map((topic) => (
                    <div 
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopic(topic);
                        setQuizAnswered(null);
                      }}
                      className="newspaper-card p-8 cursor-pointer group hover:bg-parchment transition-colors flex flex-col h-full"
                    >
                      <div className="mb-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-dark-sepia border border-dark-sepia px-2 py-1">
                          {topic.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-rust transition-colors">{topic.title}</h3>
                      <p className="text-sm opacity-80 line-clamp-3 mb-6 flex-grow">{topic.theory}</p>
                      <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-ink border-t border-tan-mid pt-4 mt-auto">
                        Begin Lesson <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-12">
                  <button 
                    onClick={() => setSelectedTopic(null)}
                    className="flex items-center gap-2 font-mono text-sm hover:text-rust transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" /> Back to Curriculum
                  </button>

                  <div className="newspaper-card p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sepia/10 rounded-bl-full -z-10" />
                    
                    <div className="mb-8">
                      <span className="font-mono text-sm uppercase tracking-widest text-dark-sepia border-b border-dark-sepia pb-1">
                        {selectedTopic.category}
                      </span>
                      <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-8">{selectedTopic.title}</h2>
                    </div>

                    <div className="space-y-10 text-lg leading-relaxed">
                      <section>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <BookOpen className="w-6 h-6 text-sepia" /> Theory
                        </h3>
                        <p className="opacity-90">{selectedTopic.theory}</p>
                      </section>

                      <section className="p-6 bg-tan-light border-l-4 border-dark-sepia">
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-sepia" /> Real-World Example
                        </h3>
                        <p className="opacity-90 italic">{selectedTopic.example}</p>
                      </section>

                      <section>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <History className="w-6 h-6 text-sepia" /> Historical Case Study: {selectedTopic.caseStudy.title}
                        </h3>
                        <p className="opacity-90">{selectedTopic.caseStudy.text}</p>
                      </section>

                      <section className="border-t-2 border-dark-sepia pt-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                          <Award className="w-6 h-6 text-sepia" /> Knowledge Check
                        </h3>
                        <div className="bg-ink text-parchment p-8">
                          <p className="font-bold mb-6 text-xl">{selectedTopic.quiz.question}</p>
                          <div className="space-y-3">
                            {selectedTopic.quiz.options.map((opt: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (quizAnswered === null) {
                                    setQuizAnswered(idx);
                                    if (idx === selectedTopic.quiz.answer) {
                                      setXp(prev => prev + 100);
                                    }
                                  }
                                }}
                                disabled={quizAnswered !== null}
                                className={`w-full text-left p-4 font-mono text-sm transition-all border ${
                                  quizAnswered === null 
                                    ? 'border-parchment/30 hover:bg-parchment hover:text-ink' 
                                    : quizAnswered === idx 
                                      ? idx === selectedTopic.quiz.answer 
                                        ? 'bg-sepia border-sepia text-parchment' 
                                        : 'bg-rust border-rust text-parchment'
                                      : idx === selectedTopic.quiz.answer
                                        ? 'border-sepia text-sepia'
                                        : 'border-parchment/10 opacity-50'
                                }`}
                              >
                                {String.fromCharCode(65 + idx)}. {opt}
                              </button>
                            ))}
                          </div>
                          {quizAnswered !== null && (
                            <div className="mt-6 pt-6 border-t border-parchment/20 text-center">
                              <p className={`font-bold text-lg mb-4 ${quizAnswered === selectedTopic.quiz.answer ? 'text-sepia' : 'text-rust'}`}>
                                {quizAnswered === selectedTopic.quiz.answer ? 'Correct! +100 XP' : 'Incorrect. Review the theory and try again.'}
                              </p>
                              <button 
                                onClick={() => {
                                  setCurrentModule('archive');
                                  const scenario = scenariosData.find(s => s.id === selectedTopic.linkedScenarioId);
                                  if (scenario) handleScenarioSelect(scenario as any);
                                }}
                                className="px-6 py-3 bg-parchment text-ink font-bold uppercase tracking-widest text-sm hover:bg-tan-light transition-colors"
                              >
                                Apply in Simulation <ArrowRight className="w-4 h-4 inline ml-2" />
                              </button>
                            </div>
                          )}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Case Studies Module */}
          {currentModule === 'case-studies' && (
            <motion.div
              key="case-studies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CaseStudyDatabase />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 pt-8 border-t border-tan-mid text-center opacity-40 font-mono text-[10px] uppercase tracking-widest">
        <p>© 1914-1918 The Financial Archive • Department of Economic History</p>
        <p className="mt-2">Simulated data for educational purposes only. Past performance is not indicative of future results.</p>
      </footer>

      <DecisionAutopsyModal 
        isOpen={isAutopsyOpen} 
        onClose={() => setIsAutopsyOpen(false)} 
        type={autopsyType} 
        data={autopsyData} 
      />
    </div>
  );
}
