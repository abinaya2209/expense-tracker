import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, DollarSign, PiggyBank, CreditCard } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const SummaryCards = ({ summary = {}, isLoading = false }) => {
  const { formatAmount } = useCurrency();

  const {
    totalIncome = 0,
    totalExpenses = 0,
    netSavings = 0,
    savingsRate = 0,
    totalTransactions = 0,
    comparison = null
  } = summary;

  const isNetPositive = netSavings >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Net Balance */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-850/80 border border-slate-700/60 p-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Net Balance</span>
          <div className={`p-2 rounded-xl ${isNetPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {isLoading ? <div className="h-8 w-28 bg-slate-700 animate-pulse rounded"></div> : formatAmount(netSavings)}
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-400">
          <span className={`inline-flex items-center font-medium mr-1.5 ${isNetPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isNetPositive ? '+' : ''}{savingsRate}%
          </span>
          <span>net savings of income</span>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 2. Total Income */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-850/80 border border-slate-700/60 p-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Income</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-emerald-400 tracking-tight">
          {isLoading ? <div className="h-8 w-28 bg-slate-700 animate-pulse rounded"></div> : formatAmount(totalIncome)}
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-400">
          {comparison && comparison.incomeChangePercent !== undefined ? (
            <span className={`inline-flex items-center font-medium mr-1.5 ${comparison.incomeChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {comparison.incomeChangePercent >= 0 ? '+' : ''}{comparison.incomeChangePercent}%
            </span>
          ) : (
            <span className="text-slate-500 mr-1.5">•</span>
          )}
          <span>vs previous month</span>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 3. Total Expenses */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-850/80 border border-slate-700/60 p-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Expenses</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-rose-400 tracking-tight">
          {isLoading ? <div className="h-8 w-28 bg-slate-700 animate-pulse rounded"></div> : formatAmount(totalExpenses)}
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-400">
          {comparison && comparison.expenseChangePercent !== undefined ? (
            <span className={`inline-flex items-center font-medium mr-1.5 ${comparison.expenseChangePercent <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {comparison.expenseChangePercent > 0 ? '+' : ''}{comparison.expenseChangePercent}%
            </span>
          ) : (
            <span className="text-slate-500 mr-1.5">•</span>
          )}
          <span>vs previous month</span>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 4. Savings Rate & Transactions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-850/80 border border-slate-700/60 p-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Savings Rate</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
          {isLoading ? (
            <div className="h-8 w-20 bg-slate-700 animate-pulse rounded"></div>
          ) : (
            <>
              <span>{savingsRate}%</span>
              <span className="text-xs text-slate-400 font-normal">({totalTransactions} records)</span>
            </>
          )}
        </div>
        {/* Visual Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${savingsRate >= 30 ? 'bg-emerald-400' : savingsRate >= 15 ? 'bg-amber-400' : 'bg-rose-400'}`}
              style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

    </div>
  );
};

export default SummaryCards;
