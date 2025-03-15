import React from 'react';
import { Trash2, Flame, Clock } from 'lucide-react';

const MyRecipeCard = ({ recipe, onDelete, onClick }) => {
  if (!recipe || !recipe._id) return null;

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-xl hover:shadow-purple-500/10 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 relative">
      <button
        className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(recipe._id);
        }}
      >
        <Trash2 className="w-4 h-4 text-white" />
      </button>

      <div className="cursor-pointer" onClick={() => onClick(recipe)}>
        <img
          src={`http://localhost:5001/${recipe.image}`}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />

        <h3 className="text-lg font-semibold text-white mb-2">{recipe.title}</h3>
        <div className="flex gap-4 mb-3">
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg backdrop-blur-sm">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-white/90">{recipe.caloriesPerServing} cal</span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg backdrop-blur-sm">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/90">{recipe.prepTime} min</span>
          </div>
        </div>
        <div className="bg-white/5 p-2 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-white/80">
            <span className="text-white/60">Ingredients: </span>
            {recipe.ingredients.slice(0, 3).join(", ")}
            {recipe.ingredients.length > 3 && "..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyRecipeCard;