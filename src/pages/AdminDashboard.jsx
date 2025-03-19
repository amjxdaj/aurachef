import React, { useEffect, useState } from "react";
import { Check, X, ChevronDown, ChevronUp, RotateCw, Heart, Star, RotateCcw, Trash2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [rejectedRecipes, setRejectedRecipes] = useState([]);
  const [approvedRecipes, setApprovedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const [pendingResponse, approvedResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recipe/admin`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recipe/admin/approved`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        ]);

        if (!pendingResponse.ok || !approvedResponse.ok) 
          throw new Error("Failed to fetch recipes");

        const pendingData = await pendingResponse.json();
        const approvedData = await approvedResponse.json();
        
        setPendingRecipes(pendingData.filter(recipe => recipe.status === "pending"));
        setRejectedRecipes(pendingData.filter(recipe => recipe.status === "rejected"));
        setApprovedRecipes(approvedData);
      } catch (error) {
        console.error("❌ Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [token]);

  const handleStatusUpdate = async (recipeId, action) => {
    try {
      const method = action === "approve" ? "PATCH" : "POST";
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/recipe/admin/${action}/${recipeId}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} recipe`);
      }

      // Update lists based on the action
      if (action === "approve") {
        const recipe = [...pendingRecipes, ...rejectedRecipes].find(r => r._id === recipeId);
        if (recipe) {
          setApprovedRecipes(prev => [...prev, { ...recipe, status: "approved" }]);
          setPendingRecipes(recipes => recipes.filter(recipe => recipe._id !== recipeId));
          setRejectedRecipes(recipes => recipes.filter(recipe => recipe._id !== recipeId));
        }
      } else if (action === "reject") {
        const recipe = [...pendingRecipes, ...approvedRecipes].find(r => r._id === recipeId);
        if (recipe) {
          setRejectedRecipes(prev => [...prev, { ...recipe, status: "rejected" }]);
          setPendingRecipes(recipes => recipes.filter(recipe => recipe._id !== recipeId));
          setApprovedRecipes(recipes => recipes.filter(recipe => recipe._id !== recipeId));
        }
      } else if (action === "pending") {
        const recipe = [...rejectedRecipes, ...approvedRecipes].find(r => r._id === recipeId);
        if (recipe) {
          setPendingRecipes(prev => [...prev, { ...recipe, status: "pending" }]);
          setRejectedRecipes(recipes => recipes.filter(recipe => recipe._id !== recipeId));
          setApprovedRecipes(recipes => recipes.filter(recipe => recipe._id !== recipeId));
        }
      }
      
      setExpandedRecipe(null);
    } catch (error) {
      console.error(`❌ Error ${action}ing recipe:`, error);
      alert(`Failed to ${action} recipe. Please try again.`);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/recipe/delete/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      // Remove recipe from all lists
      setPendingRecipes(recipes => recipes.filter(recipe => recipe._id !== recipeId));
      setRejectedRecipes(recipes => recipes.filter(recipe => recipe._id !== recipeId));
      setApprovedRecipes(recipes => recipes.filter(recipe => recipe._id !== recipeId));
      setExpandedRecipe(null);
    } catch (error) {
      console.error("❌ Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  const handleRecipeClick = (recipe) => {
    setExpandedRecipe(expandedRecipe?._id === recipe._id ? null : recipe);
  };

  const RecipeList = ({ recipes, type }) => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <RotateCw className="w-8 h-8 animate-spin text-white/50 mx-auto" />
          <p className="text-white/80 mt-2">Loading recipes...</p>
        </div>
      );
    }

    if (recipes.length === 0) {
      return (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/80 text-lg">
            No {type.toLowerCase()} recipes to review
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer border border-white/10 group"
            onClick={() => handleRecipeClick(recipe)}
          >
            <div className="p-4">
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold truncate pr-4">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      {type !== "Approved" && (
                        <button
                          onClick={() => handleStatusUpdate(recipe._id, "approve")}
                          className="p-2 bg-green-500/20 rounded-full hover:bg-green-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-green-500/20"
                          title="Approve recipe"
                        >
                          <Check className="w-4 h-4 text-green-400" />
                        </button>
                      )}
                      {type === "Pending" && (
                        <button
                          onClick={() => handleStatusUpdate(recipe._id, "reject")}
                          className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-red-500/20"
                          title="Reject recipe"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                      {type === "Rejected" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(recipe._id, "pending")}
                            className="p-2 bg-blue-500/20 rounded-full hover:bg-blue-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-blue-500/20"
                            title="Move to pending"
                          >
                            <RotateCcw className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecipe(recipe._id)}
                            className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-red-500/20"
                            title="Delete recipe"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </>
                      )}
                      {type === "Approved" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(recipe._id, "reject")}
                            className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-red-500/20"
                            title="Reject recipe"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecipe(recipe._id)}
                            className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-red-500/20"
                            title="Delete recipe"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">By</p>
                      <p className="font-medium truncate">{recipe.userId?.name}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Time</p>
                      <p className="font-medium">{recipe.prepTime + recipe.cookTime} min</p>
                    </div>
                    <div>
                      <p className="text-white/60">Calories</p>
                      <p className="font-medium">{recipe.caloriesPerServing}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-transition max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <div className="relative">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-2">
              Admin Dashboard
            </h1>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Pending Recipes Card */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden transform perspective-1000">
            <CardHeader className="pb-4 bg-gradient-to-r from-purple-800/50 to-indigo-800/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold text-white">
                  Pending Recipes
                </CardTitle>
                <div className="flex items-center">
                  <div className="animate-pulse mr-2 w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                    {pendingRecipes.length} recipes
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RecipeList recipes={pendingRecipes} type="Pending" />
            </CardContent>
          </Card>

          {/* Approved Recipes Card */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden transform perspective-1000">
            <CardHeader className="pb-4 bg-gradient-to-r from-green-800/50 to-emerald-800/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold text-white">
                  Approved Recipes
                </CardTitle>
                <div className="flex items-center">
                  <div className="animate-pulse mr-2 w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                    {approvedRecipes.length} recipes
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RecipeList recipes={approvedRecipes} type="Approved" />
            </CardContent>
          </Card>

          {/* Rejected Recipes Card */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden transform perspective-1000">
            <CardHeader className="pb-4 bg-gradient-to-r from-red-800/50 to-pink-800/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold text-white">
                  Rejected Recipes
                </CardTitle>
                <div className="flex items-center">
                  <div className="animate-pulse mr-2 w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                    {rejectedRecipes.length} recipes
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RecipeList recipes={rejectedRecipes} type="Rejected" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recipe Details Modal */}
      {expandedRecipe && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setExpandedRecipe(null)}
          ></div>
          <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-white/20 shadow-2xl">
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              onClick={() => setExpandedRecipe(null)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="rounded-lg overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={expandedRecipe.image}
                    alt={expandedRecipe.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                  {expandedRecipe.title}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                    <p className="text-sm text-white/60">Prep Time</p>
                    <p className="font-medium">{expandedRecipe.prepTime} min</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                    <p className="text-sm text-white/60">Cook Time</p>
                    <p className="font-medium">{expandedRecipe.cookTime} min</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                    <p className="text-sm text-white/60">Servings</p>
                    <p className="font-medium">{expandedRecipe.servings}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                    <p className="text-sm text-white/60">Calories</p>
                    <p className="font-medium">{expandedRecipe.caloriesPerServing}/serving</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusUpdate(expandedRecipe._id, "approve")}
                    className="flex-1 py-2 px-4 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-green-500/20"
                  >
                    <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Approve
                  </button>
                  {expandedRecipe.status === "pending" ? (
                    <button
                      onClick={() => handleStatusUpdate(expandedRecipe._id, "reject")}
                      className="flex-1 py-2 px-4 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-red-500/20"
                    >
                      <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Reject
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate(expandedRecipe._id, "pending")}
                      className="flex-1 py-2 px-4 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <RotateCcw className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Move to Pending
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                  Ingredients
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {expandedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-white/90">{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                  Instructions
                </h3>
                <div className="space-y-3">
                  {expandedRecipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <p className="text-white/90">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;