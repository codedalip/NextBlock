function calculateScore(goal, recipe) {

  const calories = parseFloat(recipe["Calories"] || 0);
  const protein = parseFloat(recipe["Protein (g)"] || 0);
  const carbs = parseFloat(recipe["Carbohydrate, by difference (g)"] || 0);
  const sugar = parseFloat(recipe["Sugars, total (g)"] || 0);
  const fat = parseFloat(recipe["Total lipid (fat) (g)"] || 0);
  const fiber = parseFloat(recipe["Fiber, total dietary (g)"] || 0);

  let score = 50; // base score

  if (goal === "weight_loss") {
    score += (protein * 2);
    score += (fiber * 2);
    score -= (calories / 10);
    score -= (sugar * 3);
    score -= (fat);
  }

  if (goal === "muscle_gain") {
    score += (protein * 3);
    score += (calories / 5);
    score -= (sugar * 2);
  }

  if (goal === "diabetic") {
    score -= (sugar * 5);
    score -= (carbs);
    score += (fiber * 3);
  }

  // Normalize to 0–100 range
  score = Math.max(0, Math.min(100, Math.round(score)));

  return score;
}

function riskAnalysis(recipe) {

  const sugar = parseFloat(recipe["Sugars, total (g)"] || 0);
  const sodium = parseFloat(recipe["Sodium, Na (mg)"] || 0);

  return {
    sugarRisk: sugar > 20 ? "High" : sugar > 10 ? "Medium" : "Low",
    sodiumRisk: sodium > 800 ? "High" : sodium > 400 ? "Medium" : "Low"
  };
}

module.exports = { calculateScore, riskAnalysis };
