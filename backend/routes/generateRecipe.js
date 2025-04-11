import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// API Endpoint to generate a recipe
router.post("/generate-recipe", async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Recipe title is required." });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${apiKey}`;

        const requestData = {
            prompt: `Generate a detailed recipe for "${title}". Include:
            - Ingredients (as a list)
            - Step-by-step instructions
            - Prep time (minutes)
            - Cook time (minutes)
            - Servings
            - Approximate calorie count`,
        };

        // Using fetch instead of axios
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) throw new Error("Failed to fetch from API");

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.output || "No response from AI";

        res.json({ recipe: generatedText });
    } catch (error) {
        console.error("Error generating recipe:", error);
        res.status(500).json({ error: "Failed to generate recipe" });
    }
});

export default router;
