import React, { useEffect, useState } from 'react';
import TDEECalculator from '../components/TDEECalculator';
import StatsDisplay from '../components/calorie-tracking/StatsDisplay';
import FoodEntryForm from '../components/calorie-tracking/FoodEntryForm';
import FoodLogTable from '../components/calorie-tracking/FoodLogTable';
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import BMIMeter from '../components/calorie-tracking/BMIMETER';


const CalorieTracking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState(
    [
    // { id: 1, food: 'Oatmeal with berries', calories: 320, meal: 'Breakfast', time: '08:30' },
    // { id: 2, food: 'Grilled chicken salad', calories: 450, meal: 'Lunch', time: '12:45' },
    // { id: 3, food: 'Apple', calories: 95, meal: 'Snack', time: '15:30' },
  ]
);

  const [newEntry, setNewEntry] = useState({
    food: '',
    calories: '',
    meal: 'Breakfast',
    time: ''
  });

  const [userMetrics, setUserMetrics] = useState({
    weight: '',
    height: ''
  });

  const [calorieGoal, setCalorieGoal] = useState(0);
  const totalCalories = entries.reduce((total, entry) => total + entry.calories, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: name === 'calories' ? parseInt(value) || '' : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEntry.food || !newEntry.calories) return;
    
    const entry = {
      id: Date.now(),
      ...newEntry,
      time: newEntry.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setEntries(prev => [...prev, entry]);
    setNewEntry({
      food: '',
      calories: '',
      meal: 'Breakfast',
      time: ''
    });
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleCalorieGoalChange = (newGoal) => {
    setCalorieGoal(newGoal);
  };

  // Update user metrics for BMI calculation
  const handleUserMetricsChange = (metrics) => {
    setUserMetrics({
      weight: metrics.weight,
      height: metrics.height
    });
  };

  useEffect(() => {
        if (user === null) {
          navigate("/login"); // ✅ Redirect to login if no user is found
        }
      }, [user, navigate]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-transition max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-shadow text-center mb-8">
          Calorie Tracking
        </h1>
        
        <StatsDisplay totalCalories={totalCalories} calorieGoal={calorieGoal} />

        {/* BMI Meter Component */}
        <BMIMeter weight={userMetrics.weight} height={userMetrics.height} />
        
        {/* TDEE Calculator */}
        {/* <TDEECalculator onCalorieGoalChange={handleCalorieGoalChange} /> */}
        <TDEECalculator 
          onCalorieGoalChange={handleCalorieGoalChange}
          onUserMetricsChange={handleUserMetricsChange} 
        />

        <FoodEntryForm 
          newEntry={newEntry} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
        />
        
        <FoodLogTable entries={entries} deleteEntry={deleteEntry} />
      </div>
    </div>
  );
};

export default CalorieTracking;
