import React, { useEffect, useState } from 'react';
import HealthBot from './HealthBot';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const getSuggestion = (input) => {
    const ingredients = input.split(',').map(i => i.trim());
    const lastIngredient = ingredients[ingredients.length - 1];
    if (!lastIngredient) return '';

    return ingredientsList.find((item) =>
      item.toLowerCase().startsWith(lastIngredient.toLowerCase())
    ) || '';
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSuggestion(getSuggestion(value));
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Tab" || e.key === "ArrowRight") && suggestion) {
      e.preventDefault();
      const ingredients = searchValue.split(',').map(i => i.trim());
      ingredients[ingredients.length - 1] = suggestion;
      setSearchValue(ingredients.join(', ') + ', ');
      setSuggestion('');
    }

    if (e.key === "," && suggestion) {
      e.preventDefault();
      setSearchValue(prev => prev.replace(/[^,]*$/, suggestion + ', '));
      setSuggestion('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  useEffect(() => {
    const fetchAvailableIncrediant = async () => {
      try {
        const response = await fetch("${import.meta.env.VITE_API_BASE_URL}/api/recipe/incredients", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Incrediants");
        }

        const data = await response.json();
        setIngredientsList(data);
        setSearchResults(data);
      } catch (error) {
        console.error("❌Error Suggestion ", error);
      }
    };

    fetchAvailableIncrediant();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <HealthBot />
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-white/70 group-focus-within:text-white transition-colors duration-200" />
        </div>
        
        <input
          type="search"
          className="w-full bg-white/20 backdrop-blur-md py-4 pl-10 pr-28 text-white placeholder-white/70 
                   outline-none border-2 border-white/10 rounded-full
                   focus:border-white/30 focus:bg-white/30
                   transition-all duration-300 shadow-lg"
          placeholder="Search recipes by ingredients (e.g., banana, milk)"
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {suggestion && (
          <div className="absolute left-12 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <span className="text-white opacity-40">
              {searchValue}
              <span className="text-white opacity-40">
                {suggestion.slice(searchValue.replace(/.*,\s*/, '').length)}
              </span>
            </span>
          </div>
        )}

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button 
            type="submit" 
            className="px-6 py-2 text-sm font-medium text-white
                     bg-white/20 hover:bg-white/30 rounded-full
                     transition-all duration-200 focus:outline-none focus:ring-2 
                     focus:ring-white/50"
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-3 space-x-2">
        <div className="w-2 h-2 rounded-full bg-white/30"></div>
        <p className="text-white/70 text-sm">
          Press Tab or → to autocomplete suggestions
        </p>
        <div className="w-2 h-2 rounded-full bg-white/30"></div>
      </div>
    </form>
  );
};

export default SearchBar;