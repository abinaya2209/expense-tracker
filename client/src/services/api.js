import axios from 'axios';

const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // Transactions
  getTransactions: async (params = {}) => {
    const response = await apiClient.get('/transactions', { params });
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data) => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },

  updateTransaction: async (id, data) => {
    const response = await apiClient.put(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  },

  // Analytics
  getSummaryMetrics: async (month = '') => {
    const response = await apiClient.get('/analytics/summary', { params: { month } });
    return response.data;
  },

  getMonthlyTrends: async () => {
    const response = await apiClient.get('/analytics/monthly-trend');
    return response.data;
  },

  getCategoryBreakdown: async (month = '') => {
    const response = await apiClient.get('/analytics/category-breakdown', { params: { month } });
    return response.data;
  },

  getBudgetComparison: async (month = '') => {
    const response = await apiClient.get('/analytics/budget-comparison', { params: { month } });
    return response.data;
  },

  // Budgets
  getBudgets: async () => {
    const response = await apiClient.get('/budgets');
    return response.data;
  },

  saveBudget: async (budgetData) => {
    const response = await apiClient.post('/budgets', budgetData);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Currency
  getCurrencyRates: async (base = 'USD') => {
    const response = await apiClient.get('/currencies/rates', { params: { base } });
    return response.data;
  },

  convertCurrency: async (amount, from, to) => {
    const response = await apiClient.post('/currencies/convert', { amount, from, to });
    return response.data;
  },

  // Seed sample data
  seedSampleData: async (force = false) => {
    const response = await apiClient.post('/seed', { force });
    return response.data;
  },

  // CSV Export URL
  getExportCSVUrl: () => `${API_BASE}/export/csv`
};

export default api;
