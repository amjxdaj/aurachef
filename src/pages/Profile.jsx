import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import useRecipeData from "../hooks/useRecipeData";
import ProfileHeader from "../components/profile/ProfileHeader";
import RecipeCard from "../components/profile/RecipeCard";
import MyRecipeCard from "../components/profile/MyRecipeCard";
import RecipeModel from "../components/profile/RecipeModel";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const token = localStorage.getItem("token");
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const { 
    favoritedRecipes, 
    setFavoritedRecipes, 
    userRecipes, 
    setUserRecipes,
    userRating, 
    setUserRating 
  } = useRecipeData(user, token);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const handleDeleteRecipe = async (recipeId) => {
    try {
      // First, delete the recipe
      const deleteResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recipe/delete/${recipeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!deleteResponse.ok) throw new Error('Failed to delete recipe');

      // Remove recipe from favorites collection
      const removeFavResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/favourites/remove/${recipeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!removeFavResponse.ok) throw new Error('Failed to remove from favorites');

      // Remove recipe ratings
      const removeRatingsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rating/remove/${recipeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!removeRatingsResponse.ok) throw new Error('Failed to remove ratings');

      // Update local state
      setUserRecipes(userRecipes.filter(recipe => recipe && recipe._id !== recipeId));
      setFavoritedRecipes(favoritedRecipes.filter(recipe => recipe && recipe._id !== recipeId));
      
      // If the expanded recipe is the one being deleted, close the modal
      if (expandedRecipe?._id === recipeId) {
        setExpandedRecipe(null);
      }
    } catch (error) {
      console.error("❌ Error deleting recipe:", error);
    }
  };

  const handleFavoriteToggle = async (recipeId) => {
    if (!token) {
      alert("You must be logged in to favorite recipes!");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/favourites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId }),
      });

      if (!response.ok) throw new Error("Failed to update favorite status");

      const data = await response.json();
      if (data.isFavorited) {
        setFavoritedRecipes([...favoritedRecipes, expandedRecipe]);
      } else {
        setFavoritedRecipes(favoritedRecipes.filter(r => r && r._id !== recipeId));
      }
    } catch (error) {
      console.error("❌ Error updating favorite:", error.message);
    }
  };

  const handleRatingChange = async (rating, recipeId) => {
    if (!token) {
      alert("You must be logged in to rate!");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rating/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId, rating, review: "" }),
      });

      if (!response.ok) throw new Error("Failed to rate recipe");
      const data = await response.json();
      setUserRating(data.rating);
    } catch (error) {
      console.error("❌ Error submitting rating:", error.message);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-transition max-w-5xl mx-auto">
        <ProfileHeader 
          user={user}
          onEditProfile={() => navigate("/edit-profile")}
          onLogout={() => {
            logout();
            navigate("/login");
          }}
        />

        {/* My Recipes Section */}
        <h2 className="text-2xl font-bold text-white mb-4">My Recipes</h2>
        {userRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {userRecipes.map((recipe) => (
              recipe && recipe._id && (
                <MyRecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onDelete={handleDeleteRecipe}
                  onClick={setExpandedRecipe}
                />
              )
            ))}
          </div>
        ) : (
          <div className="glass p-6 rounded-xl text-center mb-8">
            <p className="text-white/80">
              You haven't contributed any recipes yet.
            </p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => navigate("/add-recipe")}
            >
              Add Your First Recipe
            </button>
          </div>
        )}

        {/* Favorited Recipes Section */}
        <h2 className="text-2xl font-bold text-white mb-6">Favorite Recipes</h2>
        {favoritedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritedRecipes.map(recipe => (
              recipe && recipe._id && (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onFavoriteToggle={handleFavoriteToggle}
                  onRecipeClick={setExpandedRecipe}
                />
              )
            ))}
          </div>
        ) : (
          <div className="glass p-6 rounded-xl text-center">
            <p className="text-white/80">You don't have any favorite recipes yet.</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate("/")}>
              Browse Recipes
            </button>
          </div>
        )}

        {/* Expanded Recipe Modal */}
        {expandedRecipe && expandedRecipe._id && (
          <RecipeModel
            recipe={expandedRecipe}
            onClose={() => setExpandedRecipe(null)}
            onFavoriteToggle={handleFavoriteToggle}
            onRatingChange={handleRatingChange}
            userRating={userRating}
            isFavorited={favoritedRecipes.some(r => r && r._id === expandedRecipe._id)}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;