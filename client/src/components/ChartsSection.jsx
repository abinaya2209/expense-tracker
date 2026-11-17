import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { PieChart as PieIcon, BarChart3, TrendingUp } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const PIE_COLORS = [
  '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', 
  '#eab308', '#06b6d4', '#10b981', '#64748b', '#6366f1'
];

const ChartsSection = ({ trends = [], categoryBreakdown = [], selectedMonth = '' }) => {
  const { convert, getSymbol } = useCurrency();
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'area'
  const symbol = getSymbol();

  // Convert trend amounts according to active currency
  const convertedTrends = trends.map(t => ({
    ...t,
    incomeConverted: convert(t.income),
    expenseConverted: convert(t.expense),
    netConverted: convert(t.net)
  }));

  // Convert category amounts
  const convertedCategories = (categoryBreakdown || []).map((cat, idx) => ({
    ...cat,
    convertedTotal: convert(cat.total),
    color: cat.color || PIE_COLORS[idx % PIE_COLORS.length]
  }));

  // Custom Tooltip for Trend Chart
  const CustomTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs backdrop-blur-md">
          <p className="font-semibold text-slate-200 mb-1.5">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}:
              </span>
              <span className="font-medium text-white">
                {symbol}{Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Category Donut Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }}></span>
            <span className="font-semibold text-white">{data.category}</span>
          </div>
          <p className="text-slate-300">
            Amount: <span className="font-bold text-white">{symbol}{Number(data.convertedTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </p>
          <p className="text-slate-400 mt-0.5">
            Share: <span className="text-emerald-400 font-semibold">{data.percentage}%</span> ({data.count} items)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Monthly Trends Chart (2 columns) */}
      <div className="lg:col-span-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Monthly Cash Flow Trend</h3>
              <p className="text-xs text-slate-400">Income vs. Expense over time</p>
            </div>
          </div>

          {/* Toggle Bar / Area chart */}
          <div className="flex bg-slate-900/60 p-0.5 rounded-lg border border-slate-700/60 text-xs">
            <button
              onClick={() => setChartType('bar')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${chartType === 'bar' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${chartType === 'area' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Area
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 sm:h-72 w-full mt-2">
          {convertedTrends.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
              <span>No trend data available. Add transactions or click "Seed Demo Data".</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={convertedTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.6} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `${symbol}${val}`} />
                  <Tooltip content={<CustomTrendTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="incomeConverted" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="expenseConverted" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              ) : (
                <AreaChart data={convertedTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.6} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `${symbol}${val}`} />
                  <Tooltip content={<CustomTrendTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="incomeConverted" name="Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" />
                  <Area type="monotone" dataKey="expenseConverted" name="Expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. Category Spending Breakdown (1 column) */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/60 p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Category Breakdown</h3>
              <p className="text-xs text-slate-400">Expense distribution</p>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="h-52 w-full relative flex items-center justify-center">
          {convertedCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-slate-500 text-xs">
              <PieIcon className="w-8 h-8 mb-2 opacity-50" />
              <span>No expense records found.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={convertedCategories}
                  dataKey="convertedTotal"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {convertedCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1e293b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Legend List */}
        <div className="mt-3 max-h-32 overflow-y-auto pr-1 space-y-1.5 text-xs">
          {convertedCategories.slice(0, 5).map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }}></span>
                <span className="truncate">{cat.category}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="text-white">{symbol}{Number(cat.convertedTotal).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                <span className="text-slate-400 text-[11px] w-9 text-right font-normal">({cat.percentage}%)</span>
              </div>
            </div>
          ))}
          {convertedCategories.length > 5 && (
            <p className="text-[11px] text-center text-slate-500 pt-1">
              + {convertedCategories.length - 5} more categories
            </p>
          )}
        </div>

      </div>

    </div>
  );
};

export default ChartsSection;
