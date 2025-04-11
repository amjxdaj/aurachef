import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const AddRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [notification, setNotification] = useState({
    show: false,
    message: ''
  });
  
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", 'aurachef');
  
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dcgmvwfll/image/upload', {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Cloudinary Response:", data);
  
      return data.secure_url || null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const imageUrl = await handleImageUpload(recipe.image);
    
    const formData = {
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      caloriesPerServing: recipe.caloriesPerServing,
      image: imageUrl,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recipe/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setNotification({
          show: true,
          message: 'Recipe added successfully! 🎉'
        });
        setTimeout(() => {
          setNotification({ show: false, message: '' });
        }, 3000);
        resetForm();
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
    <div className="min-h-screen pt-24 pb-12 relative">
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
                  ref={fileInputRef}
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
                  required
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
      
      {notification.show && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AddRecipe;