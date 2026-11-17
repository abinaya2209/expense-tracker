import React, { useState, useEffect, useCallback } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import ChartsSection from './components/ChartsSection';
import BudgetProgress from './components/BudgetProgress';
import CurrencyConverter from './components/CurrencyConverter';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import api from './services/api';
import { Calendar, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const MainDashboard = () => {
  // Financial State
  const [summary, setSummary] = useState({});
  const [trends, setTrends] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filters & Controls
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [sumRes, trendRes, catRes, budgetRes, catListRes] = await Promise.all([
        api.getSummaryMetrics(selectedMonth),
        api.getMonthlyTrends(),
        api.getCategoryBreakdown(selectedMonth),
        api.getBudgetComparison(selectedMonth),
        api.getCategories()
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (trendRes.success) setTrends(trendRes.data);
      if (catRes.success) setCategoryBreakdown(catRes.data.breakdown);
      if (budgetRes.success) setBudgets(budgetRes.data);
      if (catListRes.success) setCategories(catListRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showToast('Error loading financial analytics', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  // Fetch filtered transactions
  const loadTransactions = useCallback(async () => {
    try {
      const res = await api.getTransactions({
        search,
        category: categoryFilter,
        type: typeFilter,
        limit: 100
      });
      if (res.success) {
        setTransactions(res.data);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    }
  }, [search, categoryFilter, typeFilter]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = async (formData) => {
    if (editingTransaction) {
      await api.updateTransaction(editingTransaction.id, formData);
      showToast('Transaction updated successfully!');
    } else {
      await api.createTransaction(formData);
      showToast('New transaction recorded!');
    }
    loadDashboardData();
    loadTransactions();
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await api.deleteTransaction(id);
      showToast('Transaction deleted');
      loadDashboardData();
      loadTransactions();
    } catch (err) {
      showToast('Failed to delete transaction', 'error');
    }
  };

  const handleSeedDemoData = async () => {
    try {
      setIsSeeding(true);
      const res = await api.seedSampleData(true);
      showToast(res.message || 'Demo data loaded successfully!');
      loadDashboardData();
      loadTransactions();
    } catch (err) {
      showToast('Failed to seed demo data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs font-medium animate-slide-up">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-white">{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={handleOpenAdd}
        onSeedData={handleSeedDemoData}
        isSeeding={isSeeding}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Month Selector & Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Financial Overview</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time analytics, budgeting, and currency intelligence
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Analysis Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="2026-11" className="bg-slate-900">November 2026</option>
              <option value="2026-10" className="bg-slate-900">October 2026</option>
              <option value="2026-09" className="bg-slate-900">September 2026</option>
              <option value="2026-08" className="bg-slate-900">August 2026</option>
              <option value="" className="bg-slate-900">All Time Summary</option>
            </select>
          </div>
        </div>

        {/* 1. Summary Cards (KPIs) */}
        <SummaryCards summary={summary} isLoading={isLoading} />

        {/* 2. Visual Charts Section */}
        <ChartsSection
          trends={trends}
          categoryBreakdown={categoryBreakdown}
          selectedMonth={selectedMonth}
        />

        {/* 3. Budget & Currency Converter Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BudgetProgress
              budgets={budgets}
              onBudgetUpdated={loadDashboardData}
            />
          </div>
          <div>
            <CurrencyConverter />
          </div>
        </div>

        {/* 4. Filterable Transaction Table */}
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDeleteTransaction}
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          categories={categories}
        />

      </main>

      {/* Transaction Modal (Add/Edit) */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
        categories={categories}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SpendWise Financial Intelligence Platform</span>
          <span>Full-Stack Internship Portfolio Project</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CurrencyProvider>
      <MainDashboard />
    </CurrencyProvider>
  );
}
