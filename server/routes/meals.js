const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const Meal = require('../models/Meal');
const { authenticateToken } = require('../middleware/auth');
const { analyzeMealImage } = require('../utils/aiAnalyzer');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'meal-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @route   POST /api/meals/upload
// @desc    Upload and analyze meal image
// @access  Private
router.post('/upload', authenticateToken, upload.single('image'), [
  body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snack']),
  body('name').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { mealType, name, tags, notes, date } = req.body;

    // Analyze the image using AI (enhanced implementation)
    const analysis = await analyzeMealImage(req.file.path);

    // Create new meal record
    const mealData = {
      user_id: req.user.id,
      name: name || analysis.name || 'Meal Analysis',
      image_url: `/uploads/${req.file.filename}`,
      image_path: req.file.path,
      meal_type: mealType,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      notes: notes || '',
      detected_foods: analysis.detectedFoods || [],
      ai_analysis: analysis.aiAnalysis || {},
      confidence: analysis.confidence,
      date: date
    };

    const meal = Meal.create(mealData);

    res.status(201).json({
      message: 'Meal analyzed successfully',
      meal: {
        id: meal.id,
        name: meal.name,
        image_url: meal.image_url,
        detected_foods: meal.detected_foods,
        totalNutrition: meal.aiAnalysis?.totalNutrition || {},
        meal_type: meal.meal_type,
        date: meal.date,
        aiAnalysis: meal.aiAnalysis
      }
    });
  } catch (error) {
    console.error('Meal upload error:', error);

    // Provide more specific error messages based on error type
    let errorMessage = 'Server error during meal analysis';
    let statusCode = 500;

    if (error.message.includes('ENOENT')) {
      errorMessage = 'File system error: Unable to process uploaded file';
      statusCode = 500;
    } else if (error.message.includes('EACCES')) {
      errorMessage = 'Permission error: Unable to access file system';
      statusCode = 500;
    } else if (error.message.includes('API_ERROR') || error.message.includes('timeout')) {
      errorMessage = 'AI service temporarily unavailable, using fallback analysis';
      statusCode = 503;
    } else if (error.name === 'ValidationError') {
      errorMessage = 'Invalid meal data provided';
      statusCode = 400;
    }

    res.status(statusCode).json({
      error: errorMessage,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// @route   GET /api/meals
// @desc    Get user's meals with optional filtering
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      mealType,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { user_id: req.user.id };

    if (mealType) {
      filter.meal_type = mealType;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const meals = Meal.findByUserId(req.user.id);

    const total = meals.length;

    res.json({
      meals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalMeals: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ error: 'Server error fetching meals' });
  }
});

// @route   GET /api/meals/:id
// @desc    Get single meal by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const meal = Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json({ meal });
  } catch (error) {
    console.error('Get meal error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid meal ID' });
    }
    res.status(500).json({ error: 'Server error fetching meal' });
  }
});

// @route   PUT /api/meals/:id
// @desc    Update meal information
// @access  Private
router.put('/:id', authenticateToken, [
  body('name').optional().trim(),
  body('mealType').optional().isIn(['breakfast', 'lunch', 'dinner', 'snack']),
  body('tags').optional(),
  body('notes').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const meal = Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Update fields
    const { name, mealType, tags, notes } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (mealType) updateData.meal_type = mealType;
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());
    if (notes !== undefined) updateData.notes = notes;

    Meal.update(req.params.id, updateData);

    res.json({
      message: 'Meal updated successfully',
      meal: {
        id: meal.id,
        name: meal.name,
        meal_type: meal.meal_type,
        tags: meal.tags,
        notes: meal.notes
      }
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ error: 'Server error updating meal' });
  }
});

// @route   DELETE /api/meals/:id
// @desc    Delete a meal
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const meal = Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    Meal.delete(req.params.id);

    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ error: 'Server error deleting meal' });
  }
});

// @route   GET /api/meals/analytics/daily
// @desc    Get daily nutrition analytics
// @access  Private
router.get('/analytics/daily', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    const analytics = Meal.getAnalytics(req.user.id, targetDate);

    res.json(analytics);
  } catch (error) {
    console.error('Daily analytics error:', error);
    res.status(500).json({ error: 'Server error fetching daily analytics' });
  }
});

