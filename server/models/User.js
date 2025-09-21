const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static createTable() {
    return db;
  }

  static async create(userData) {
    const { name, email, password, profile = {} } = userData;

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, profile)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(name, email, hashedPassword, JSON.stringify(profile));
    const userId = result.lastInsertRowid;

    return this.findById(userId);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id);

    if (!user) return null;

    // Parse profile JSON
    try {
      user.profile = JSON.parse(user.profile || '{}');
    } catch (e) {
      user.profile = {};
    }

    return user;
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) return null;

    // Parse profile JSON
    try {
      user.profile = JSON.parse(user.profile || '{}');
    } catch (e) {
      user.profile = {};
    }

    return user;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static update(id, updateData) {
    const { name, profile } = updateData;

    let query = 'UPDATE users SET';
    let params = [];
    let hasUpdates = false;

    if (name) {
      query += ' name = ?';
      params.push(name);
      hasUpdates = true;
    }

    if (profile) {
      if (hasUpdates) query += ',';
      query += ' profile = ?';
      params.push(JSON.stringify(profile));
      hasUpdates = true;
    }

    if (!hasUpdates) {
      return { changes: 0 }; // No updates needed
    }

    query += ' WHERE id = ?';
    params.push(id);

    const stmt = db.prepare(query);
    return stmt.run(...params);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }

  static getAll(limit = 50, offset = 0) {
    const stmt = db.prepare(`
      SELECT * FROM users
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);

    const users = stmt.all(limit, offset);

    // Parse profile JSON for each user
    users.forEach(user => {
      try {
        user.profile = JSON.parse(user.profile || '{}');
      } catch (e) {
        user.profile = {};
      }
    });

    return users;
  }

  // Instance methods
  calculateBMI() {
    if (!this.profile.height || !this.profile.weight) return null;

    const heightInMeters = this.profile.height / 100;
    return Math.round((this.profile.weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }

  calculateBMR() {
    if (!this.profile.height || !this.profile.weight || !this.profile.age || !this.profile.gender) {
      return null;
    }

    // Mifflin-St Jeor Equation
    const baseCalories = 10 * this.profile.weight + 6.25 * this.profile.height - 5 * this.profile.age;

    if (this.profile.gender === 'male') {
      return Math.round(baseCalories + 5);
    } else {
      return Math.round(baseCalories - 161);
    }
  }

  calculateDailyCalories() {
    const bmr = this.calculateBMR();
    if (!bmr) return null;

    // Activity level multipliers
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly_active': 1.375,
      'moderately_active': 1.55,
      'very_active': 1.725,
      'extra_active': 1.9
    };

    const activityLevel = this.profile.activityLevel || 'sedentary';
    const multiplier = activityMultipliers[activityLevel] || 1.2;

    return Math.round(bmr * multiplier);
  }
}

module.exports = User;
