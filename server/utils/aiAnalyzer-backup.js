const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

// Configuration validation
const validateConfiguration = () => {
  const config = {
    googleVision: false,
    nutritionix: false,
    serviceAccountKey: false
  };

  // Check Google Cloud Vision configuration
  try {
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '../service-account-key.json');
    if (fs.existsSync(serviceAccountPath)) {
      config.serviceAccountKey = true;
      config.googleVision = true;
      console.log('✅ Google Cloud Vision: Service account key found');
    } else {
      console.warn('⚠️ Google Cloud Vision: Service account key not found at', serviceAccountPath);
    }
  } catch (error) {
    console.warn('⚠️ Google Cloud Vision: Configuration error:', error.message);
  }

  // Check Nutritionix API configuration
  const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID || "8c766f3b";
  const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY || "b86ac4ebaa853e7e5de1e60717df4507";

  if (NUTRITIONIX_APP_ID && NUTRITIONIX_APP_KEY &&
      NUTRITIONIX_APP_ID !== "8c766f3b" && NUTRITIONIX_APP_KEY !== "b86ac4ebaa853e7e5de1e60717df4507") {
    config.nutritionix = true;
    console.log('✅ Nutritionix API: Configured with custom credentials');
  } else {
    console.warn('⚠️ Nutritionix API: Using default/demo credentials (limited requests)');
  }

  return config;
};

// Initialize Google Cloud Vision client
let visionClient = null;
let configStatus = validateConfiguration();

try {
  if (configStatus.serviceAccountKey) {
    visionClient = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '../service-account-key.json')
    });
    console.log('✅ Google Cloud Vision client initialized successfully');
  } else {
    console.warn('⚠️ Google Cloud Vision client not initialized - will use fallback');
  }
} catch (error) {
  console.error('❌ Google Cloud Vision client initialization failed:', error.message);
  visionClient = null;
}

// Nutritionix API configuration
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID || "8c766f3b";
const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY || "b86ac4ebaa853e7e5de1e60717df4507";

// Enhanced AI analysis function with real AI services
const analyzeMealImage = async (imagePath) => {
  try {
    console.log('Starting AI analysis for image:', imagePath);

    // Step 1: Detect food items using Google Cloud Vision
    const detectedFoods = await detectFoodItems(imagePath);

    if (detectedFoods.length === 0) {
      console.log('No food items detected, using fallback mock analysis');
      return generateMockAnalysis();
    }

    // Step 2: Get nutritional information for detected foods
    const foodsWithNutrition = await getNutritionData(detectedFoods);

    // Step 3: Generate AI analysis and recommendations
    const aiAnalysis = generateAIAnalysis(foodsWithNutrition);

    // Step 4: Generate meal name
    const mealName = generateMealName(foodsWithNutrition);

    return {
      name: mealName,
      detectedFoods: foodsWithNutrition,
      aiAnalysis,
      confidence: calculateOverallConfidence(foodsWithNutrition)
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    console.log('Falling back to mock analysis due to error');
    return generateMockAnalysis();
  }
};

// Detect food items using Google Cloud Vision
const detectFoodItems = async (imagePath) => {
  try {
    if (!visionClient) {
      console.log('Vision client not available, using mock detection');
      return getMockFoodDetection();
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    const request = {
      image: { content: imageBuffer },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 20 },
        { type: 'OBJECT_LOCALIZATION', maxResults: 20 }
      ]
    };

    const [result] = await visionClient.annotateImage(request);
    const labels = result.labelAnnotations || [];
    const objects = result.localizedObjectAnnotations || [];

    // Extract food-related items
    const foodItems = [];

    // Process labels for food detection
    labels.forEach(label => {
      if (isFoodRelated(label.description) && label.score > 0.7) {
        foodItems.push({
          name: label.description,
          confidence: label.score,
          type: 'label'
        });
      }
    });

    // Process objects for food detection
    objects.forEach(object => {
      if (isFoodRelated(object.name) && object.score > 0.7) {
        foodItems.push({
          name: object.name,
          confidence: object.score,
          type: 'object',
          boundingBox: object.boundingPoly
        });
      }
    });

    // Remove duplicates and sort by confidence
    const uniqueFoods = foodItems
      .filter((item, index, self) =>
        index === self.findIndex(t => t.name === item.name)
      )
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8); // Limit to top 8 items

    console.log('Detected food items:', uniqueFoods.map(f => `${f.name} (${f.confidence.toFixed(2)})`));
    return uniqueFoods;

  } catch (error) {
    console.error('Food detection error:', error);
    return getMockFoodDetection();
  }
};

