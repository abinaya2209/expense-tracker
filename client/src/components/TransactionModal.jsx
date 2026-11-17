import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, CreditCard, FileText } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'UPI / Bank Transfer',
  'Crypto / Other'
];

const DEFAULT_EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Travel & Transport',
  'Housing & Rent',
  'Entertainment',
  'Healthcare',
  'Utilities & Bills',
  'Shopping',
  'Education',
  'Miscellaneous'
];

const DEFAULT_INCOME_CATEGORIES = [
  'Salary',
  'Freelance & Side Gig',
  'Investments',
  'Gifts & Bonus',
  'Other Income'
];

const TransactionModal = ({ isOpen, onClose, onSave, initialData = null, categories = [] }) => {
  const { selectedCurrency, getSymbol, toUSD, convert } = useCurrency();
  const symbol = getSymbol();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [notes, setNotes] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      // Convert stored USD amount to current active currency for convenient editing
      const displayAmount = convert(initialData.amount);
      setAmount(displayAmount.toString());
      setCategory(initialData.category || DEFAULT_EXPENSE_CATEGORIES[0]);
      setDate(initialData.date || new Date().toISOString().slice(0, 10));
      setPaymentMethod(initialData.payment_method || 'Credit Card');
      setNotes(initialData.notes || '');
      setIsCustomCategory(false);
    } else {
      // Reset form
      setType('expense');
      setAmount('');
      setCategory(DEFAULT_EXPENSE_CATEGORIES[0]);
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod('Credit Card');
      setNotes('');
      setIsCustomCategory(false);
      setCustomCategory('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Adjust default category when type toggles
  const handleTypeChange = (newType) => {
    setType(newType);
    if (!isCustomCategory) {
      setCategory(newType === 'expense' ? DEFAULT_EXPENSE_CATEGORIES[0] : DEFAULT_INCOME_CATEGORIES[0]);
    }
  };

  const validate = () => {
    const errs = {};
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      errs.amount = 'Please enter a valid positive amount';
    }
    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      errs.category = 'Please select or enter a category';
    }
    if (!date) {
      errs.date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      // Convert from active display currency into USD base storage
      const usdAmount = toUSD(Number(amount));
      const finalCategory = isCustomCategory ? customCategory.trim() : category;

      await onSave({
        amount: usdAmount,
        type,
        category: finalCategory,
        date,
        payment_method: paymentMethod,
        notes: notes.trim(),
        currency: 'USD'
      });

      onClose();
    } catch (err) {
      console.error('Error submitting transaction:', err);
      setErrors({ form: err.message || 'Failed to save transaction' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const activeCategoryList = type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">
            {initialData ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Type Selector (Expense vs Income) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 rounded-lg text-xs font-semibold transition ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 rounded-lg text-xs font-semibold transition ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Amount ({selectedCurrency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">
                {symbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            {errors.amount && <p className="text-[11px] text-rose-400 mt-1">{errors.amount}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">Category</label>
              <button
                type="button"
                onClick={() => setIsCustomCategory(!isCustomCategory)}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                {isCustomCategory ? 'Choose from list' : '+ Add custom category'}
              </button>
            </div>

            {isCustomCategory ? (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Pet Care, Photography, Tech"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {activeCategoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
            {errors.category && <p className="text-[11px] text-rose-400 mt-1">{errors.category}</p>}
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              {errors.date && <p className="text-[11px] text-rose-400 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes / Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Merchant</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Starbucks Latte, Amazon monitor mount..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {errors.form && <p className="text-xs text-rose-400 text-center">{errors.form}</p>}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Record' : 'Save Transaction'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default TransactionModal;
