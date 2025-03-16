import React from 'react';

const FoodEntryForm = ({ newEntry, handleChange, handleSubmit }) => {
  return (
    <div className="glass p-8 rounded-2xl mb-8">
      <h2 className="text-2xl font-semibold mb-6">Add Food Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="food" className="block text-white font-medium mb-2">
              Food Name
            </label>
            <input
              id="food"
              name="food"
              type="text"
              value={newEntry.food}
              onChange={handleChange}
              className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter food name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="calories" className="block text-white font-medium mb-2">
              Calories
            </label>
            <input
              id="calories"
              name="calories"
              type="number"
              value={newEntry.calories}
              onChange={handleChange}
              className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter calories"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="meal" className="block text-white font-medium mb-2">
              Meal Type
            </label>
            <select
              id="meal"
              name="meal"
              value={newEntry.meal}
              onChange={handleChange}
              className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="Breakfast" className="text-black">Breakfast</option>
              <option value="Lunch" className="text-black">Lunch</option>
              <option value="Dinner" className="text-black">Dinner</option>
              <option value="Snack" className="text-black">Snack</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="time" className="block text-white font-medium mb-2">
                Time
              </label>
              <div className="flex gap-4">
                <input
                  id="time"
                  name="time"
                  type="time"
                  value={newEntry.time}
                  onChange={handleChange}
                  className="w-full glass bg-white/5 border border-white/20 px-5 py-2 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <select
                  name="period"
                  value={newEntry.period}
                  onChange={handleChange}
                  className="glass bg-white/5 border-l-0 border border-white/20 px-4 py-2 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="am" className="text-black">am</option>
                  <option value="pm" className="text-black">pm</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary btn-3d px-8"
          >
            Add Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodEntryForm;
