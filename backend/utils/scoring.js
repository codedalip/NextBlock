function calculateScore(goal, nutrition) {
  let score = 0;

  const protein = parseFloat(nutrition["Protein (g)"] || 0);
  const fiber = parseFloat(nutrition["Fiber, total dietary (g)"] || 0);
  const sugar = parseFloat(nutrition["Sugars, total (g)"] || 0);
  const fat = parseFloat(nutrition["Total lipid (fat) (g)"] || 0);

  if (goal === "weight_loss") {
    score += protein * 2;
    score += fiber * 2;
    score -= sugar * 1.5;
    score -= fat * 1;
  }

  if (goal === "muscle_gain") {
    score += protein * 3;
    score += fiber;
  }

  if (goal === "diabetic") {
    score += fiber * 2;
    score -= sugar * 2;
  }

  return Math.max(0, Math.min(100, score));
}

function riskAnalysis(nutrition) {
  const sugar = parseFloat(nutrition["Sugars, total (g)"] || 0);
  const sodium = parseFloat(nutrition["Sodium, Na (mg)"] || 0);

  return {
    sugarRisk: sugar > 20 ? "High" : sugar > 10 ? "Medium" : "Low",
    sodiumRisk: sodium > 500 ? "High" : sodium > 200 ? "Medium" : "Low"
  };
}

module.exports = { calculateScore, riskAnalysis };
