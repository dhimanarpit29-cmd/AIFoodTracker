const db = require('../config/database');

class Meal {
  static createTable() {
    return db;
  }

  static create(mealData) {
    const {
      user_id,
      name,
      image_url,
      image_path,
      meal_type,
      tags,
      notes,
      detected_foods,
      ai_analysis,
      date,
    } = mealData;

    const mealDate = date ? new Date(date).toISOString() : new Date().toISOString();

    // Validate required parameters
    if (!user_id || !name || !image_url || !meal_type) {
      throw new Error('Missing required parameters: user_id, name, image_url, and meal_type are required');
    }

    // Insert meal with proper error handling
    const stmt = db.prepare(`
      INSERT INTO meals (user_id, name, image_url, image_path, meal_type, tags, notes, date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    try {
      const result = stmt.run(
        user_id,
        name,
        image_url,
        image_path || null,
        meal_type,
        tags && Array.isArray(tags) ? tags.join(', ') : (tags || ''),
        notes || '',
        mealDate
      );
      const mealId = result.lastInsertRowid;

      // Insert detected foods
      if (detected_foods && detected_foods.length > 0) {
        const foodStmt = db.prepare(`
          INSERT INTO detected_foods (meal_id, name, confidence, calories, protein, carbs, fat, fiber)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const food of detected_foods) {
          foodStmt.run(
            mealId,
            food.name,
            food.confidence || 0,
            food.nutrition?.calories || 0,
            food.nutrition?.protein || 0,
            food.nutrition?.carbs || 0,
            food.nutrition?.fat || 0,
            food.nutrition?.fiber || 0
          );
        }
      }

