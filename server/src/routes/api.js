const express = require('express');
const router = express.Router();
const { dbAll, dbRun, dbGet } = require('../db/database');
const { seedTransactions } = require('../db/seed');
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  exportCSV
} = require('../controllers/transactionController');
const {
  getSummaryMetrics,
  getMonthlyTrends,
  getCategoryBreakdown,
  getBudgetComparison
} = require('../controllers/analyticsController');
const {
  SUPPORTED_CURRENCIES,
  fetchLiveRates,
  convertAmount
} = require('../services/currencyService');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SpendWise API',
    version: '1.0.0'
  });
});

// Seed Sample Data (1-Click Demo Ready)
router.post('/seed', async (req, res) => {
  try {
    const force = req.body?.force === true || req.query?.force === 'true';
    const result = await seedTransactions(force);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ success: false, error: 'Failed to seed sample data' });
  }
});

// Transaction Routes
router.get('/transactions', getTransactions);
router.get('/transactions/:id', getTransactionById);
router.post('/transactions', createTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);
router.get('/export/csv', exportCSV);

// Analytics Routes
router.get('/analytics/summary', getSummaryMetrics);
router.get('/analytics/monthly-trend', getMonthlyTrends);
router.get('/analytics/category-breakdown', getCategoryBreakdown);
router.get('/analytics/budget-comparison', getBudgetComparison);

// Budgets Routes
router.get('/budgets', async (req, res) => {
  try {
    const budgets = await dbAll('SELECT * FROM budgets ORDER BY monthly_limit DESC');
    res.json({ success: true, data: budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch budgets' });
  }
});

router.post('/budgets', async (req, res) => {
  try {
    const { category, monthly_limit } = req.body;
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }
    if (isNaN(monthly_limit) || Number(monthly_limit) <= 0) {
      return res.status(400).json({ success: false, error: 'Monthly limit must be positive' });
    }

    // Upsert budget
    const existing = await dbGet('SELECT * FROM budgets WHERE category = ?', [category.trim()]);
    if (existing) {
      await dbRun('UPDATE budgets SET monthly_limit = ? WHERE id = ?', [Number(monthly_limit), existing.id]);
      const updated = await dbGet('SELECT * FROM budgets WHERE id = ?', [existing.id]);
      return res.json({ success: true, data: updated, message: 'Budget updated successfully' });
    } else {
      const result = await dbRun('INSERT INTO budgets (category, monthly_limit) VALUES (?, ?)', [category.trim(), Number(monthly_limit)]);
      const created = await dbGet('SELECT * FROM budgets WHERE id = ?', [result.id]);
      return res.status(201).json({ success: true, data: created, message: 'Budget created successfully' });
    }
  } catch (error) {
    console.error('Error saving budget:', error);
    res.status(500).json({ success: false, error: 'Failed to save budget' });
  }
});

router.delete('/budgets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM budgets WHERE id = ?', [id]);
    res.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ success: false, error: 'Failed to delete budget' });
  }
});

// Categories Routes
router.get('/categories', async (req, res) => {
  try {
    const categories = await dbAll('SELECT * FROM categories ORDER BY name ASC');
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, type = 'expense', color = '#64748b', icon = 'tag' } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Category name is required' });
    }
    const result = await dbRun(
      'INSERT OR IGNORE INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)',
      [name.trim(), type, color, icon]
    );
    const created = await dbGet('SELECT * FROM categories WHERE id = ?', [result.id]);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, error: 'Failed to create category' });
  }
});

// Currencies Routes (Live Rates & Conversion)
router.get('/currencies/rates', async (req, res) => {
  try {
    const base = req.query.base || 'USD';
    const rateData = await fetchLiveRates(base);
    res.json({
      success: true,
      supportedCurrencies: SUPPORTED_CURRENCIES,
      base: rateData.base,
      rates: rateData.rates,
      lastUpdated: rateData.lastUpdated,
      source: rateData.source
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch currency rates' });
  }
});

router.post('/currencies/convert', async (req, res) => {
  try {
    const { amount, from = 'USD', to = 'EUR' } = req.body;
    if (isNaN(amount) || Number(amount) < 0) {
      return res.status(400).json({ success: false, error: 'Valid positive amount is required' });
    }
    const rateData = await fetchLiveRates('USD');
    const converted = convertAmount(Number(amount), from.toUpperCase(), to.toUpperCase(), rateData.rates);

    res.json({
      success: true,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      originalAmount: Number(amount),
      convertedAmount: converted,
      rate: Number((converted / Number(amount)).toFixed(4))
    });
  } catch (error) {
    console.error('Error converting currency:', error);
    res.status(500).json({ success: false, error: 'Failed to convert currency' });
  }
});

module.exports = router;
