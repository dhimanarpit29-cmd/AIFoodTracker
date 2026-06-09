const path = require('path');
const fs = require('fs');

// Simplified AI analysis function without external API dependencies
const analyzeMealImage = async (imagePath) => {
  try {
    console.log('Starting simplified AI analysis for image:', imagePath);

    // Generate mock analysis since external APIs are not configured
    const mockAnalysis = generateMockAnalysis();

    return {
      name: mockAnalysis.name,
      detectedFoods: mockAnalysis.detectedFoods,
      aiAnalysis: mockAnalysis.aiAnalysis,
      confidence: 0.85
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    console.log('Using fallback mock analysis due to error');
    return generateMockAnalysis();
  }
};

// Generate mock food detection
const getMockFoodDetection = () => {
  const mockFoods = [
    { name: 'Grilled Chicken', confidence: 0.92, type: 'mock' },
    { name: 'Brown Rice', confidence: 0.88, type: 'mock' },
    { name: 'Broccoli', confidence: 0.95, type: 'mock' },
    { name: 'Salmon', confidence: 0.89, type: 'mock' },
    { name: 'Sweet Potato', confidence: 0.91, type: 'mock' },
    { name: 'Quinoa', confidence: 0.87, type: 'mock' },
    { name: 'Spinach', confidence: 0.93, type: 'mock' },
    { name: 'Greek Yogurt', confidence: 0.90, type: 'mock' }
  ];

  return mockFoods.slice(0, Math.floor(Math.random() * 4) + 2);
};

// Get mock nutrition data
const getMockNutritionData = (foodName) => {
  const mockNutritionDatabase = {
    'Grilled Chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
    'Brown Rice': { calories: 216, protein: 5, carbs: 44, fat: 1.8, fiber: 3.5, sugar: 0.7, sodium: 10 },
    'Broccoli': { calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, fiber: 5.2, sugar: 2.2, sodium: 64 },
    'Salmon': { calories: 208, protein: 25, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 59 },
    'Sweet Potato': { calories: 162, protein: 2, carbs: 37, fat: 0.2, fiber: 4, sugar: 5.7, sodium: 11 },
    'Quinoa': { calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5, sugar: 1.6, sodium: 13 },
    'Spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79 },
    'Greek Yogurt': { calories: 100, protein: 17, carbs: 6, fat: 0.4, fiber: 0, sugar: 4.7, sodium: 36 },
    'Banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14.4, sodium: 1 },
    'Avocado': { calories: 234, protein: 2.9, carbs: 12.8, fat: 21.4, fiber: 10, sugar: 1, sodium: 10 },
    'Eggs': { calories: 155, protein: 12.6, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124 },
    'Whole Wheat Bread': { calories: 247, protein: 13, carbs: 41, fat: 4.2, fiber: 6, sugar: 4.3, sodium: 454 }
  };

  // Try exact match first
  if (mockNutritionDatabase[foodName]) {
    return mockNutritionDatabase[foodName];
  }

  // Try partial match
  for (const [key, value] of Object.entries(mockNutritionDatabase)) {
    if (foodName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(foodName.toLowerCase())) {
      return value;
    }
  }

  // Default fallback
  return { calories: 150, protein: 10, carbs: 20, fat: 5, fiber: 2, sugar: 5, sodium: 50 };
};

// Generate meal name based on detected foods
const generateMealName = (foods) => {
  if (foods.length === 0) return 'Unknown Meal';

  const mainIngredients = foods.slice(0, 3).map(food => {
    const name = food.name.toLowerCase();
    if (name.includes('chicken') || name.includes('salmon') || name.includes('eggs') || name.includes('beef') || name.includes('pork') || name.includes('fish')) {
      return 'Protein Meal';
    } else if (name.includes('rice') || name.includes('quinoa') || name.includes('bread') || name.includes('pasta') || name.includes('noodle')) {
      return 'Carb-focused Meal';
    } else if (name.includes('broccoli') || name.includes('spinach') || name.includes('avocado') || name.includes('salad') || name.includes('vegetable')) {
      return 'Vegetable Meal';
    }
    return 'Mixed Meal';
  });

  const uniqueTypes = [...new Set(mainIngredients)];
  if (uniqueTypes.length === 1) {
    return uniqueTypes[0];
  } else {
    return 'Balanced Meal';
  }
};

// Generate AI analysis and recommendations
const generateAIAnalysis = (foods) => {
  const totalNutrition = foods.reduce((total, food) => {
    return {
      calories: total.calories + food.nutrition.calories,
      protein: total.protein + food.nutrition.protein,
      carbs: total.carbs + food.nutrition.carbs,
      fat: total.fat + food.nutrition.fat,
      fiber: total.fiber + food.nutrition.fiber,
      sugar: total.sugar + (food.nutrition.sugar || 0),
      sodium: total.sodium + (food.nutrition.sodium || 0)
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });

  // Calculate nutritional balance
  const proteinPercentage = totalNutrition.calories > 0 ? (totalNutrition.protein * 4 / totalNutrition.calories) * 100 : 0;
  const carbPercentage = totalNutrition.calories > 0 ? (totalNutrition.carbs * 4 / totalNutrition.calories) * 100 : 0;
  const fatPercentage = totalNutrition.calories > 0 ? (totalNutrition.fat * 9 / totalNutrition.calories) * 100 : 0;

  let nutritionalBalance = 'fair';
  let recommendations = [];

  // Assess balance
  if (proteinPercentage >= 20 && proteinPercentage <= 30 &&
      carbPercentage >= 40 && carbPercentage <= 65 &&
      fatPercentage >= 20 && fatPercentage <= 35) {
    nutritionalBalance = 'good';
  } else if (proteinPercentage >= 15 && proteinPercentage <= 35 &&
             carbPercentage >= 30 && carbPercentage <= 70 &&
             fatPercentage >= 15 && fatPercentage <= 40) {
    nutritionalBalance = 'fair';
  } else {
    nutritionalBalance = 'poor';
  }

  // Generate recommendations
  if (proteinPercentage < 15) {
    recommendations.push('Consider adding more protein-rich foods like chicken, fish, eggs, or legumes');
  }
  if (carbPercentage > 70) {
    recommendations.push('High carbohydrate content detected. Consider balancing with more vegetables and protein');
  }
  if (fatPercentage > 40) {
    recommendations.push('High fat content detected. Consider healthier fat sources like avocados or nuts');
  }
  if (totalNutrition.fiber < 5) {
    recommendations.push('Low fiber content. Consider adding more vegetables, fruits, or whole grains');
  }
  if (totalNutrition.sugar > 30) {
    recommendations.push('High sugar content detected. Consider reducing sugary foods and drinks');
  }
  if (totalNutrition.sodium > 2000) {
    recommendations.push('High sodium content detected. Consider reducing salt and processed foods');
  }

  // General recommendations
  if (recommendations.length === 0) {
    recommendations.push('Great meal composition! Keep up the balanced nutrition');
    recommendations.push('Consider portion control to maintain calorie goals');
  }

  // Overall assessment
  let overallAssessment = '';
  if (nutritionalBalance === 'good') {
    overallAssessment = 'This meal has a good nutritional balance with appropriate macro distribution.';
  } else if (nutritionalBalance === 'fair') {
    overallAssessment = 'This meal has a fair nutritional balance. Some adjustments could improve it.';
  } else {
    overallAssessment = 'This meal could benefit from better nutritional balance.';
  }

  return {
    overallAssessment,
    recommendations,
    nutritionalBalance,
    macroDistribution: {
      protein: Math.round(proteinPercentage),
      carbs: Math.round(carbPercentage),
      fat: Math.round(fatPercentage)
    },
    totalNutrition,
    healthScore: calculateHealthScore(totalNutrition, nutritionalBalance)
  };
};

// Calculate health score based on nutrition and balance
const calculateHealthScore = (nutrition, balance) => {
  let score = 50; // Base score

  // Add points for good nutrition
  if (nutrition.protein >= 20 && nutrition.protein <= 40) score += 10;
  if (nutrition.carbs >= 30 && nutrition.carbs <= 60) score += 10;
  if (nutrition.fat >= 15 && nutrition.fat <= 35) score += 10;
  if (nutrition.fiber >= 8) score += 10;
  if (nutrition.sugar <= 20) score += 5;
  if (nutrition.sodium <= 1500) score += 5;

  // Adjust based on balance
  if (balance === 'good') score += 10;
  else if (balance === 'fair') score += 5;

  return Math.min(Math.max(score, 0), 100);
};

// Fallback mock analysis function
const generateMockAnalysis = () => {
  const mockFoods = getMockFoodDetection();
  const foodsWithNutrition = mockFoods.map(food => ({
    ...food,
    nutrition: getMockNutritionData(food.name)
  }));

  return {
    name: generateMealName(foodsWithNutrition),
    detectedFoods: foodsWithNutrition,
    aiAnalysis: generateAIAnalysis(foodsWithNutrition),
    confidence: 0.85
  };
};

module.exports = {
  analyzeMealImage
};
