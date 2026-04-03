export interface MentorAdvice {
  persona: string;
  avatar: string;
  advice: string;
  color: string;
}

interface HistoricalAdvice {
  value: string;
  growth: string;
  valueSimple: string;
  growthSimple: string;
}

const historicalSpecificAdvice: Record<string, HistoricalAdvice> = {
  // 2008 Crisis
  "subprime": {
    value: "The cracks are forming in the foundation. Subprime defaults are just the beginning of a massive deleveraging cycle. Cash is your only friend.",
    growth: "It's a localized issue in housing. The tech sector's growth isn't tied to mortgage-backed securities. I'm staying the course.",
    valueSimple: "The housing market is breaking. This will spread to everything else. Keep your money safe.",
    growthSimple: "This is just a problem with house loans. Tech companies are still doing great, so don't worry too much."
  },
  "bear stearns": {
    value: "A major bank just vanished over a weekend. The 'Lender of Last Resort' is busy, and trust is the first casualty. Move to defensive assets.",
    growth: "JPMorgan's takeover provides a floor. The system is being propped up. This liquidity injection will eventually find its way into growth stocks.",
    valueSimple: "A huge bank just failed. This is a big warning that the whole system is in trouble. Be very careful.",
    growthSimple: "The government is helping big banks stay afloat. This means they are making sure there is still money for the market to grow."
  },
  "lehman brothers": {
    value: "The unthinkable has happened. A systemic collapse is underway. This is a generational reset of valuations. Stay in deep value or cash.",
    growth: "Panic is total. High-growth assets are being liquidated to cover margin calls. The baby is being thrown out with the bathwater.",
    valueSimple: "One of the world's biggest banks just went bankrupt. This is a total disaster for the economy. Keep your money in only the strongest companies.",
    growthSimple: "Everyone is selling everything because they are scared. Even the best tech companies are dropping in price, but they will survive."
  },
  "tarp": {
    value: "Government bailouts are a desperate measure. It saves the system but creates a moral hazard. I'm looking for companies that didn't need the help.",
    growth: "The 'Bazooka' is here. Trillions in liquidity are about to flood the markets. This is the ultimate 'Buy' signal for risk-on assets.",
    valueSimple: "The government is giving banks billions of dollars to save them. This might stop the crash, but it's a very messy solution.",
    growthSimple: "The government is pumping huge amounts of money into the market. This usually makes stock prices go up very fast!"
  },
  
  // Dot-Com
  "ipo frenzy": {
    value: "When companies with zero revenue gain 600% in a day, you aren't investing; you're gambling. I'm sitting this one out.",
    growth: "We are in a paradigm shift. Traditional metrics like P/E ratios are obsolete in the internet age. Scale is the only metric that matters.",
    valueSimple: "New companies are going up 600% in one day for no reason. This is a bubble. It's better to wait for prices to be real again.",
    growthSimple: "The internet is changing everything! We have to invest in as many new companies as possible to catch the big winners."
  },
  "nasdaq hits all-time high": {
    value: "Irrational exuberance has reached its peak. The shoe-shine boy is giving stock tips. I'm moving to bonds and consumer staples.",
    growth: "5,000 is just the beginning. The 'New Economy' is just starting to be built. If you sell now, you'll regret it for the rest of your life.",
    valueSimple: "Prices are at an all-time high and everyone is talking about stocks. This usually means a crash is coming soon.",
    growthSimple: "The market is breaking records! The internet is making everyone rich. Keep buying more!"
  },
  "bubble bursts": {
    value: "Gravity always wins. The 'New Economy' still needs to make a profit to survive. Back to basics—bricks and mortar.",
    growth: "This is a healthy correction. The weak hands are being shaken out. The true giants like Amazon will emerge 10x stronger from this.",
    valueSimple: "The bubble finally popped. Now, only real businesses that make real money will survive.",
    growthSimple: "Prices are dropping, but don't give up. The best internet companies are just on sale right now."
  },

  // COVID
  "mysterious virus": {
    value: "Supply chains in Asia are the lifeblood of the global economy. If they stop, everything stops. I'm taking a very cautious stance.",
    growth: "A temporary blip. Global demand is too strong to be derailed by a regional health issue. Use the dip to add to tech.",
    valueSimple: "There is a new virus causing problems in China. This could mess up how things are made and shipped. Be careful.",
    growthSimple: "This is just a small problem. The global economy is strong, so any drop in price is just a good time to buy more."
  },
  "lockdown": {
    value: "Unprecedented. A forced halt of global commerce. I'm moving to the 'Fortress Balance Sheets'—companies that can survive a year of zero revenue.",
    growth: "Digital transformation just accelerated by a decade. Anything that facilitates remote work, play, or shopping is now essential infrastructure.",
    valueSimple: "The whole world is shutting down. It's a very scary time. Only invest in companies that have a lot of cash in the bank.",
    growthSimple: "Since everyone has to stay home, internet and tech companies are going to become more important than ever!"
  },
  "vaccine": {
    value: "The light at the end of the tunnel. Reopening will trigger a massive surge in 'Old Economy' cyclical stocks. I'm rotation into travel and energy.",
    growth: "Don't let the reopening distract you. The habits formed during the lockdown are permanent. Tech is still the only place for real growth.",
    valueSimple: "A vaccine is here! People will start traveling and going out again soon. It's time to look at those businesses.",
    growthSimple: "The vaccine is good news, but people will still use Zoom and shop online. Tech is still the best place to be."
  },

  // India 1991
  "foreign exchange crisis": {
    value: "The nation is on the brink of default. Only the most established legacy industrial houses with real assets will survive this liquidity squeeze.",
    growth: "Crisis breeds reform. This is the catalyst that will finally break the 'License Raj'. I'm looking for the innovators ready to compete globally.",
    valueSimple: "The country is running out of money. This is very serious. Stick with the oldest, strongest companies for now.",
    growthSimple: "This crisis will force the government to change the rules. New, exciting companies will soon be able to grow much faster."
  },
  "lpg budget": {
    value: "Liberalization is a double-edged sword. Legacy monopolies will face brutal global competition. I'm looking for firms with a sustainable cost advantage.",
    growth: "The gates are open! This is the birth of a new consumer class. IT services and private banking are about to see explosive growth.",
    valueSimple: "The government is opening the market. This is good for some, but bad for old companies that had no competition before.",
    growthSimple: "The rules have changed! Now companies can grow as much as they want. It's a great time to invest in new industries like Tech."
  },
  "harshad mehta": {
    value: "A total breakdown of market integrity. This scam shows why regulation is essential. I'm pulling back until the system is cleaned up.",
    growth: "Volatility is the price of progress. The scam is a setback, but the underlying shift toward a modern economy is unstoppable. Buy the fear.",
    valueSimple: "A huge fraud was just discovered in the stock market. It's very messy and dangerous. It's better to wait for things to calm down.",
    growthSimple: "There is a big scandal, but the economy is still opening up. This is just a temporary problem on the way to growth."
  },

  // AI Boom
  "chatgpt": {
    value: "The hype is reaching fever pitch. Generative AI is impressive, but where is the path to sustainable profit? I'm watching the margins.",
    growth: "This is the iPhone moment for AI. We are at the base of a parabolic curve. If you don't have massive exposure to compute, you're falling behind.",
    valueSimple: "Everyone is talking about AI. It looks cool, but we need to see if these companies can actually make money from it.",
    growthSimple: "This is a brand new revolution! AI is going to be in everything. We need to buy the companies making the chips and the software."
  },
  "nvidia forecast": {
    value: "The demand is real, but so is the valuation. 100x revenue is a historical warning sign. I'm looking for the secondary beneficiaries in power and cooling.",
    growth: "The forecast is a validation of the AI era. This isn't speculation; it's a massive build-out of global infrastructure. There is no ceiling here.",
    valueSimple: "The AI chip makers are doing great, but they are very expensive now. Look for other companies that help AI, like power companies.",
    growthSimple: "The AI boom is officially here! These companies are making even more money than anyone expected. Keep buying!"
  },

  // EV Rise
  "dieselgate": {
    value: "The end of the internal combustion era is closer than we thought. Legacy automakers with heavy diesel exposure are now value traps.",
    growth: "Regulatory tailwinds just turned into a gale-force wind for EVs. This is the catalyst that forces every government to subsidize the transition.",
    valueSimple: "A big scandal with regular cars is pushing everyone toward electric cars. Old car companies are in big trouble.",
    growthSimple: "Governments are going to start giving lots of money to electric car companies now. This is a huge win for the new players!"
  },
  "model 3 production": {
    value: "Manufacturing is hard. Scaling a mass-market car while burning billions is a high-risk gamble. I'm waiting for proof of positive cash flow.",
    growth: "This is 'Production Hell' before 'Profit Heaven'. The mission is to own the future of transport. Short-term manufacturing hurdles are irrelevant.",
    valueSimple: "Making millions of cars is very difficult and expensive. We need to see if they can actually do it without going broke.",
    growthSimple: "They are having some trouble making cars right now, but that's normal for a new company. Once they fix it, they will own the market."
  },

  // Inflation 2022
  "inflation hits 40-year high": {
    value: "The era of 'Easy Money' is over. I'm moving to companies with 'Pricing Power'—those that can raise prices without losing customers.",
    growth: "Rising rates are a death sentence for high-multiple growth. The present value of future earnings is collapsing. Rotation into energy is mandatory.",
    valueSimple: "Everything is getting more expensive. Only invest in companies that can raise their prices easily.",
    growthSimple: "High interest rates make tech stocks drop in price. It's time to look at energy and oil companies instead."
  }
};

