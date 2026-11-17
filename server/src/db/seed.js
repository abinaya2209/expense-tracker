const { dbRun, dbGet } = require('./database');

const sampleTransactions = [
  // Current Month Expenses
  { amount: 3500.00, type: 'income', category: 'Salary', date: '2026-11-01', payment_method: 'Bank Transfer', notes: 'Monthly Tech Lead Salary', currency: 'USD' },
  { amount: 650.00, type: 'income', category: 'Freelance & Side Gig', date: '2026-11-05', payment_method: 'UPI / Bank Transfer', notes: 'Mobile App UI Design Project', currency: 'USD' },
  { amount: 1200.00, type: 'expense', category: 'Housing & Rent', date: '2026-11-02', payment_method: 'Bank Transfer', notes: 'Apartment Monthly Rent', currency: 'USD' },
  { amount: 145.50, type: 'expense', category: 'Food & Dining', date: '2026-11-03', payment_method: 'Credit Card', notes: 'Weekly Organic Grocery Shopping', currency: 'USD' },
  { amount: 68.20, type: 'expense', category: 'Food & Dining', date: '2026-11-06', payment_method: 'Credit Card', notes: 'Italian Bistro Dinner with Friends', currency: 'USD' },
  { amount: 85.00, type: 'expense', category: 'Utilities & Bills', date: '2026-11-04', payment_method: 'Debit Card', notes: 'High-speed Fiber Internet Bill', currency: 'USD' },
  { amount: 45.00, type: 'expense', category: 'Travel & Transport', date: '2026-11-07', payment_method: 'Cash', notes: 'Metro Train Pass Recharge', currency: 'USD' },
  { amount: 55.40, type: 'expense', category: 'Travel & Transport', date: '2026-11-09', payment_method: 'Credit Card', notes: 'Car Gas Refill', currency: 'USD' },
  { amount: 120.00, type: 'expense', category: 'Shopping', date: '2026-11-08', payment_method: 'Credit Card', notes: 'Ergonomic Desk Accessories', currency: 'USD' },
  { amount: 24.99, type: 'expense', category: 'Entertainment', date: '2026-11-10', payment_method: 'Credit Card', notes: 'Netflix & Spotify Premium', currency: 'USD' },
  { amount: 80.00, type: 'expense', category: 'Healthcare', date: '2026-11-11', payment_method: 'Credit Card', notes: 'Dental Routine Checkup', currency: 'USD' },
  { amount: 35.80, type: 'expense', category: 'Food & Dining', date: '2026-11-12', payment_method: 'Debit Card', notes: 'Coffee & Cafe Lunch', currency: 'USD' },

  // Last Month (October 2026)
  { amount: 3500.00, type: 'income', category: 'Salary', date: '2026-10-01', payment_method: 'Bank Transfer', notes: 'Monthly Tech Lead Salary', currency: 'USD' },
  { amount: 400.00, type: 'income', category: 'Investments', date: '2026-10-15', payment_method: 'Bank Transfer', notes: 'Quarterly Stock Dividends', currency: 'USD' },
  { amount: 1200.00, type: 'expense', category: 'Housing & Rent', date: '2026-10-02', payment_method: 'Bank Transfer', notes: 'Apartment Monthly Rent', currency: 'USD' },
  { amount: 480.00, type: 'expense', category: 'Food & Dining', date: '2026-10-14', payment_method: 'Credit Card', notes: 'October Groceries & Eating Out', currency: 'USD' },
  { amount: 195.00, type: 'expense', category: 'Travel & Transport', date: '2026-10-18', payment_method: 'Credit Card', notes: 'Intercity Train Tickets', currency: 'USD' },
  { amount: 130.00, type: 'expense', category: 'Utilities & Bills', date: '2026-10-20', payment_method: 'Debit Card', notes: 'Electric & Water Utility Bills', currency: 'USD' },
  { amount: 210.00, type: 'expense', category: 'Shopping', date: '2026-10-22', payment_method: 'Credit Card', notes: 'Winter Clothing Sale', currency: 'USD' },
  { amount: 95.00, type: 'expense', category: 'Entertainment', date: '2026-10-25', payment_method: 'Credit Card', notes: 'Concert & Cinema Night', currency: 'USD' },
  { amount: 65.00, type: 'expense', category: 'Education', date: '2026-10-28', payment_method: 'Credit Card', notes: 'Cloud Architecture Certification Course', currency: 'USD' },

  // Two Months Ago (September 2026)
  { amount: 3500.00, type: 'income', category: 'Salary', date: '2026-09-01', payment_method: 'Bank Transfer', notes: 'Monthly Tech Lead Salary', currency: 'USD' },
  { amount: 800.00, type: 'income', category: 'Freelance & Side Gig', date: '2026-09-12', payment_method: 'Bank Transfer', notes: 'API Integration Consulting', currency: 'USD' },
  { amount: 1200.00, type: 'expense', category: 'Housing & Rent', date: '2026-09-02', payment_method: 'Bank Transfer', notes: 'Apartment Monthly Rent', currency: 'USD' },
  { amount: 430.00, type: 'expense', category: 'Food & Dining', date: '2026-09-10', payment_method: 'Credit Card', notes: 'September Dining & Groceries', currency: 'USD' },
  { amount: 160.00, type: 'expense', category: 'Travel & Transport', date: '2026-09-15', payment_method: 'Credit Card', notes: 'Fuel & Highway Tolls', currency: 'USD' },
  { amount: 110.00, type: 'expense', category: 'Utilities & Bills', date: '2026-09-18', payment_method: 'Debit Card', notes: 'Utilities & Internet', currency: 'USD' },
  { amount: 150.00, type: 'expense', category: 'Shopping', date: '2026-09-20', payment_method: 'Credit Card', notes: 'Books and Home Office Decor', currency: 'USD' },
  { amount: 75.00, type: 'expense', category: 'Entertainment', date: '2026-09-24', payment_method: 'Cash', notes: 'Board Game Cafe & Arcade', currency: 'USD' },

  // Three Months Ago (August 2026)
  { amount: 3500.00, type: 'income', category: 'Salary', date: '2026-08-01', payment_method: 'Bank Transfer', notes: 'Monthly Tech Lead Salary', currency: 'USD' },
  { amount: 1200.00, type: 'expense', category: 'Housing & Rent', date: '2026-08-02', payment_method: 'Bank Transfer', notes: 'Apartment Monthly Rent', currency: 'USD' },
  { amount: 510.00, type: 'expense', category: 'Food & Dining', date: '2026-08-12', payment_method: 'Credit Card', notes: 'August Groceries & BBQ Party', currency: 'USD' },
  { amount: 320.00, type: 'expense', category: 'Travel & Transport', date: '2026-08-16', payment_method: 'Credit Card', notes: 'Weekend Roadtrip Lodging & Gas', currency: 'USD' },
  { amount: 140.00, type: 'expense', category: 'Utilities & Bills', date: '2026-08-20', payment_method: 'Debit Card', notes: 'Summer AC Power Bill', currency: 'USD' }
];

const seedTransactions = async (force = false) => {
  const countRow = await dbGet(`SELECT COUNT(*) as count FROM transactions`);
  if (countRow.count > 0 && !force) {
    return { seeded: false, count: countRow.count, message: 'Database already has transactions.' };
  }

  if (force) {
    await dbRun(`DELETE FROM transactions`);
  }

  for (const t of sampleTransactions) {
    await dbRun(
      `INSERT INTO transactions (amount, type, category, date, payment_method, notes, currency)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [t.amount, t.type, t.category, t.date, t.payment_method, t.notes, t.currency]
    );
  }

  const newCount = await dbGet(`SELECT COUNT(*) as count FROM transactions`);
  return { seeded: true, count: newCount.count, message: `Successfully seeded ${sampleTransactions.length} sample transactions!` };
};

module.exports = {
  sampleTransactions,
  seedTransactions
};
