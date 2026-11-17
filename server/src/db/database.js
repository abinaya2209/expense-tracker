const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', DB_PATH);
  }
});

// Helper wrappers for async/await
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Initialize schema
const initDatabase = async () => {
  await dbRun(`PRAGMA foreign_keys = ON;`);

  // Categories table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK(type IN ('expense', 'income', 'both')),
      color TEXT DEFAULT '#64748b',
      icon TEXT DEFAULT 'tag'
    );
  `);

  // Transactions table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('expense', 'income')),
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      payment_method TEXT DEFAULT 'Credit Card',
      notes TEXT,
      currency TEXT DEFAULT 'USD',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Budgets table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL UNIQUE,
      monthly_limit REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default categories if none exist
  const existingCategories = await dbGet(`SELECT COUNT(*) as count FROM categories`);
  if (existingCategories.count === 0) {
    const defaultCategories = [
      // Expense categories
      { name: 'Food & Dining', type: 'expense', color: '#f97316', icon: 'utensils' },
      { name: 'Travel & Transport', type: 'expense', color: '#3b82f6', icon: 'car' },
      { name: 'Housing & Rent', type: 'expense', color: '#8b5cf6', icon: 'home' },
      { name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'film' },
      { name: 'Healthcare', type: 'expense', color: '#ef4444', icon: 'heart-pulse' },
      { name: 'Utilities & Bills', type: 'expense', color: '#eab308', icon: 'zap' },
      { name: 'Shopping', type: 'expense', color: '#06b6d4', icon: 'shopping-bag' },
      { name: 'Education', type: 'expense', color: '#10b981', icon: 'book-open' },
      { name: 'Miscellaneous', type: 'expense', color: '#64748b', icon: 'more-horizontal' },
      // Income categories
      { name: 'Salary', type: 'income', color: '#22c55e', icon: 'banknote' },
      { name: 'Freelance & Side Gig', type: 'income', color: '#14b8a6', icon: 'laptop' },
      { name: 'Investments', type: 'income', color: '#6366f1', icon: 'trending-up' },
      { name: 'Gifts & Bonus', type: 'income', color: '#a855f7', icon: 'gift' }
    ];

    for (const cat of defaultCategories) {
      await dbRun(
        `INSERT OR IGNORE INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)`,
        [cat.name, cat.type, cat.color, cat.icon]
      );
    }
  }

  // Seed default budgets if none exist
  const existingBudgets = await dbGet(`SELECT COUNT(*) as count FROM budgets`);
  if (existingBudgets.count === 0) {
    const defaultBudgets = [
      { category: 'Food & Dining', monthly_limit: 500 },
      { category: 'Travel & Transport', monthly_limit: 300 },
      { category: 'Entertainment', monthly_limit: 200 },
      { category: 'Shopping', monthly_limit: 250 },
      { category: 'Utilities & Bills', monthly_limit: 200 },
      { category: 'Housing & Rent', monthly_limit: 1200 }
    ];

    for (const b of defaultBudgets) {
      await dbRun(
        `INSERT OR IGNORE INTO budgets (category, monthly_limit) VALUES (?, ?)`,
        [b.category, b.monthly_limit]
      );
    }
  }
};

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll,
  initDatabase
};
