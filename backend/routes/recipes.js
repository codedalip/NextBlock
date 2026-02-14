const express = require("express");
const axios = require("axios");
const auth = require("../middleware/authMiddleware");
const { calculateScore, riskAnalysis } = require("../utils/scoring");

const router = express.Router();

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.FOODOSCOPE_TOKEN}`
};

router.get("/match", auth, async (req, res) => {
  const {
    minCal,
    maxCal,
    goal,
    minProtein,
    maxCarbs,
    maxSugar,
    maxFat,
    minFiber,
    maxSodium,
    minIron,
    minVitaminC
  } = req.query;

  try {
    let page = 1;
    const limit = 50;
    const maxPages = 10;
    let matchedRecipes = [];

    while (page <= maxPages && matchedRecipes.length < 20) {

      const response = await axios.get(
        `https://api.foodoscope.com/recipe2-api/recipe-micronutri/micronutritioninfo?page=${page}&limit=${limit}`,
        { headers }
      );

      const recipes = response.data.payload.data;

      if (!recipes || recipes.length === 0) break;

      const filtered = recipes.filter(recipe => {

        const calories = parseFloat(recipe["Calories"] || 0);
        const protein = parseFloat(recipe["Protein (g)"] || 0);
        const carbs = parseFloat(recipe["Carbohydrate, by difference (g)"] || 0);
        const sugar = parseFloat(recipe["Sugars, total (g)"] || 0);
        const fat = parseFloat(recipe["Total lipid (fat) (g)"] || 0);
        const fiber = parseFloat(recipe["Fiber, total dietary (g)"] || 0);
        const sodium = parseFloat(recipe["Sodium, Na (mg)"] || 0);
        const iron = parseFloat(recipe["Iron, Fe (mg)"] || 0);
        const vitaminC = parseFloat(recipe["Vitamin C, total ascorbic acid (mg)"] || 0);

        return (
          (!minCal || calories >= minCal) &&
          (!maxCal || calories <= maxCal) &&
          (!minProtein || protein >= minProtein) &&
          (!maxCarbs || carbs <= maxCarbs) &&
          (!maxSugar || sugar <= maxSugar) &&
          (!maxFat || fat <= maxFat) &&
          (!minFiber || fiber >= minFiber) &&
          (!maxSodium || sodium <= maxSodium) &&
          (!minIron || iron >= minIron) &&
          (!minVitaminC || vitaminC >= minVitaminC)
        );
      });

      const scored = filtered.map(recipe => {
        const score = calculateScore(goal, recipe);
        const risks = riskAnalysis(recipe);

        return {
          title: recipe["Recipe_title"],
          calories: recipe["Calories"],
          score,
          risks
        };
      });

      matchedRecipes = [...matchedRecipes, ...scored];
      page++;
    }

    matchedRecipes.sort((a, b) => b.score - a.score);

    res.json(matchedRecipes.slice(0, 5));

  } catch (err) {
    console.error("Match API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});


module.exports = router;
