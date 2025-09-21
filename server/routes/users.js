const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Meal = require('../models/Meal');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Get today's meals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMeals = Meal.findByUserIdAndDateRange(user.id, today, tomorrow);

    // Calculate today's nutrition totals
    const todayTotals = todayMeals.reduce((totals, meal) => {
      const nutrition = meal.aiAnalysis?.totalNutrition || {};
      totals.calories += nutrition.calories || 0;
      totals.protein += nutrition.protein || 0;
      totals.carbs += nutrition.carbs || 0;
      totals.fat += nutrition.fat || 0;
      totals.fiber += nutrition.fiber || 0;
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    // Get weekly data (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyMeals = Meal.findByUserIdAndDateRange(user.id, weekAgo, new Date());

    // Calculate daily averages for the week
    const dailyAverages = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    if (weeklyMeals.length > 0) {
      const weeklyTotals = weeklyMeals.reduce((totals, meal) => {
        const nutrition = meal.aiAnalysis?.totalNutrition || {};
        totals.calories += nutrition.calories || 0;
        totals.protein += nutrition.protein || 0;
        totals.carbs += nutrition.carbs || 0;
        totals.fat += nutrition.fat || 0;
        totals.fiber += nutrition.fiber || 0;
        return totals;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

      dailyAverages.calories = Math.round(weeklyTotals.calories / 7);
      dailyAverages.protein = Math.round(weeklyTotals.protein / 7);
      dailyAverages.carbs = Math.round(weeklyTotals.carbs / 7);
      dailyAverages.fat = Math.round(weeklyTotals.fat / 7);
      dailyAverages.fiber = Math.round(weeklyTotals.fiber / 7);
    }

    // Calculate BMI and daily calorie needs
    const bmi = user.calculateBMI();
    const bmr = user.calculateBMR();
    const dailyCalories = user.calculateDailyCalories();

    // Determine calorie goal progress
    let calorieProgress = 'unknown';
    if (dailyCalories) {
      const progressPercentage = (todayTotals.calories / dailyCalories) * 100;
      if (progressPercentage < 80) calorieProgress = 'under';
      else if (progressPercentage <= 120) calorieProgress = 'on_track';
      else calorieProgress = 'over';
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        bmi,
        bmr,
        dailyCalories
      },
      today: {
        meals: todayMeals.length,
        nutrition: todayTotals,
        calorieProgress
      },
      weekly: {
        totalMeals: weeklyMeals.length,
        dailyAverages
      },
      recentMeals: todayMeals.slice(0, 5).map(meal => ({
        id: meal.id,
        name: meal.name,
        mealType: meal.meal_type,
        calories: meal.aiAnalysis?.totalNutrition?.calories || 0,
        time: meal.date
      }))
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

// @route   GET /api/users/analytics/weekly
// @desc    Get weekly nutrition analytics
// @access  Private
router.get('/analytics/weekly', authenticateToken, async (req, res) => {
  try {
    const { weeks = 1 } = req.query;
    const weeksBack = parseInt(weeks);

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeksBack * 7));

    const meals = Meal.findByUserIdAndDateRange(req.user.id, startDate, endDate);

    // Group meals by day
    const dailyData = {};
    meals.forEach(meal => {
      const dateKey = meal.date.split('T')[0];
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          meals: [],
          totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
        };
      }
      dailyData[dateKey].meals.push(meal);
      const nutrition = meal.aiAnalysis?.totalNutrition || {};
      dailyData[dateKey].totals.calories += nutrition.calories || 0;
      dailyData[dateKey].totals.protein += nutrition.protein || 0;
      dailyData[dateKey].totals.carbs += nutrition.carbs || 0;
      dailyData[dateKey].totals.fat += nutrition.fat || 0;
      dailyData[dateKey].totals.fiber += nutrition.fiber || 0;
    });

    // Calculate weekly averages
    const totalDays = Object.keys(dailyData).length;
    const weeklyTotals = Object.values(dailyData).reduce((totals, day) => {
      totals.calories += day.totals.calories;
      totals.protein += day.totals.protein;
      totals.carbs += day.totals.carbs;
      totals.fat += day.totals.fat;
      totals.fiber += day.totals.fiber;
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const weeklyAverages = {
      calories: totalDays > 0 ? Math.round(weeklyTotals.calories / totalDays) : 0,
      protein: totalDays > 0 ? Math.round(weeklyTotals.protein / totalDays) : 0,
      carbs: totalDays > 0 ? Math.round(weeklyTotals.carbs / totalDays) : 0,
      fat: totalDays > 0 ? Math.round(weeklyTotals.fat / totalDays) : 0,
      fiber: totalDays > 0 ? Math.round(weeklyTotals.fiber / totalDays) : 0
    };

    res.json({
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        totalDays
      },
      dailyData: Object.values(dailyData),
      weeklyAverages,
      weeklyTotals
    });
  } catch (error) {
    console.error('Weekly analytics error:', error);
    res.status(500).json({ error: 'Server error fetching weekly analytics' });
  }
});

// @route   GET /api/users/goals/progress
// @desc    Get user's progress towards goals
// @access  Private
router.get('/goals/progress', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { period = 'weekly' } = req.query;

    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();

    if (period === 'monthly') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate.setDate(startDate.getDate() - 7); // Default to weekly
    }

    const meals = Meal.findByUserIdAndDateRange(user.id, startDate, endDate);

    // Calculate totals
    const totals = meals.reduce((acc, meal) => {
      const nutrition = meal.aiAnalysis?.totalNutrition || {};
      acc.calories += nutrition.calories || 0;
      acc.protein += nutrition.protein || 0;
      acc.carbs += nutrition.carbs || 0;
      acc.fat += nutrition.fat || 0;
      acc.fiber += nutrition.fiber || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    // Calculate daily averages
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const dailyAverages = {
      calories: daysDiff > 0 ? Math.round(totals.calories / daysDiff) : 0,
      protein: daysDiff > 0 ? Math.round(totals.protein / daysDiff) : 0,
      carbs: daysDiff > 0 ? Math.round(totals.carbs / daysDiff) : 0,
      fat: daysDiff > 0 ? Math.round(totals.fat / daysDiff) : 0,
      fiber: daysDiff > 0 ? Math.round(totals.fiber / daysDiff) : 0
    };

    // Calculate goal progress
    const dailyCalories = user.calculateDailyCalories();
    const calorieProgress = dailyCalories ? (dailyAverages.calories / dailyCalories) * 100 : 0;

    // Determine goal achievement status
    let goalStatus = 'unknown';
    if (user.profile.goal === 'lose_weight' && calorieProgress < 90) {
      goalStatus = 'on_track';
    } else if (user.profile.goal === 'gain_weight' && calorieProgress > 110) {
      goalStatus = 'on_track';
    } else if (user.profile.goal === 'maintain_weight' && calorieProgress >= 90 && calorieProgress <= 110) {
      goalStatus = 'on_track';
    } else {
      goalStatus = 'needs_adjustment';
    }

    res.json({
      period,
      goals: {
        dailyCalories,
        goal: user.profile.goal,
        status: goalStatus,
        progress: Math.round(calorieProgress)
      },
      actual: {
        totalMeals: meals.length,
        dailyAverages,
        totals
      },
      recommendations: generateGoalRecommendations(user, dailyAverages, goalStatus)
    });
  } catch (error) {
    console.error('Goal progress error:', error);
    res.status(500).json({ error: 'Server error fetching goal progress' });
  }
});

// Helper function to generate goal recommendations
const generateGoalRecommendations = (user, dailyAverages, goalStatus) => {
  const recommendations = [];

  if (goalStatus === 'needs_adjustment') {
    if (user.profile.goal === 'lose_weight' && dailyAverages.calories > user.calculateDailyCalories()) {
      recommendations.push('Reduce calorie intake by choosing lower-calorie alternatives');
      recommendations.push('Increase vegetable portions and reduce portion sizes');
    } else if (user.profile.goal === 'gain_weight' && dailyAverages.calories < user.calculateDailyCalories()) {
      recommendations.push('Increase calorie intake with nutrient-dense foods');
      recommendations.push('Add healthy fats like avocados, nuts, and olive oil');
    } else if (user.profile.goal === 'maintain_weight') {
      recommendations.push('Adjust portion sizes to better match your daily calorie needs');
    }
  } else {
    recommendations.push('Great progress! Keep up the good work');
  }

  // General nutrition recommendations
  if (dailyAverages.protein < 50) {
    recommendations.push('Consider increasing protein intake for better satiety and muscle maintenance');
  }

  if (dailyAverages.fiber < 25) {
    recommendations.push('Increase fiber intake with more vegetables, fruits, and whole grains');
  }

  return recommendations;
};

module.exports = router;