export const getMentorAdvice = (
  newsTitle: string, 
  sentiment: 'bullish' | 'bearish' | 'neutral', 
  beginnerMode: boolean,
  scenarioId?: string,
  monthIndex: number = 0
): MentorAdvice[] => {
  const valueHunter = {
    persona: "The Value Hunter",
    avatar: "🧐",
    color: "var(--dark-sepia)",
    advice: ""
  };

  const growthGuru = {
    persona: "The Growth Guru",
    avatar: "🚀",
    color: "var(--rust)",
    advice: ""
  };

  // Improved matching logic: Keyword based
  const lowerTitle = newsTitle.toLowerCase();
  let matchedAdvice: HistoricalAdvice | null = null;

  for (const [key, advice] of Object.entries(historicalSpecificAdvice)) {
    if (lowerTitle.includes(key)) {
      matchedAdvice = advice;
      break;
    }
  }

  if (matchedAdvice) {
    valueHunter.advice = beginnerMode ? matchedAdvice.valueSimple : matchedAdvice.value;
    growthGuru.advice = beginnerMode ? matchedAdvice.growthSimple : matchedAdvice.growth;
    return [valueHunter, growthGuru];
  }

  // Fallback to sentiment-based advice with scenario-specific personality
  // Fallback to sentiment-based advice with scenario-specific personality
  const seed = newsTitle.length + (monthIndex * 7);
  
  if (sentiment === 'bearish') {
    const options = [
      {
        v: "Market capitulation creates significant mispricing. I'm looking for high-quality assets trading below their intrinsic value.",
        g: "The macro headwinds are too strong for high-beta plays. Preservation of capital is priority one.",
        vs: "Prices are falling, which means great companies are becoming cheaper. This is the perfect time to look for a bargain!",
        gs: "The trend is down. It's better to stay in cash and wait for the next big technology wave to start."
      },
      {
        v: "Fear is a powerful motivator. I'm analyzing balance sheets to find the survivors who will dominate when the dust settles.",
        g: "This is a shakeout. Only the most efficient growth companies will secure funding. The era of 'easy money' is over.",
        vs: "People are scared, but don't panic. Look for the strongest companies that will survive this.",
        gs: "It's getting harder for new companies to get money. We only want the very best ones now."
      },
      {
        v: "When there's blood in the streets, you buy. But you only buy companies with fortress balance sheets and steady cash flows, not speculative junk.",
        g: "Innovation doesn't stop during a panic, but funding does. I'm taking a tactical pause to identify the disruptive leaders who can actually weather this storm.",
        vs: "It's scary now, but historic lows are when fortunes are made if you buy safe, cash-rich companies.",
        gs: "Even new tech companies need cash. Right now, wait and see which ones survive the drop before buying."
      },
      {
        v: "Earnings estimates are still too high. I expect further downward revisions. Keep your powder dry until the fundamental picture stabilizes.",
        g: "Market drawdowns often reset the baseline for secular growth trends. The key is to wait for a definitive reversal signal before deploying heavy capital.",
        vs: "Company profits might drop more, so don't rush to buy just yet. Waiting a little longer is safer.",
        gs: "Prices are lower, but they could go lower still! We need to see clear signs of an uptrend before diving back in."
      }
    ];
    
    // Add scenario flavor
    if (scenarioId === '1992-india' && (seed % options.length) === 0) {
      options[0].v = "In this regulated market, a crisis usually means the government will pivot. I'm sticking with the old industrial houses.";
      options[0].vs = "The economy is in trouble, but the oldest and biggest companies in India will likely be saved by the government.";
    }

    const pick = options[seed % options.length];
    valueHunter.advice = beginnerMode ? pick.vs : pick.v;
    growthGuru.advice = beginnerMode ? pick.gs : pick.g;
  } else if (sentiment === 'bullish') {
    const options = [
      {
        v: "We are seeing signs of irrational exuberance. Valuations are stretched beyond historical norms. Margin of safety is non-existent.",
        g: "The momentum is incredible! If you don't buy now, you'll miss out on the biggest gains of the decade.",
        vs: "Everyone is excited, which usually means prices are too high. I would be very careful about buying right now.",
        gs: "The market is moving fast! If you don't invest now, you might miss out on big profits."
      },
      {
        v: "The crowd is rarely right at the top. I'm taking profits and moving to more defensive, dividend-paying stocks.",
        g: "This isn't a bubble; it's a structural shift. The old rules don't apply to these new technologies. Aggressive allocation is key.",
        vs: "It's a good time to sell some and keep your profits safe. Don't get too greedy when everyone else is.",
        gs: "Technology is changing the world forever. These companies are going to be huge, even if they look expensive now."
      },
      {
        v: "A rising tide lifts all boats, even the leaky ones. I'm rotating out of overhyped names and into solid, boring cash cows that are being ignored.",
        g: "We're entering a hyper-growth phase. Breakouts on heavy volume are validating the thesis. Now is the time to leverage the winners.",
        vs: "When prices soar, even bad companies go up. Stick to the reliable ones that make real money.",
        gs: "Growth is accelerating rapidly! When you see a winner, buy more to maximize your profits."
      },
      {
        v: "Every bull market ends in a mania. Look closely at price-to-earnings ratios... they are completely decoupled from economic reality.",
        g: "Total addressable markets are expanding faster than analysts can model. Don't let old-school valuation metrics scare you out of generational wealth.",
        vs: "Prices don't make sense compared to how much companies actually earn. This rapid rise will eventually slow down.",
        gs: "These new companies can grow way bigger than anyone thinks. Old math won't work on new industries!"
      }
    ];
    const pick = options[seed % options.length];
    valueHunter.advice = beginnerMode ? pick.vs : pick.v;
    growthGuru.advice = beginnerMode ? pick.gs : pick.g;
  } else {
    const options = [
      {
        v: "Consolidation is healthy. I'm reviewing balance sheets to ensure our core holdings maintain their competitive advantage.",
        g: "The lack of volatility is a signal to scout for asymmetrical risk-reward opportunities in emerging sectors.",
        vs: "The market is quiet. Use this time to check if your companies still have a good 'Moat'.",
        gs: "Boring markets are for boring investors. I'm looking for the next small company that will disrupt everything."
      },
      {
        v: "Sideways markets are when dividends matter most. Cash flows protect against the downside while we wait for clarity.",
        g: "Range-bound action suggests accumulation by smart money. I'm building positions before the next explosive breakout.",
        vs: "When stocks aren't moving, dividends pay you to wait. Focus on steady income.",
        gs: "When things are slow, large investors are quietly buying. Find out what they're buying before the price leaps."
      },
      {
        v: "No clear trend means market efficiency is re-establishing itself. Let's hunt for under-the-radar value traps.",
        g: "Don't mistake low volume for low potential. Innovation happens regardless of the ticker tape. Keep focusing on product pipelines.",
        vs: "The market is searching for direction. Stick to the basics of buying companies for less than they are worth.",
        gs: "Even when prices are flat, companies are building new things. Invest in the future products."
      }
    ];
    const pick = options[seed % options.length];
    valueHunter.advice = beginnerMode ? pick.vs : pick.v;
    growthGuru.advice = beginnerMode ? pick.gs : pick.g;
  }

  return [valueHunter, growthGuru];
};
