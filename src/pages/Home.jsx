import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import HealthBot from "../components/HealthBot";
import SearchBar from "../components/SearchBar";
import HealthTip from "../components/HealthTip";
import RecipeDetails from "../components/recipe-details/RecipeDetails";
import { Clock, Flame, Percent, ClipboardList, BarChart3, Zap } from "lucide-react";

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (searchIngredients) => {
    console.log('Searching for ingredients:', searchIngredients);
    try {
      const response = await fetch("${import.meta.env.VITE_API_BASE_URL}/api/recipe/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ingredients: searchIngredients})
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
  
      const data = await response.json();
      setSearchResults(data);
      console.log("Matched Recipes:", data);
    } catch (error) {
      console.error("❌ Error searching recipes:", error);
    }
    setHasSearched(true);
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleRecipeClick = (recipe) => {
    setExpandedRecipe(recipe);
  };

  const handleCloseExpanded = () => {
    setExpandedRecipe(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-transition flex flex-col items-center max-w-5xl mx-auto">
        <HealthTip />

        <div className="w-full max-w-4xl mb-6 mt-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {hasSearched && (
          <div className="w-full max-w-4xl my-8">
            <h3 className="text-2xl font-bold mb-6 text-white/90">
              {searchResults.length > 0 ? `Found ${searchResults.length} recipes` : 'No recipes found'} 
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(recipe => (
                <div 
                  key={recipe._id} 
                  className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-xl hover:shadow-purple-500/10 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">
                      {recipe.title}
                    </h4>
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="flex items-center gap-1">
                        <Percent className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {Math.round(recipe.matchPercentage)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-3">
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg backdrop-blur-sm">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-sm">{recipe.caloriesPerServing} cal</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg backdrop-blur-sm">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{recipe.prepTime} min</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-2 rounded-lg backdrop-blur-sm">
                    <p className="text-sm text-white/80">
                      <span className="text-white/60">Ingredients: </span>
                      {recipe.ingredients.slice(0, 3).join(', ')}
                      {recipe.ingredients.length > 3 && '...'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col items-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-4 border border-white/20 flex items-center justify-center">
                  <ClipboardList className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Health Recipes
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Discover delicious and nutritious recipes tailored to your dietary preferences.
                </p>
              </div>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col items-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-4 border border-white/20 flex items-center justify-center">
                  <BarChart3 className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Calorie Tracking
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Track your daily calorie intake and get insights to maintain a balanced diet.
                </p>
              </div>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col items-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-4 border border-white/20 flex items-center justify-center">
                  <Zap className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Quick Tips
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Get instant health and nutrition tips to improve your daily habits.
                </p>
              </div>
            </div>
          </div>
        )}

        {!user && (
          <div className="mt-16">
            <button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-purple-500/25 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {expandedRecipe && (
        <RecipeDetails 
          expandedRecipe={expandedRecipe} 
          handleCloseExpanded={handleCloseExpanded}
        />
      )}
    </div>
  );
};

export default Home;