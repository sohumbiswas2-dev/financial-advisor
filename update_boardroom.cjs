const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/boardroom.json', 'utf8'));

// Add some teachMe objects
data[0].rounds[0].options[0].teachMe = {
  principleName: "Innovator's Dilemma",
  definition: "Successful companies fail because they continue to do what made them successful, ignoring disruptive technologies.",
  infographicId: "MarketCycle",
  example: "Kodak invented the digital camera but buried it to protect their highly profitable film business, eventually leading to bankruptcy.",
  application: "By doubling down on DVDs, you protected short-term margins but left the company vulnerable to digital disruption."
};

data[0].rounds[0].options[1].teachMe = {
  principleName: "Capital Allocation",
  definition: "The process of deciding how to distribute a company's financial resources to maximize shareholder value.",
  infographicId: "FreeCashFlow",
  example: "Amazon consistently reinvested its cash flow into new infrastructure (AWS, logistics) rather than paying dividends, creating massive long-term value.",
  application: "You sacrificed short-term profitability to fund a massive pivot, betting that future scale will offset current losses."
};

data[0].rounds[0].options[2].teachMe = {
  principleName: "Option Value",
  definition: "The value of having the right, but not the obligation, to take a specific action in the future.",
  infographicId: "OptionsPayoff",
  example: "Microsoft often builds 'me-too' products to test markets before committing massive resources to dominate them.",
  application: "You created a low-cost option to test streaming demand without cannibalizing your core DVD business."
};

fs.writeFileSync('src/data/boardroom.json', JSON.stringify(data, null, 2));
