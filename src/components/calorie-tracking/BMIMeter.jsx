import React from 'react';
import { Progress } from "@/components/ui/progress";

const BMIMeter = ({ weight, height }) => {
  // BMI calculation
  const calculateBMI = () => {
    if (!weight || !height || height === 0) return 0;
    
    // BMI = weight(kg) / (height(m))²
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const bmi = calculateBMI();
  const bmiRounded = bmi.toFixed(1);

  // Determine BMI category and color
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#33C3F0' };
    if (bmi < 25) return { category: 'Normal', color: '#8B5CF6' };
    if (bmi < 30) return { category: 'Overweight', color: '#F97316' };
    return { category: 'Obese', color: '#ea384c' };
  };

  const { category, color } = getBMICategory(bmi);

  // Calculate progress percentage (0-40 BMI range mapped to 0-100%)
  const getProgressPercentage = (bmi) => {
    // Capping at min 0% and max 100%
    if (bmi <= 0) return 0;
    if (bmi >= 40) return 100;
    return (bmi / 40) * 100;
  };

  // Position indicators
  const categories = [
    { name: 'Underweight', threshold: 18.5, color: '#33C3F0' },
    { name: 'Normal', threshold: 25, color: '#8B5CF6' },
    { name: 'Overweight', threshold: 30, color: '#F97316' },
    { name: 'Obese', threshold: 40, color: '#ea384c' }
  ];

  return (
    <div className="glass p-6 rounded-xl mb-8">
      <h3 className="text-xl font-semibold mb-4">BMI Meter</h3>
      
      {bmi > 0 ? (
        <>
          <div className="text-center mb-2">
            <span className="text-3xl font-bold" style={{ color }}>{bmiRounded}</span>
            <span className="text-lg ml-2">{category}</span>
          </div>
          
          <div className="relative mb-6">
            <Progress 
              value={getProgressPercentage(bmi)} 
              className="h-4"
              style={{ 
                background: 'linear-gradient(to right, #33C3F0, #8B5CF6, #F97316, #ea384c)',
              }}
            />
            
            {/* BMI Value Indicator */}
            <div 
              className="absolute top-0 w-3 h-7 bg-white rounded-full shadow-md transform -translate-x-1/2"
              style={{ 
                left: `${getProgressPercentage(bmi)}%`,
                marginTop: '-6px'
              }}
            />
            
            {/* Category Labels */}
            <div className="flex justify-between text-xs mt-1">
              {categories.map((cat, index) => (
                <div 
                  key={index} 
                  className="text-center"
                  style={{ 
                    position: 'absolute', 
                    left: `${getProgressPercentage(cat.threshold)}%`, 
                    transform: 'translateX(-50%)',
                    color: cat.color
                  }}
                >
                  {index < categories.length - 1 && (
                    <div className="h-2 w-0.5 bg-white/50 mx-auto mb-1"></div>
                  )}
                  <div>{cat.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center text-sm flex flex-col gap-3 pt-7">
            <p className="">BMI = weight(kg) / height(m)²</p>
            <p className="mt-1 text-white/70">
              BMI is a screening tool, not a diagnostic of body fatness or health.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p>Enter your height and weight in the TDEE calculator to see your BMI.</p>
        </div>
      )}
    </div>
  );
};

export default BMIMeter;