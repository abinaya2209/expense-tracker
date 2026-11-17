import React, { useState } from 'react';
import { ArrowRightLeft, Coins, Globe2, Sparkles } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const CurrencyConverter = () => {
  const { supportedCurrencies, rates, getSymbol, ratesLastUpdated } = useCurrency();
  const [amount, setAmount] = useState('100');
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('EUR');

  const fromRate = rates[fromCurr] || 1;
  const toRate = rates[toCurr] || 1;

  // Convert: (amount / fromRate) * toRate
  const numAmount = parseFloat(amount) || 0;
  const convertedValue = (numAmount / fromRate) * toRate;
  const singleUnitRate = (1 / fromRate) * toRate;

  const handleSwap = () => {
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  return (
    <div className="rounded-2xl bg-slate-800/80 border border-slate-700/60 p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Live Currency Converter</h3>
              <p className="text-xs text-slate-400">Real-time global exchange rates</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Globe2 className="w-2.5 h-2.5" /> Live API
          </span>
        </div>

        {/* Amount Input */}
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Enter Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">
              {getSymbol(fromCurr)}
            </span>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Currency Pickers & Swap */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center mb-4">
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">From</label>
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {supportedCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleSwap}
              title="Swap currencies"
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-600/40"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 mb-1">To</label>
            <select
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {supportedCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversion Result Card */}
        <div className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 mb-0.5">
            {numAmount.toLocaleString()} {fromCurr} =
          </div>
          <div className="text-xl font-bold text-white tracking-tight">
            {getSymbol(toCurr)}
            {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs font-normal text-sky-400 ml-1.5">{toCurr}</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            1 {fromCurr} = {singleUnitRate.toFixed(4)} {toCurr}
          </div>
        </div>
      </div>

      {ratesLastUpdated && (
        <div className="mt-3 text-[10px] text-slate-500 text-right">
          Rates updated: {ratesLastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