      // Insert AI analysis
      if (ai_analysis && Object.keys(ai_analysis).length > 0) {
        const analysisStmt = db.prepare(`
          INSERT INTO ai_analysis (
            meal_id, overall_assessment, nutritional_balance, recommendations,
            macro_protein, macro_carbs, macro_fat,
            total_calories, total_protein, total_carbs, total_fat, total_fiber
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        analysisStmt.run(
          mealId,
          ai_analysis.overallAssessment || '',
          ai_analysis.nutritionalBalance || '',
          JSON.stringify(ai_analysis.recommendations || []),
          ai_analysis.macroDistribution?.protein || 0,
          ai_analysis.macroDistribution?.carbs || 0,
          ai_analysis.macroDistribution?.fat || 0,
          ai_analysis.totalNutrition?.calories || 0,
          ai_analysis.totalNutrition?.protein || 0,
          ai_analysis.totalNutrition?.carbs || 0,
          ai_analysis.totalNutrition?.fat || 0,
          ai_analysis.totalNutrition?.fiber || 0
        );
      }

      return this.findById(mealId);
    } catch (error) {
      console.error('Error creating meal:', error);
      console.error('Meal data received:', JSON.stringify(mealData, null, 2));
      throw new Error(`Failed to create meal: ${error.message}`);
    }
  }

  static findById(id) {
    const stmt = db.prepare(`
      SELECT m.*,
             u.name as user_name, u.email as user_email
      FROM meals m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.id = ?
    `);

    const meal = stmt.get(id);
    if (!meal) return null;

    // Get detected foods
    const foodStmt = db.prepare('SELECT * FROM detected_foods WHERE meal_id = ?');
    meal.detectedFoods = foodStmt.all(id);

    // Get AI analysis
    const analysisStmt = db.prepare('SELECT * FROM ai_analysis WHERE meal_id = ?');
    const analysis = analysisStmt.get(id);

    if (analysis) {
      meal.aiAnalysis = {
        overallAssessment: analysis.overall_assessment,
        nutritionalBalance: analysis.nutritional_balance,
        recommendations: JSON.parse(analysis.recommendations || '[]'),
        macroDistribution: {
          protein: analysis.macro_protein,
          carbs: analysis.macro_carbs,
          fat: analysis.macro_fat
        },
        totalNutrition: {
          calories: analysis.total_calories,
          protein: analysis.total_protein,
          carbs: analysis.total_carbs,
          fat: analysis.total_fat,
          fiber: analysis.total_fiber
        }
      };
    }

    return meal;
  }

  static findByUserId(userId, limit = 50, offset = 0) {
    const stmt = db.prepare(`
      SELECT m.*,
             u.name as user_name, u.email as user_email
      FROM meals m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.user_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `);

    const meals = stmt.all(userId, limit, offset);

    // Get detected foods and AI analysis for each meal
    for (const meal of meals) {
      const foodStmt = db.prepare('SELECT * FROM detected_foods WHERE meal_id = ?');
      meal.detectedFoods = foodStmt.all(meal.id);

      const analysisStmt = db.prepare('SELECT * FROM ai_analysis WHERE meal_id = ?');
      const analysis = analysisStmt.get(meal.id);

      if (analysis) {
        meal.aiAnalysis = {
          overallAssessment: analysis.overall_assessment,
          nutritionalBalance: analysis.nutritional_balance,
          recommendations: JSON.parse(analysis.recommendations || '[]'),
          macroDistribution: {
            protein: analysis.macro_protein,
            carbs: analysis.macro_carbs,
            fat: analysis.macro_fat
          },
          totalNutrition: {
            calories: analysis.total_calories,
            protein: analysis.total_protein,
            carbs: analysis.total_carbs,
            fat: analysis.total_fat,
            fiber: analysis.total_fiber
          }
        };
      }
    }

    return meals;
  }

  static findByUserIdAndDateRange(userId, startDate, endDate) {
    const stmt = db.prepare(`
      SELECT m.*,
             u.name as user_name, u.email as user_email
      FROM meals m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.user_id = ? AND m.date >= ? AND m.date <= ?
      ORDER BY m.created_at DESC
    `);

    const meals = stmt.all(userId, startDate.toISOString(), endDate.toISOString());

    // Get detected foods and AI analysis for each meal
    for (const meal of meals) {
      const foodStmt = db.prepare('SELECT * FROM detected_foods WHERE meal_id = ?');
      meal.detectedFoods = foodStmt.all(meal.id);

      const analysisStmt = db.prepare('SELECT * FROM ai_analysis WHERE meal_id = ?');
      const analysis = analysisStmt.get(meal.id);

      if (analysis) {
        meal.aiAnalysis = {
          overallAssessment: analysis.overall_assessment,
          nutritionalBalance: analysis.nutritional_balance,
          recommendations: JSON.parse(analysis.recommendations || '[]'),
          macroDistribution: {
            protein: analysis.macro_protein,
            carbs: analysis.macro_carbs,
            fat: analysis.macro_fat
          },
          totalNutrition: {
            calories: analysis.total_calories,
            protein: analysis.total_protein,
            carbs: analysis.total_carbs,
            fat: analysis.total_fat,
            fiber: analysis.total_fiber
          }
        };
      }
    }

    return meals;
  }

  static update(id, updateData) {
    const { name, tags, notes } = updateData;

    const stmt = db.prepare(`
      UPDATE meals
      SET name = ?, tags = ?, notes = ?
      WHERE id = ?
    `);

    return stmt.run(name, tags, notes, id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM meals WHERE id = ?');
    return stmt.run(id);
  }

  static getAnalytics(userId, date) {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const stmt = db.prepare(`
      SELECT m.*, u.name as user_name
      FROM meals m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.user_id = ? AND m.date >= ? AND m.date <= ?
    `);

    const meals = stmt.all(userId, startOfDay.toISOString(), endOfDay.toISOString());

    // Calculate totals
    const totals = meals.reduce((acc, meal) => {
      const analysis = meal.aiAnalysis;
      if (analysis && analysis.totalNutrition) {
        acc.calories += analysis.totalNutrition.calories || 0;
        acc.protein += analysis.totalNutrition.protein || 0;
        acc.carbs += analysis.totalNutrition.carbs || 0;
        acc.fat += analysis.totalNutrition.fat || 0;
        acc.fiber += analysis.totalNutrition.fiber || 0;
      }
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    return {
      date: targetDate.toISOString().split('T')[0],
      totalMeals: meals.length,
      nutritionTotals: totals,
      meals: meals.map(meal => ({
        id: meal.id,
        name: meal.name,
        mealType: meal.meal_type,
        nutrition: meal.aiAnalysis?.totalNutrition || {},
        time: meal.date
      }))
    };
  }
}

module.exports = Meal;