// @route   GET /api/meals/analysis/:id
// @desc    Get detailed analysis for a specific meal
// @access  Private
router.get('/analysis/:id', authenticateToken, async (req, res) => {
  try {
    const meal = Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Get additional insights based on meal history
    const userMeals = Meal.findByUserId(req.user.id);

    const insights = generateMealInsights(meal, userMeals);

    res.json({
      meal,
      insights
    });
  } catch (error) {
    console.error('Get meal analysis error:', error);
    res.status(500).json({ error: 'Server error fetching meal analysis' });
  }
});

// @route   GET /api/meals/recommendations
// @desc    Get personalized meal recommendations
// @access  Private
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    // Get user's recent meals for analysis
    const recentMeals = Meal.findByUserId(req.user.id);

    const recommendations = generateRecommendations(recentMeals);

    res.json({
      recommendations: recommendations.slice(0, parseInt(limit)),
      basedOn: `${recentMeals.length} recent meals`
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Server error fetching recommendations' });
  }
});

// @route   POST /api/meals/analyze-image
// @desc    Analyze meal image without saving to database
// @access  Private
router.post('/analyze-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Analyze the image using AI
    const analysis = await analyzeMealImage(req.file.path);

    res.json({
      message: 'Image analyzed successfully',
      analysis: {
        name: analysis.name,
        detectedFoods: analysis.detectedFoods,
        totalNutrition: analysis.aiAnalysis.totalNutrition,
        aiAnalysis: analysis.aiAnalysis,
        confidence: analysis.confidence
      }
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: 'Server error during image analysis' });
  }
});

// @route   GET /api/meals/health-insights
// @desc    Get health insights from meal history
// @access  Private
router.get('/health-insights', authenticateToken, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

    const meals = Meal.findByUserId(req.user.id);

    const insights = generateHealthInsights(meals, parseInt(days));

    res.json({
      period: `${days} days`,
      insights,
      totalMeals: meals.length
    });
  } catch (error) {
    console.error('Health insights error:', error);
    res.status(500).json({ error: 'Server error fetching health insights' });
  }
});

