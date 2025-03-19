
import React, { useState, useEffect } from 'react';

const TDEECalculator = ({ onCalorieGoalChange, onUserMetricsChange }) => {
  
  const [userDetails, setUserDetails] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintenance'
  });
  
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(0);
  const [calculationDone, setCalculationDone] = useState(false);

  const activityFactors = {
    sedentary: 1.2,
    lightlyActive: 1.375,
    moderatelyActive: 1.55,
    veryActive: 1.725,
    superActive: 1.9
  };

  const goalAdjustments = {
    loss: -500,
    maintenance: 0,
    gain: 300
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (userDetails.weight && userDetails.height) {
      onUserMetricsChange?.({
        weight: parseFloat(userDetails.weight),
        height: parseFloat(userDetails.height)
      });
    }
  }, [userDetails.weight, userDetails.height]);

  const calculateBMR = () => {
    const { age, weight, height, gender } = userDetails;
    
    if (gender === 'male') {
      // Men: BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      // Women: BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age in years)
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  };

  const calculateTDEE = (bmr) => {
    return bmr * activityFactors[userDetails.activityLevel];
  };

  const calculateCalorieGoal = (tdee) => {
    return Math.round(tdee + goalAdjustments[userDetails.goal]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate BMR
    const calculatedBMR = calculateBMR();
    setBmr(Math.round(calculatedBMR));
    
    // Calculate TDEE
    const calculatedTDEE = calculateTDEE(calculatedBMR);
    setTdee(Math.round(calculatedTDEE));
    
    // Calculate Calorie Goal
    const calculatedCalorieGoal = calculateCalorieGoal(calculatedTDEE);
    setCalorieGoal(calculatedCalorieGoal);
    
    setCalculationDone(true);
    
    // Notify parent component
    if (onCalorieGoalChange) {
      onCalorieGoalChange(calculatedCalorieGoal);
    }

    if (onUserMetricsChange) {
      onUserMetricsChange({
        weight: parseFloat(userDetails.weight),
        height: parseFloat(userDetails.height)
      });
    }
  };

  return (
    <div className="glass p-8 rounded-2xl mb-8">
      <h2 className="text-2xl font-semibold mb-6">Calculate Your Daily Calorie Needs</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age" className="block text-white font-medium mb-2">
              Age (years)
            </label>
            <input
              id="age"
              name="age"
              type="number"
              value={userDetails.age}
              onChange={handleChange}
              className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter your age"
              min="18"
              max="100"
              required
            />
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-white font-medium mb-2">
              Weight (kg)
            </label>
            <input
              id="weight"
              name="weight"
              type="number"
              value={userDetails.weight}
              onChange={handleChange}
              className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter your weight"
              min="30"
              max="300"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="height" className="block text-white font-medium mb-2">
              Height (cm)
            </label>
            <input
              id="height"
              name="height"
              type="number"
              value={userDetails.height}
              onChange={handleChange}
              className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter your height"
              min="100"
              max="250"
              required
            />
          </div>
          
          <div >
            <label htmlFor="gender" className="block text-white font-medium mb-2">
              Gender
            </label>
            <select  
              id="gender"
              name="gender"
              value={userDetails.gender}
              onChange={handleChange}
              className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            >
              <option value="male" className="text-black">Male</option>
              <option value="female" className="text-black">Female</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="activityLevel" className="block text-white font-medium mb-2">
              Activity Level
            </label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={userDetails.activityLevel}
              onChange={handleChange}
              className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            >
              <option value="sedentary" className="text-black">Sedentary (little to no exercise)</option>
              <option value="lightlyActive" className="text-black">Lightly Active (1-3 days/week)</option>
              <option value="moderatelyActive" className="text-black">Moderately Active (3-5 days/week)</option>
              <option value="veryActive" className="text-black">Very Active (6-7 days/week)</option>
              <option value="superActive" className="text-black">Super Active (athlete, hard exercise)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="goal" className="block text-white font-medium mb-2">
              Goal
            </label>
            <select
              id="goal"
              name="goal"
              value={userDetails.goal}
              onChange={handleChange}
              className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            >
              <option value="loss" className="text-black">Weight Loss</option>
              <option value="maintenance" className="text-black">Weight Maintenance</option>
              <option value="gain" className="text-black">Weight Gain</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary btn-3d px-8"
          >
            Calculate
          </button>
        </div>
      </form>
      
      {calculationDone && (
        <div className="mt-8 p-6 bg-white/10 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Your Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 glass rounded-lg">
              <p className="font-medium mb-1">Basal Metabolic Rate</p>
              <p className="text-2xl font-bold">{bmr} kcal</p>
            </div>
            <div className="p-4 glass rounded-lg">
              <p className="font-medium mb-1">Total Daily Energy</p>
              <p className="text-2xl font-bold">{tdee} kcal</p>
            </div>
            <div className="p-4 glass rounded-lg">
              <p className="font-medium mb-1">Recommended Daily</p>
              <p className="text-2xl font-bold">{calorieGoal} kcal</p>
            </div>
          </div>
          <p className="mt-4 text-center text-white/80">
            {userDetails.goal === 'loss' 
              ? 'For weight loss, aim to consume fewer calories than your TDEE.' 
              : userDetails.goal === 'gain'
                ? 'For weight gain, aim to consume more calories than your TDEE.'
                : 'For weight maintenance, aim to consume calories close to your TDEE.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TDEECalculator;
