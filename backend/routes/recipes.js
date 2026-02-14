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
    const { minCal, maxCal, goal } = req.query;

    try {
        let page = 1;
        const maxPages = 10;
        let limit = 50;
        let matchedRecipes = [];

        while (page <= maxPages && matchedRecipes.length < 20) {

            const response = await axios.get(
                `http://cosylab.iiitd.edu.in:6969/recipe2-api/recipe-micronutri/micronutritioninfo?page=${page}&limit=${limit}`,
                { headers }
            );

            const recipes = response.data.payload.data;

            console.log("Page:", page);
            console.log("Recipes fetched:", recipes.length);

            if (!recipes || recipes.length === 0) break;

            // 🔥 FILTER INSIDE LOOP
            const minCalories = parseFloat(minCal);
            const maxCalories = parseFloat(maxCal);

            const filteredRecipes = recipes.filter(recipe => {
                const calories = parseFloat(recipe["Calories"] || 0);

                const minCheck = isNaN(minCalories) || calories >= minCalories;
                const maxCheck = isNaN(maxCalories) || calories <= maxCalories;

                return minCheck && maxCheck;
            });


            console.log("Filtered count:", filteredRecipes.length);

            const scored = filteredRecipes.map(recipe => ({
                title: recipe["Recipe_title"],
                calories: recipe["Calories"],
                score: calculateScore(goal, recipe),
                risks: riskAnalysis(recipe)
            }));

            matchedRecipes = [...matchedRecipes, ...scored];

            page++;
        }

        matchedRecipes.sort((a, b) => b.score - a.score);

        res.json(matchedRecipes.slice(0, 5));

    } catch (err) {
        console.error("Match API Error:", err.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});



module.exports = router;