// Helper function to generate meal insights
const generateMealInsights = (currentMeal, userMeals) => {
  const insights = {
    nutritionalComparison: {},
    mealPattern: {},
    suggestions: []
  };

  // Compare with average nutrition from recent meals
  if (userMeals.length > 1) {
    const avgNutrition = userMeals.reduce((acc, meal) => {
      const nutrition = meal.aiAnalysis?.totalNutrition || {};
      if (nutrition) {
        acc.calories += nutrition.calories || 0;
        acc.protein += nutrition.protein || 0;
        acc.carbs += nutrition.carbs || 0;
        acc.fat += nutrition.fat || 0;
      }
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const mealCount = userMeals.length;
    insights.nutritionalComparison = {
      current: currentMeal.aiAnalysis?.totalNutrition || {},
      average: {
        calories: Math.round(avgNutrition.calories / mealCount),
        protein: Math.round(avgNutrition.protein / mealCount),
        carbs: Math.round(avgNutrition.carbs / mealCount),
        fat: Math.round(avgNutrition.fat / mealCount)
      }
    };
  }

  // Analyze meal patterns
  const mealTypes = userMeals.reduce((acc, meal) => {
    acc[meal.meal_type] = (acc[meal.meal_type] || 0) + 1;
    return acc;
  }, {});

  insights.mealPattern = mealTypes;

  // Generate suggestions
  if (currentMeal.aiAnalysis) {
    if (currentMeal.aiAnalysis.healthScore < 60) {
      insights.suggestions.push('Consider adding more vegetables and lean proteins to improve nutritional balance');
    }
    if (currentMeal.aiAnalysis.totalNutrition.calories > 800) {
      insights.suggestions.push('This meal is quite high in calories. Consider portion control for weight management');
    }
    if (currentMeal.aiAnalysis.totalNutrition.protein < 20) {
      insights.suggestions.push('Consider adding protein-rich foods for better satiety and muscle maintenance');
    }
  }

  return insights;
};

// Helper function to generate recommendations
const generateRecommendations = (recentMeals) => {
  const recommendations = [
    {
      type: 'balanced_meal',
      title: 'Try a Balanced Meal',
      description: 'Based on your recent meals, consider a meal with equal portions of protein, carbs, and vegetables',
      confidence: 0.85
    },
    {
      type: 'vegetarian_option',
      title: 'Vegetarian Alternative',
      description: 'Replace meat with plant-based proteins like lentils, tofu, or beans',
      confidence: 0.75
    },
    {
      type: 'low_carb',
      title: 'Low-Carb Option',
      description: 'Focus on proteins and vegetables while reducing grains and starches',
      confidence: 0.70
    },
    {
      type: 'high_protein',
      title: 'High-Protein Meal',
      description: 'Increase protein intake with chicken, fish, eggs, or Greek yogurt',
      confidence: 0.80
    },
    {
      type: 'fiber_rich',
      title: 'Fiber-Rich Meal',
      description: 'Include more vegetables, fruits, and whole grains for better digestion',
      confidence: 0.78
    }
  ];

  // Sort by confidence and return top recommendations
  return recommendations.sort((a, b) => b.confidence - a.confidence);
};

// Helper function to generate health insights
const generateHealthInsights = (meals, days) => {
  const insights = {
    dailyAverages: {},
    trends: {},
    achievements: [],
    concerns: []
  };

  if (meals.length === 0) {
    return insights;
  }

  // Calculate daily averages
  const dailyTotals = {};
  meals.forEach(meal => {
    const dateKey = meal.date.split('T')[0];
    if (!dailyTotals[dateKey]) {
      dailyTotals[dateKey] = { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 };
    }
    const nutrition = meal.aiAnalysis?.totalNutrition || {};
    dailyTotals[dateKey].calories += nutrition.calories || 0;
    dailyTotals[dateKey].protein += nutrition.protein || 0;
    dailyTotals[dateKey].carbs += nutrition.carbs || 0;
    dailyTotals[dateKey].fat += nutrition.fat || 0;
    dailyTotals[dateKey].count += 1;
  });

  const dayCount = Object.keys(dailyTotals).length;
  insights.dailyAverages = {
    calories: Math.round(Object.values(dailyTotals).reduce((sum, day) => sum + day.calories, 0) / dayCount),
    protein: Math.round(Object.values(dailyTotals).reduce((sum, day) => sum + day.protein, 0) / dayCount),
    carbs: Math.round(Object.values(dailyTotals).reduce((sum, day) => sum + day.carbs, 0) / dayCount),
    fat: Math.round(Object.values(dailyTotals).reduce((sum, day) => sum + day.fat, 0) / dayCount),
    mealsPerDay: Math.round(Object.values(dailyTotals).reduce((sum, day) => sum + day.count, 0) / dayCount)
  };

  // Analyze trends
  const totalCalories = Object.values(dailyTotals).reduce((sum, day) => sum + day.calories, 0);
  const avgCalories = totalCalories / dayCount;

  if (avgCalories < 1800) {
    insights.concerns.push('Average daily calories seem low. Consider consulting with a nutritionist.');
  } else if (avgCalories > 2500) {
    insights.concerns.push('Average daily calories seem high. Consider portion control.');
  }

  // Check protein intake
  const avgProtein = insights.dailyAverages.protein;
  if (avgProtein < 50) {
    insights.concerns.push('Protein intake appears low. Consider adding more protein-rich foods.');
  } else if (avgProtein > 100) {
    insights.achievements.push('Good protein intake! You\'re meeting your daily protein goals.');
  }

  // Check meal frequency
  if (insights.dailyAverages.mealsPerDay >= 3) {
    insights.achievements.push('Great meal frequency! Regular meals help maintain energy levels.');
  } else {
    insights.suggestions = insights.suggestions || [];
    insights.suggestions.push('Consider eating more regularly throughout the day for better energy management.');
  }

  return insights;
};

module.exports = router;
