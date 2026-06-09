const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create database directory if it doesn't exist
const dbPath = path.join(__dirname, '../database');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const dbFile = path.join(dbPath, 'meal_analyzer.db');

// Create database connection
const db = sqlite3(dbFile);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      profile TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Meals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      image_url TEXT NOT NULL,
      image_path TEXT,
      meal_type TEXT NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      tags TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Detected foods table
  db.exec(`
    CREATE TABLE IF NOT EXISTS detected_foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meal_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      confidence REAL NOT NULL,
      calories REAL DEFAULT 0,
      protein REAL DEFAULT 0,
      carbs REAL DEFAULT 0,
      fat REAL DEFAULT 0,
      fiber REAL DEFAULT 0,
      FOREIGN KEY (meal_id) REFERENCES meals (id) ON DELETE CASCADE
    )
  `);

  // AI Analysis table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_analysis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meal_id INTEGER NOT NULL,
      overall_assessment TEXT,
      nutritional_balance TEXT,
      recommendations TEXT,
      macro_protein INTEGER DEFAULT 0,
      macro_carbs INTEGER DEFAULT 0,
      macro_fat INTEGER DEFAULT 0,
      total_calories INTEGER DEFAULT 0,
      total_protein REAL DEFAULT 0,
      total_carbs REAL DEFAULT 0,
      total_fat REAL DEFAULT 0,
      total_fiber REAL DEFAULT 0,
      FOREIGN KEY (meal_id) REFERENCES meals (id) ON DELETE CASCADE
    )
  `);
};

// Initialize database
createTables();

module.exports = db;
