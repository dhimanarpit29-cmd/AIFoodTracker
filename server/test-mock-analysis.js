const { analyzeMealImage } = require('./utils/aiAnalyzer');

// Test meal analysis with mock data
async function testMealAnalysis() {
  console.log('🧪 Testing Meal Analysis with Mock Data...\n');

  try {
    // Test with a non-existent file (should use mock data)
    const analysis = await analyzeMealImage('test-meal.jpg');

    console.log('✅ Mock analysis successful!');
    console.log('📊 Analysis Results:');
    console.log('   - Meal name:', analysis.name);
    console.log('   - Foods detected:', analysis.detectedFoods.length);
    console.log('   - Confidence:', analysis.confidence);
    console.log('   - Total calories:', analysis.aiAnalysis.totalNutrition.calories);
    console.log('   - Health score:', analysis.aiAnalysis.healthScore);

    console.log('\n🍽️ Detected Foods:');
    analysis.detectedFoods.forEach((food, index) => {
      console.log(`   ${index + 1}. ${food.name} (${Math.round(food.confidence * 100)}% confidence)`);
      console.log(`      - Calories: ${food.nutrition.calories}`);
      console.log(`      - Protein: ${food.nutrition.protein}g`);
      console.log(`      - Carbs: ${food.nutrition.carbs}g`);
      console.log(`      - Fat: ${food.nutrition.fat}g`);
    });

    console.log('\n💊 AI Recommendations:');
    analysis.aiAnalysis.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });

    console.log('\n🎉 Mock meal analysis test completed successfully!');

  } catch (error) {
    console.error('❌ Meal analysis test failed:', error.message);
    console.error(error.stack);
  }
}

testMealAnalysis();
