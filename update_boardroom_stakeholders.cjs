const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/boardroom.json', 'utf8'));

// Add stakeholderImpact to all options
data.forEach(caseStudy => {
  caseStudy.rounds.forEach(round => {
    round.options.forEach(option => {
      if (!option.stakeholderImpact) {
        // Generate some random but plausible impacts based on the margin impact
        const marginImpact = option.impact.margin || 1.0;
        
        option.stakeholderImpact = {
          shareholders: marginImpact > 1 ? 5 : -5,
          employees: marginImpact > 1 ? 2 : -5,
          creditors: marginImpact > 1 ? 2 : -2,
          regulators: 0,
          media: marginImpact > 1 ? 10 : -10
        };
      }
    });
  });
});

fs.writeFileSync('src/data/boardroom.json', JSON.stringify(data, null, 2));
