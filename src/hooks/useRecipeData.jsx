import { useState, useEffect } from 'react';

const useRecipeData = (user, token) => {
  const [favoritedRecipes, setFavoritedRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch favorited recipes
        const favResponse = await fetch(`http://localhost:5001/api/favourites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!favResponse.ok) throw new Error("Failed to fetch favorited recipes");
        const favData = await favResponse.json();
        // Filter out any null or undefined recipes
        const validFavorites = favData.filter(recipe => recipe && recipe._id);
        setFavoritedRecipes(validFavorites);

        // Fetch user's recipes
        const recipesResponse = await fetch(`http://localhost:5001/api/recipe/user/approved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!recipesResponse.ok) throw new Error("Failed to fetch user recipes");
        const recipesData = await recipesResponse.json();
        setUserRecipes(recipesData);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    if (user) fetchData();
  }, [user, token]);

  return { favoritedRecipes, setFavoritedRecipes, userRecipes, setUserRecipes, userRating, setUserRating };
};

export default useRecipeData;