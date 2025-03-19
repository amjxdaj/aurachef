import React, { useEffect, useState } from "react";
import { Heart, Star, X } from "lucide-react";

const RecipeModel = ({ recipe, onClose, onFavoriteToggle, isFavorited: initialFavorited }) => {
  const token = localStorage.getItem("token");
  const [favorited, setFavorited] = useState(initialFavorited);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (!recipe || !recipe._id || !token) return;

    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/recipe/details/${recipe._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }

        const data = await response.json();
        setUserRating((prevRating) => prevRating || parseInt(data.averageRating));
      } catch (error) {
        console.error("❌ Error fetching recipe details:", error.message);
      }
    };

    const fetchFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/favourites/status/${recipe._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch favorite status");
        }

        const data = await response.json();
        setFavorited(data.isFavorited);
      } catch (error) {
        console.error("❌ Error fetching favorite status:", error.message);
      }
    };

    fetchRecipeDetails();
    fetchFavoriteStatus();
  }, [recipe, token]);

  const handleRatingChange = async (rating) => {
    if (!token) {
      alert("You must be logged in to rate!");
      window.location.href = "/login";
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rating/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipeId: recipe._id,
          rating,
          review: "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rate recipe");
      }

      const data = await response.json();
      console.log("✅ Rating submitted:", data);
      setUserRating(data.rating);
    } catch (error) {
      console.error("❌ Error submitting rating:", error.message);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!token) {
      alert("You must be logged in to favorite recipes!");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/favourites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId: recipe._id }),
      });

      if (!response.ok) throw new Error("Failed to update favorite status");

      const data = await response.json();
      setFavorited(data.isFavorited);
      onFavoriteToggle(recipe._id);
    } catch (error) {
      console.error("❌ Error updating favorite:", error.message);
    }
  };

  if (!recipe || !recipe._id) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-white/20">
        <button className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors" onClick={onClose}>
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <img
                src={recipe.image}
                alt={recipe.title || recipe.name}
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              {recipe.title || recipe.name}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {['Prep Time', 'Cook Time', 'Servings', 'Calories'].map((label, i) => (
                <div key={i} className="bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                  <p className="text-sm text-white/60">{label}</p>
                  <p className="font-medium">
                    {label === 'Calories' 
                      ? `${recipe.caloriesPerServing || recipe.calories}/serving`
                      : recipe[label.toLowerCase().replace(' ', '')]}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <button
                className={`p-2 rounded-full ${
                  favorited ? "bg-white/20" : "bg-white/10"
                } transition-colors hover:bg-white/30`}
                onClick={handleFavoriteToggle}
              >
                <Heart
                  className={`h-5 w-5 ${
                    favorited ? "fill-white text-white" : "text-white"
                  }`}
                />
              </button>

              <div className="flex bg-white/5 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none px-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= userRating
                          ? "fill-white text-white"
                          : "text-white/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              Ingredients
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-white/90">{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              Instructions
            </h3>
            <div className="space-y-3">
              {Array.isArray(recipe.instructions) ? (
                recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <p className="text-white/90">{instruction}</p>
                  </div>
                ))
              ) : (
                <p className="text-white/90">{recipe.instructions}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModel;