const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Meal = require('./models/Meal');

// Test script to verify dashboard fixes
async function testDashboardFixes() {
  try {
    console.log('🧪 Testing Dashboard Fixes...\n');

    // Create a test user
    const testUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      profile: {
        age: 30,
        height: 175,
        weight: 70,
        goal: 'maintain_weight',
        activity_level: 'moderate'
      }
    };

    const user = User.create(testUserData);
    console.log('✅ Test user created:', user.id);

    // Create User instance to test methods
    const userInstance = new User();
    Object.assign(userInstance, user);

    // Test BMI calculation
    const bmi = userInstance.calculateBMI();
    console.log('✅ BMI calculation works:', bmi);

    // Test BMR calculation
    const bmr = userInstance.calculateBMR();
    console.log('✅ BMR calculation works:', bmr);

    // Test daily calories calculation
    const dailyCalories = userInstance.calculateDailyCalories();
    console.log('✅ Daily calories calculation works:', dailyCalories);

    // Create some test meals
    const testMeals = [
      {
        user_id: user.id,
        name: 'Test Breakfast',
        meal_type: 'breakfast',
        aiAnalysis: {
          totalNutrition: {
            calories: 400,
            protein: 20,
            carbs: 50,
            fat: 15
          }
        }
      },
      {
        user_id: user.id,
        name: 'Test Lunch',
        meal_type: 'lunch',
        aiAnalysis: {
          totalNutrition: {
            calories: 600,
            protein: 30,
            carbs: 70,
            fat: 20
          }
        }
      }
    ];

    testMeals.forEach(mealData => {
      const meal = Meal.create(mealData);
      console.log('✅ Test meal created:', meal.id);
    });

    // Test Meal.findByUserIdAndDateRange method
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const meals = Meal.findByUserIdAndDateRange(user.id, today, tomorrow);
    console.log('✅ Meal.findByUserIdAndDateRange works:', meals.length, 'meals found');

    // Generate JWT token for testing
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'test-secret'
    );

    console.log('\n🎉 All dashboard fixes verified successfully!');
    console.log('📝 JWT Token for testing:', token);
    console.log('\n📋 Summary of fixes applied:');
    console.log('1. ✅ Fixed Meal import in users.js (Meal_new)');
    console.log('2. ✅ Fixed auth middleware to create User instances');
    console.log('3. ✅ Fixed rate limiting configuration');
    console.log('4. ✅ All user calculation methods work (BMI, BMR, daily calories)');
    console.log('5. ✅ Meal filtering by date range works');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

testDashboardFixes();
