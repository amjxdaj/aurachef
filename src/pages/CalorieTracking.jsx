import React, { useEffect, useState } from 'react';
import TDEECalculator from '../components/TDEECalculator';
import StatsDisplay from '../components/calorie-tracking/StatsDisplay';
import FoodEntryForm from '../components/calorie-tracking/FoodEntryForm';
import FoodLogTable from '../components/calorie-tracking/FoodLogTable';
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import BMIMeter from '../components/calorie-tracking/BMIMETER';

const API_URL = "http://localhost:5001/api";

const CalorieTracking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    food: '',
    calories: '',
    meal: 'Breakfast',
    time: '',
    period: 'am'
  });

  const [userMetrics, setUserMetrics] = useState({ weight: '', height: '' });
  const [calorieGoal, setCalorieGoal] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const totalCalories = entries.reduce((total, entry) => total + entry.calories, 0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    fetchUserData();
    fetchEntries();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setCalorieGoal(userData.dailyGoal || 0);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    }
  };

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/calories/food-log`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEntries(data.logs || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch food logs');
      }
    } catch (error) {
      console.error("❌ Error fetching logs:", error);
      setError('Failed to load food logs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: name === 'calories' ? parseInt(value) || '' : value }));
    setError('');
  };

  const formatTimeWithPeriod = (time, period) => {
    if (!time) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const ampm = hours >= 12 ? 'pm' : 'am';
      return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    const [hours, minutes] = time.split(':');
    let formattedHours = parseInt(hours);
    if (formattedHours > 12) {
      formattedHours = formattedHours - 12;
    } else if (formattedHours === 0) {
      formattedHours = 12;
    }
    return `${formattedHours.toString().padStart(2, '0')}:${minutes} ${period}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntry.food || !newEntry.calories) return;

    const formattedTime = formatTimeWithPeriod(newEntry.time, newEntry.period);

    const entryData = {
      food: newEntry.food,
      calories: parseInt(newEntry.calories),
      meal: newEntry.meal,
      time: formattedTime
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/calories/food-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(entryData),
      });

      const data = await response.json();
      if (response.ok) {
        setEntries(prev => [...prev, { ...data.entry, time: formattedTime }]);
        setNewEntry({ food: '', calories: '', meal: 'Breakfast', time: '', period: 'am' });
        setError('');
      } else {
        setError(data.message || 'Failed to add food entry');
      }
    } catch (error) {
      console.error("❌ Error submitting:", error);
      setError('Failed to add food entry');
    }
  };

  const deleteEntry = async (id) => {
    if (!id) {
      console.error("No entry ID provided");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/calories/food-log/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setEntries(prev => prev.filter(entry => entry._id !== id));
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete entry');
      }
    } catch (error) {
      console.error("❌ Error deleting entry:", error);
      setError('Failed to delete entry');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all food logs and calorie goals? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // First reset the daily goal
      const goalResponse = await fetch(`${API_URL}/calories/calorie-goal`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dailyGoal: 2000 }),
      });

      if (!goalResponse.ok) {
        throw new Error('Failed to reset calorie goal');
      }

      // Then delete all food logs
      const logsResponse = await fetch(`${API_URL}/calories/food-log/reset`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!logsResponse.ok) {
        throw new Error('Failed to reset food logs');
      }

      setEntries([]);
      setCalorieGoal(2000);
      setError('');
    } catch (error) {
      console.error("❌ Error resetting data:", error);
      setError('Failed to reset data: ' + error.message);
    }
  };

  const handleCalorieGoalChange = async (newGoal) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/calories/calorie-goal`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dailyGoal: newGoal }),
      });

      if (response.ok) {
        setCalorieGoal(newGoal);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update calorie goal');
      }
    } catch (error) {
      console.error("❌ Error updating calorie goal:", error);
      setError('Failed to update calorie goal');
    }
  };

  const handleUserMetricsChange = (metrics) => {
    setUserMetrics({
      weight: metrics.weight,
      height: metrics.height
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-transition max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-shadow text-center mb-8">
          Calorie Tracking
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <StatsDisplay 
          totalCalories={totalCalories} 
          calorieGoal={calorieGoal} 
        />
        <BMIMeter 
          weight={userMetrics.weight} 
          height={userMetrics.height} 
        />
        <TDEECalculator 
          onCalorieGoalChange={handleCalorieGoalChange}
          onUserMetricsChange={handleUserMetricsChange} 
        />
        <FoodEntryForm 
          newEntry={newEntry} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
        />
        <FoodLogTable 
          entries={entries} 
          deleteEntry={deleteEntry}
        />
        
        <div className="flex justify-center mt-8">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracking;
