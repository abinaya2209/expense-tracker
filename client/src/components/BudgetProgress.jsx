import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2, AlertCircle, Plus, Edit2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

const BudgetProgress = ({ budgets = [], onBudgetUpdated }) => {
  const { convert, formatAmount, getSymbol, toUSD } = useCurrency();
  const [editingCategory, setEditingCategory] = useState(null);
  const [newLimitInput, setNewLimitInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const symbol = getSymbol();

  const handleEditClick = (b) => {
    setEditingCategory(b.category);
    // show converted limit in input
    const converted = convert(b.limit);
    setNewLimitInput(converted.toString());
  };

  const handleSaveBudget = async (category) => {
    if (!newLimitInput || isNaN(newLimitInput) || Number(newLimitInput) <= 0) return;
    try {
      setIsSaving(true);
      // Convert back to USD for storing
      const usdAmount = toUSD(Number(newLimitInput));
      await api.saveBudget({ category, monthly_limit: usdAmount });
      setEditingCategory(null);
      if (onBudgetUpdated) onBudgetUpdated();
    } catch (err) {
      console.error('Failed to update budget:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-800/80 border border-slate-700/60 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Monthly Category Budgets</h3>
            <p className="text-xs text-slate-400">Monitor spending limits and avoid overspending</p>
          </div>
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs">
          No category budgets configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const spentConverted = convert(b.spent);
            const limitConverted = convert(b.limit);
            const percent = b.percentage || 0;
            const isExceeded = b.isExceeded;
            const isWarning = percent >= 80 && !isExceeded;

            return (
              <div
                key={b.id || b.category}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-xs text-slate-200 truncate">{b.category}</span>
                    
                    {/* Status Badge */}
                    {isExceeded ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertCircle className="w-2.5 h-2.5" /> Exceeded!
                      </span>
                    ) : isWarning ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertTriangle className="w-2.5 h-2.5" /> {percent}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Safe ({percent}%)
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden my-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeded
                          ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                          : isWarning
                          ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                          : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                      }`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    ></div>
                  </div>

                  {/* Numbers Breakdown */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span>
                      Spent: <strong className="text-white">{symbol}{spentConverted.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong>
                    </span>
                    <span>
                      Limit: <strong className="text-slate-300">{symbol}{limitConverted.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong>
                    </span>
                  </div>
                </div>

                {/* Inline Edit Budget */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  {editingCategory === b.category ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <span className="text-slate-400 text-xs">{symbol}</span>
                      <input
                        type="number"
                        value={newLimitInput}
                        onChange={(e) => setNewLimitInput(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Limit"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveBudget(b.category)}
                        disabled={isSaving}
                        className="px-2 py-1 bg-emerald-500 text-slate-950 font-semibold rounded text-[11px] hover:bg-emerald-400"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[11px] hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(b)}
                      className="text-slate-400 hover:text-emerald-400 text-[11px] flex items-center gap-1 transition"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Limit
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
