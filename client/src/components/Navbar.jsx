import React, { useState } from 'react';
import { Wallet, Plus, Download, Sparkles, RefreshCw } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const Navbar = ({ onOpenAddModal, onSeedData, isSeeding }) => {
  const { selectedCurrency, setSelectedCurrency, supportedCurrencies, ratesLastUpdated, refreshRates, loadingRates } = useCurrency();
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleExportCSV = () => {
    window.open('/api/export/csv', '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <Wallet className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">Spend<span className="text-emerald-400">Wise</span></span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pro</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Full-Stack Financial Tracker</p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs text-slate-200">
              <span className="text-slate-400 mr-1.5 hidden md:inline">Currency:</span>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-transparent border-none text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                {supportedCurrencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-800 text-white">
                    {c.flag} {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
              <button
                onClick={refreshRates}
                title="Refresh live exchange rates"
                className={`ml-1.5 p-1 text-slate-400 hover:text-emerald-400 transition-colors ${loadingRates ? 'animate-spin text-emerald-400' : ''}`}
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Seed Demo Data Button */}
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              title="Populate with realistic sample transactions"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSeeding ? 'Seeding...' : 'Seed Demo Data'}</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              title="Download transactions spreadsheet"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Add Transaction Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Transaction</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