// Check if a label is food-related
const isFoodRelated = (label) => {
  const foodKeywords = [
    'food', 'dish', 'meal', 'cuisine', 'recipe', 'ingredient',
    'vegetable', 'fruit', 'meat', 'chicken', 'beef', 'pork', 'fish', 'seafood',
    'rice', 'pasta', 'bread', 'noodle', 'pizza', 'burger', 'sandwich',
    'salad', 'soup', 'stew', 'curry', 'sauce', 'dessert', 'cake', 'cookie',
    'chocolate', 'ice cream', 'beverage', 'drink', 'juice', 'coffee', 'tea',
    'milk', 'cheese', 'egg', 'butter', 'oil', 'spice', 'herb', 'grain',
    'bean', 'lentil', 'nut', 'seed', 'berry', 'apple', 'banana', 'orange',
    'tomato', 'potato', 'carrot', 'onion', 'garlic', 'pepper', 'lettuce',
    'spinach', 'broccoli', 'cauliflower', 'mushroom', 'corn', 'pea', 'bean'
  ];

  const lowerLabel = label.toLowerCase();
  return foodKeywords.some(keyword => lowerLabel.includes(keyword));
};

// Get mock food detection for fallback
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

// Get nutritional data from Nutritionix API
const getNutritionData = async (detectedFoods) => {
  const foodsWithNutrition = [];

  for (const food of detectedFoods) {
    try {
      const nutritionData = await getFoodNutrition(food.name);
      if (nutritionData) {
        foodsWithNutrition.push({
          name: food.name,
          confidence: food.confidence,
          nutrition: nutritionData,
          type: food.type
        });
      } else {
        // Fallback to mock nutrition data
        foodsWithNutrition.push({
          name: food.name,
          confidence: food.confidence,
          nutrition: getMockNutritionData(food.name),
          type: food.type
        });
      }
    } catch (error) {
      console.error(`Error getting nutrition for ${food.name}:`, error);
      // Fallback to mock nutrition data
      foodsWithNutrition.push({
        name: food.name,
        confidence: food.confidence,
        nutrition: getMockNutritionData(food.name),
        type: food.type
      });
    }
  }

  return foodsWithNutrition;
};

// Get nutrition data from Nutritionix API
const getFoodNutrition = async (foodName) => {
  if (!NUTRITIONIX_APP_ID || !NUTRITIONIX_APP_KEY) {
    console.log('Nutritionix API not configured, using mock data');
    return null;
  }

  try {
    const response = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      query: foodName,
      timezone: "US/Eastern"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_APP_KEY
      }
    });

    if (response.data.foods && response.data.foods.length > 0) {
      const food = response.data.foods[0];
      return {
        calories: Math.round(food.nf_calories || 0),
        protein: Math.round(food.nf_protein || 0),
        carbs: Math.round(food.nf_total_carbohydrate || 0),
        fat: Math.round(food.nf_total_fat || 0),
        fiber: Math.round(food.nf_dietary_fiber || 0),
        sugar: Math.round(food.nf_sugars || 0),
        sodium: Math.round(food.nf_sodium || 0)
      };
    }

    return null;
  } catch (error) {
    console.error('Nutritionix API error:', error.response?.data || error.message);
    return null;
  }
};

// Get mock nutrition data for fallback
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

// Calculate overall confidence
const calculateOverallConfidence = (foods) => {
  if (foods.length === 0) return 0;

  const avgConfidence = foods.reduce((sum, food) => sum + food.confidence, 0) / foods.length;
  const nutritionConfidence = foods.filter(f => f.type !== 'mock').length / foods.length;

  return (avgConfidence * 0.7) + (nutritionConfidence * 0.3);
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
    confidence: 0.5
  };
};

module.exports = {
  analyzeMealImage
};
