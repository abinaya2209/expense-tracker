import React, { useState } from 'react';
import { Search, Filter, Trash2, Edit3, ArrowUpRight, ArrowDownRight, CreditCard, Calendar } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const TransactionList = ({
  transactions = [],
  totalCount = 0,
  onEdit,
  onDelete,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  typeFilter,
  setTypeFilter,
  categories = []
}) => {
  const { convert, getSymbol } = useCurrency();
  const symbol = getSymbol();
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDeleteClick = (id) => {
    if (deleteConfirmId === id) {
      onDelete(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => {
        setDeleteConfirmId((prev) => (prev === id ? null : prev));
      }, 3000);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-800/80 border border-slate-700/60 p-5 shadow-lg">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
          <p className="text-xs text-slate-400">Search, filter, and manage your financial records</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Search Box */}
          <div className="relative min-w-[180px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes or categories..."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
          </div>

          {/* Type Toggle */}
          <div className="flex bg-slate-900/80 p-0.5 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setTypeFilter('')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${!typeFilter ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${typeFilter === 'expense' ? 'bg-rose-500/20 text-rose-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${typeFilter === 'income' ? 'bg-emerald-500/20 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Income
            </button>
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900/80 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Transaction Table */}
      {transactions.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center justify-center">
          <Calendar className="w-10 h-10 text-slate-600 mb-2" />
          <p className="font-medium text-slate-300">No transactions found</p>
          <p className="text-slate-500 mt-1">Try adjusting your filters or add a new transaction above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-2">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 hidden md:table-cell">Method</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((t) => {
                const isExpense = t.type === 'expense';
                const convertedAmount = convert(t.amount);

                return (
                  <tr key={t.id} className="hover:bg-slate-700/20 transition group">
                    
                    {/* Date */}
                    <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                      {t.date}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700/60 text-slate-200 text-[11px] font-medium">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isExpense ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        ></span>
                        {t.category}
                      </span>
                    </td>

                    {/* Notes / Description */}
                    <td className="py-3 px-3 text-slate-200 max-w-xs truncate">
                      {t.notes || <span className="text-slate-500 italic">No description</span>}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-3 text-slate-400 hidden md:table-cell whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <CreditCard className="w-3 h-3 text-slate-500" />
                        {t.payment_method || 'Cash'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 text-right font-semibold whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          isExpense ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {isExpense ? '-' : '+'}
                        {symbol}
                        {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onEdit(t)}
                          title="Edit transaction"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(t.id)}
                          title={deleteConfirmId === t.id ? 'Click again to confirm delete' : 'Delete transaction'}
                          className={`p-1.5 rounded-lg transition ${
                            deleteConfirmId === t.id
                              ? 'bg-rose-500 text-white font-bold text-[10px] px-2'
                              : 'text-slate-400 hover:text-rose-400 hover:bg-slate-700'
                          }`}
                        >
                          {deleteConfirmId === t.id ? 'Confirm?' : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Showing {transactions.length} records</span>
        <span className="text-slate-500">Amounts automatically converted to active currency</span>
      </div>

    </div>
  );
};

export default TransactionList;
