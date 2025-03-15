const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const authCheck = require("../middleware/AuthMiddleware");
const Rating = require("../models/Rating");
const adminAuthCheck = require("../middleware/AuthMiddlewareAdmin");

// Multer storage configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/recipe");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}-${Date.now()}${ext}`);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Multer middleware
const upload = multer({ storage: fileStorage, fileFilter });

// Create a new recipe
router.post("/create", authCheck, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      calories,
      caloriesPerServing = 2,
    } = req.body;

    const image = req.file ? req.file.path : null;

    const recipe = new Recipe({
      userId: req.user._id,
      title,
      ingredients: ingredients.split(","),
      instructions: instructions.split(","),
      prepTime,
      cookTime,
      servings,
      calories,
      caloriesPerServing,
      image,
    });

    await recipe.save();

    res.status(201).json(recipe);
  } catch (error) {
    console.error("❌ Error creating recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all recipes
router.get("/list", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single recipe by ID
router.get("/details/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const ratings = await Rating.find({ recipeId: req.params.id });
    const averageRating =
      ratings.length > 0
        ? (
            ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          ).toFixed(1)
        : 0;

    res.status(200).json({ ...recipe.toObject(), averageRating });
  } catch (error) {
    console.error("❌ Error fetching recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a recipe by ID
router.put("/update/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error("❌ Error updating recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a recipe by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Search Recipes by Ingredients
router.post("/search", async (req, res) => {
  try {
    const { ingredients } = req.body;
    const searchIngredients = ingredients
      .split(",")
      .map((ing) => ing.trim().toLowerCase());

    const recipes = await Recipe.find({ status: "approved" });
    const matchedRecipes = recipes
      .map((recipe) => {
        const matchedCount = recipe.ingredients.filter((ing) =>
          searchIngredients.includes(ing)
        ).length;
        const matchPercentage =
          (matchedCount / recipe.ingredients.length) * 100;
        return { ...recipe.toObject(), matchPercentage };
      })
      .filter((recipe) => recipe.matchPercentage > 40)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json(matchedRecipes);
  } catch (error) {
    console.error("❌ Error searching recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get Recipes Pending Approval for Admin
router.get("/admin", async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: { $ne: "approved" } }).populate(
      "userId"
    );

    res.status(200).json(recipes);
  } catch (error) {
    console.error("❌ Error searching recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Approve Recipe
router.patch("/admin/approve/:id", adminAuthCheck, async (req, res) => {
  try {
    const { id: recipeId } = req.params;

    // Validate recipe ID format
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid recipe ID format" });
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if recipe is already approved
    if (recipe.status === "approved") {
      return res.status(400).json({ message: "Recipe is already approved" });
    }

    // Update status to "approved"
    recipe.status = "approved";
    await recipe.save();

    res.status(200).json({
      message: "Recipe approved successfully",
      recipe,
    });
  } catch (error) {
    console.error("❌ Error approving recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//reject recipe
router.post("/admin/reject/:id", adminAuthCheck, async (req, res) => {
  try {
    const recipeId = req.params.id;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { status: "rejected" },
      { new: true } // This returns the updated recipe
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("❌ Error approving recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//grouping all incredients
router.get("/incredients", async (req, res) => {
  try {
    const ingredients = await Recipe.aggregate([
      { $match: { status: "approved" } }, // Filter approved recipes
      { $unwind: "$ingredients" }, // Flatten ingredients array
      { $group: { _id: "$ingredients" } }, // Get unique ingredients
      { $sort: { _id: 1 } }, // Sort alphabetically
    ]);

    res.json(ingredients.map(i => i._id.charAt(0).toUpperCase() + i._id.slice(1))); // Return as an array of strings
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Get approved recipes for a specific user
router.get("/user/approved", authCheck, async (req, res) => {
  try {
    const recipes = await Recipe.find({
      userId: req.user._id,
      status: "approved"
    });
    
    res.status(200).json(recipes);
  } catch (error) {
    console.error("❌ Error fetching user's approved recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
