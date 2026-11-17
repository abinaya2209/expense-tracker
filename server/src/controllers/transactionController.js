const { dbRun, dbGet, dbAll } = require('../db/database');

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      type = '',
      startDate = '',
      endDate = '',
      sortBy = 'date',
      sortOrder = 'DESC',
      limit = 100,
      offset = 0
    } = req.query;

    const whereClauses = [];
    const params = [];

    if (search.trim()) {
      whereClauses.push('(notes LIKE ? OR category LIKE ?)');
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (category.trim()) {
      whereClauses.push('category = ?');
      params.push(category.trim());
    }

    if (type.trim() && (type === 'expense' || type === 'income')) {
      whereClauses.push('type = ?');
      params.push(type.trim());
    }

    if (startDate.trim()) {
      whereClauses.push('date >= ?');
      params.push(startDate.trim());
    }

    if (endDate.trim()) {
      whereClauses.push('date <= ?');
      params.push(endDate.trim());
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    // Whitelist sort fields to prevent SQL injection
    const allowedSortFields = ['date', 'amount', 'category', 'type', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countRow = await dbGet(`SELECT COUNT(*) as total FROM transactions ${whereSQL}`, params);
    const total = countRow ? countRow.total : 0;

    const query = `
      SELECT * FROM transactions
      ${whereSQL}
      ORDER BY ${sortField} ${sortDirection}, id DESC
      LIMIT ? OFFSET ?
    `;

    const transactions = await dbAll(query, [...params, Number(limit), Number(offset)]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        totalPages: Math.ceil(total / Number(limit)) || 1
      }
    });
  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({ success: false, error: 'Internal server error while fetching transactions' });
  }
};

// GET /api/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error in getTransactionById:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, payment_method = 'Cash', notes = '', currency = 'USD' } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Amount must be a positive number' });
    }
    if (!type || !['expense', 'income'].includes(type)) {
      return res.status(400).json({ success: false, error: "Type must be either 'expense' or 'income'" });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }
    if (!date) {
      return res.status(400).json({ success: false, error: 'Date is required (YYYY-MM-DD)' });
    }

    const result = await dbRun(
      `INSERT INTO transactions (amount, type, category, date, payment_method, notes, currency)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [Number(amount), type, category.trim(), date, payment_method, notes.trim(), currency]
    );

    const created = await dbGet('SELECT * FROM transactions WHERE id = ?', [result.id]);
    res.status(201).json({ success: true, data: created, message: 'Transaction created successfully' });
  } catch (error) {
    console.error('Error in createTransaction:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date, payment_method, notes, currency } = req.body;

    const existing = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    const updatedAmount = amount !== undefined ? Number(amount) : existing.amount;
    const updatedType = type !== undefined ? type : existing.type;
    const updatedCategory = category !== undefined ? category.trim() : existing.category;
    const updatedDate = date !== undefined ? date : existing.date;
    const updatedPaymentMethod = payment_method !== undefined ? payment_method : existing.payment_method;
    const updatedNotes = notes !== undefined ? notes : existing.notes;
    const updatedCurrency = currency !== undefined ? currency : existing.currency;

    if (isNaN(updatedAmount) || updatedAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Amount must be a positive number' });
    }
    if (!['expense', 'income'].includes(updatedType)) {
      return res.status(400).json({ success: false, error: "Type must be 'expense' or 'income'" });
    }

    await dbRun(
      `UPDATE transactions
       SET amount = ?, type = ?, category = ?, date = ?, payment_method = ?, notes = ?, currency = ?
       WHERE id = ?`,
      [updatedAmount, updatedType, updatedCategory, updatedDate, updatedPaymentMethod, updatedNotes, updatedCurrency, id]
    );

    const updated = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    res.json({ success: true, data: updated, message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error in updateTransaction:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    await dbRun('DELETE FROM transactions WHERE id = ?', [id]);
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// GET /api/export/csv
const exportCSV = async (req, res) => {
  try {
    const transactions = await dbAll('SELECT * FROM transactions ORDER BY date DESC, id DESC');
    
    // Generate CSV string
    const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Currency', 'Payment Method', 'Notes', 'Created At'];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.type,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.amount,
      t.currency,
      `"${(t.payment_method || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
      t.created_at
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="spendwise-transactions.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Error in exportCSV:', error);
    res.status(500).json({ success: false, error: 'Failed to generate CSV export' });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  exportCSV
};
