import React from 'react';
import { Heart, Flame, Clock } from 'lucide-react';

const RecipeCard = ({ recipe, onFavoriteToggle, onRecipeClick }) => {
  if (!recipe || !recipe._id) return null;
  
  return (
    <div className="relative bg-gradient-to-br from-purple-900/40 to-indigo-950/40 backdrop-blur-xl rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 transform hover:scale-[1.01] transition-all duration-300">
      {/* Background decorative elements */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-10000/20 to-pink-7000/20 pointer-events-none" />
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-white/5 to-white/5 blur-sm pointer-events-none" />
      
      {/* Favorite Button */}
      <button
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle(recipe._id);
        }}
      >
        <Heart className="w-4 h-4 fill-white text-white" />
      </button>

      <div className="relative cursor-pointer" onClick={() => onRecipeClick(recipe)}>
        {/* Image with gradient overlay */}
        <div className="relative rounded-xl overflow-hidden mb-4 group">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white/90 mb-4">{recipe.title}</h3>

        {/* Stats */}
        <div className="flex gap-3 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-white/90">{recipe.caloriesPerServing} cal</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white/90">{recipe.prepTime} min</span>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white/10 hover:bg-white/15 border border-white/20 p-3 rounded-lg">
          <p className="text-sm text-white/80">
            <span className="text-white/60">Ingredients: </span>
            {recipe.ingredients.slice(0, 3).join(', ')}
            {recipe.ingredients.length > 3 && '...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;