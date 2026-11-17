const { dbAll, dbGet } = require('../db/database');

// GET /api/analytics/summary
const getSummaryMetrics = async (req, res) => {
  try {
    const { month } = req.query; // format 'YYYY-MM', e.g., '2026-11'
    
    let dateFilter = '';
    const params = [];
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      dateFilter = `WHERE strftime('%Y-%m', date) = ?`;
      params.push(month);
    }

    const incomeRow = await dbGet(
      `SELECT COALESCE(SUM(amount), 0) as totalIncome, COUNT(*) as count 
       FROM transactions 
       ${dateFilter ? dateFilter + " AND type = 'income'" : "WHERE type = 'income'"}`,
      params
    );

    const expenseRow = await dbGet(
      `SELECT COALESCE(SUM(amount), 0) as totalExpense, COUNT(*) as count 
       FROM transactions 
       ${dateFilter ? dateFilter + " AND type = 'expense'" : "WHERE type = 'expense'"}`,
      params
    );

    const totalIncome = incomeRow ? incomeRow.totalIncome : 0;
    const totalExpenses = expenseRow ? expenseRow.totalExpense : 0;
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Number(((netSavings / totalIncome) * 100).toFixed(1)) : 0;
    const totalTransactions = (incomeRow ? incomeRow.count : 0) + (expenseRow ? expenseRow.count : 0);

    // Calculate previous month comparison if month filter provided
    let comparison = null;
    if (month) {
      const [yearStr, monthStr] = month.split('-');
      const d = new Date(Number(yearStr), Number(monthStr) - 2, 1);
      const prevMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      const prevIncome = await dbGet(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE strftime('%Y-%m', date) = ? AND type = 'income'`,
        [prevMonth]
      );
      const prevExpense = await dbGet(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE strftime('%Y-%m', date) = ? AND type = 'expense'`,
        [prevMonth]
      );

      const incomeDiff = prevIncome.total > 0 ? ((totalIncome - prevIncome.total) / prevIncome.total) * 100 : 0;
      const expenseDiff = prevExpense.total > 0 ? ((totalExpenses - prevExpense.total) / prevExpense.total) * 100 : 0;

      comparison = {
        prevMonth,
        prevIncome: prevIncome.total,
        prevExpense: prevExpense.total,
        incomeChangePercent: Number(incomeDiff.toFixed(1)),
        expenseChangePercent: Number(expenseDiff.toFixed(1))
      };
    }

    res.json({
      success: true,
      data: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        netSavings: Number(netSavings.toFixed(2)),
        savingsRate,
        totalTransactions,
        comparison
      }
    });
  } catch (error) {
    console.error('Error in getSummaryMetrics:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate financial summary metrics' });
  }
};

// GET /api/analytics/monthly-trend
const getMonthlyTrends = async (req, res) => {
  try {
    const rawData = await dbAll(`
      SELECT 
        strftime('%Y-%m', date) as month,
        type,
        SUM(amount) as total
      FROM transactions
      GROUP BY month, type
      ORDER BY month ASC
    `);

    // Pivot data by month
    const monthsMap = {};
    for (const row of rawData) {
      if (!row.month) continue;
      if (!monthsMap[row.month]) {
        monthsMap[row.month] = {
          month: row.month,
          income: 0,
          expense: 0,
          net: 0
        };
      }
      if (row.type === 'income') {
        monthsMap[row.month].income = Number(row.total.toFixed(2));
      } else if (row.type === 'expense') {
        monthsMap[row.month].expense = Number(row.total.toFixed(2));
      }
      monthsMap[row.month].net = Number((monthsMap[row.month].income - monthsMap[row.month].expense).toFixed(2));
    }

    const trends = Object.values(monthsMap).sort((a, b) => a.month.localeCompare(b.month));

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error in getMonthlyTrends:', error);
    res.status(500).json({ success: false, error: 'Failed to generate monthly trends' });
  }
};

// GET /api/analytics/category-breakdown
const getCategoryBreakdown = async (req, res) => {
  try {
    const { month } = req.query;
    let whereSQL = "WHERE t.type = 'expense'";
    const params = [];

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      whereSQL += " AND strftime('%Y-%m', t.date) = ?";
      params.push(month);
    }

    const query = `
      SELECT 
        t.category,
        COALESCE(c.color, '#64748b') as color,
        COALESCE(c.icon, 'tag') as icon,
        SUM(t.amount) as total,
        COUNT(*) as count
      FROM transactions t
      LEFT JOIN categories c ON t.category = c.name
      ${whereSQL}
      GROUP BY t.category
      ORDER BY total DESC
    `;

    const categories = await dbAll(query, params);

    const overallTotal = categories.reduce((sum, item) => sum + item.total, 0);

    const breakdown = categories.map(item => ({
      category: item.category,
      color: item.color,
      icon: item.icon,
      total: Number(item.total.toFixed(2)),
      count: item.count,
      percentage: overallTotal > 0 ? Number(((item.total / overallTotal) * 100).toFixed(1)) : 0
    }));

    res.json({
      success: true,
      data: {
        totalExpense: Number(overallTotal.toFixed(2)),
        breakdown
      }
    });
  } catch (error) {
    console.error('Error in getCategoryBreakdown:', error);
    res.status(500).json({ success: false, error: 'Failed to generate category breakdown' });
  }
};

// GET /api/analytics/budget-comparison
const getBudgetComparison = async (req, res) => {
  try {
    const { month } = req.query; // format 'YYYY-MM'
    const targetMonth = month && /^\d{4}-\d{2}$/.test(month)
      ? month 
      : new Date().toISOString().slice(0, 7);

    const budgets = await dbAll('SELECT * FROM budgets ORDER BY monthly_limit DESC');
    const spentByCategory = await dbAll(
      `SELECT category, SUM(amount) as spent 
       FROM transactions 
       WHERE type = 'expense' AND strftime('%Y-%m', date) = ?
       GROUP BY category`,
      [targetMonth]
    );

    const spentMap = {};
    spentByCategory.forEach(item => {
      spentMap[item.category] = item.spent;
    });

    const comparison = budgets.map(b => {
      const spent = spentMap[b.category] || 0;
      const limit = b.monthly_limit;
      const remaining = limit - spent;
      const percentage = limit > 0 ? Number(((spent / limit) * 100).toFixed(1)) : 0;
      return {
        id: b.id,
        category: b.category,
        limit: Number(limit.toFixed(2)),
        spent: Number(spent.toFixed(2)),
        remaining: Number(remaining.toFixed(2)),
        percentage,
        isExceeded: spent > limit,
        status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'safe'
      };
    });

    res.json({
      success: true,
      month: targetMonth,
      data: comparison
    });
  } catch (error) {
    console.error('Error in getBudgetComparison:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate budget comparison' });
  }
};

module.exports = {
  getSummaryMetrics,
  getMonthlyTrends,
  getCategoryBreakdown,
  getBudgetComparison
};
