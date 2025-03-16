// src/components/calorie-tracking/FoodLogTable.jsx
import React from 'react';
import { Trash2, UtensilsCrossed } from 'lucide-react';

const FoodLogTable = ({ entries, deleteEntry, onReset }) => {
  return (
    <div className="glass p-8 rounded-2xl mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Today's Food Log</h2>
      
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <UtensilsCrossed className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-400">No food entries yet. Add your first meal above!</p>
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="py-2">Food</th>
                <th className="py-2">Meal</th>
                <th className="py-2">Time</th>
                <th className="py-2">Calories</th>
                <th className="py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id} className="border-t border-white/10 text-white">
                  <td className="py-3">{entry.food}</td>
                  <td className="py-3">{entry.meal}</td>
                  <td className="py-3">{entry.time}</td>
                  <td className="py-3">{entry.calories}</td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => deleteEntry(entry._id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-full"
                      title="Delete entry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </>
      )}
    </div>
  );
};

export default FoodLogTable;
