import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const AddRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Add ref for file input
  
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    caloriesPerServing: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setRecipe((prev) => ({ ...prev, image: file }));
  };

  const resetForm = () => {
    setRecipe({
      title: "",
      ingredients: "",
      instructions: "",
      prepTime: "",
      cookTime: "",
      servings: "",
      caloriesPerServing: "",
      image: null,
    });
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    for (const key in recipe) {
      formData.append(key, recipe[key]);
    }

    try {
      const response = await fetch("http://localhost:5001/api/recipe/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        resetForm(); // Use the new reset function
      } else {
        console.error("❌ Failed to add recipe", data);
      }
    } catch (error) {
      console.error("❌ Error submitting recipe", error);
    }
  };

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-transition max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-shadow text-center mb-8">
          Add New Recipe
        </h1>

        <div className="glass p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-white font-medium mb-2">
                  Recipe Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={recipe.title}
                  onChange={handleChange}
                  className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter recipe title"
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-white font-medium mb-2">
                  Recipe Image
                </label>
                <input
                  ref={fileInputRef} // Add ref here
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="prepTime" className="block text-white font-medium mb-2">
                  Prep Time (minutes)
                </label>
                <input
                  id="prepTime"
                  name="prepTime"
                  type="number"
                  value={recipe.prepTime}
                  onChange={handleChange}
                  className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="15"
                  // removed required
                />
              </div>

              <div>
                <label htmlFor="cookTime" className="block text-white font-medium mb-2">
                  Cook Time (minutes)
                </label>
                <input
                  id="cookTime"
                  name="cookTime"
                  type="number"
                  value={recipe.cookTime}
                  onChange={handleChange}
                  className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="30"
                  required // Added required
                />
              </div>

              <div>
                <label htmlFor="servings" className="block text-white font-medium mb-2">
                  Servings
                </label>
                <input
                  id="servings"
                  name="servings"
                  type="number"
                  value={recipe.servings}
                  onChange={handleChange}
                  className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="4"
                  required
                />
              </div>
              <div>
                <label htmlFor="caloriesPerServing" className="block text-white font-medium mb-2">
                  Calories
                </label>
                <input
                  id="caloriesPerServing"
                  name="caloriesPerServing"
                  type="number"
                  value={recipe.caloriesPerServing}
                  onChange={handleChange}
                  className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="4"
                  // removed required
                />
              </div>
            </div>

            <div>
              <label htmlFor="ingredients" className="block text-white font-medium mb-2">
                Ingredients
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={recipe.ingredients}
                onChange={handleChange}
                rows={4}
                className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter ingredients, one per line"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="instructions" className="block text-white font-medium mb-2">
                Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                value={recipe.instructions}
                onChange={handleChange}
                rows={6}
                className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter cooking instructions step by step"
                // removed required
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button type="submit" className="btn btn-primary btn-3d px-8">
                Add Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
