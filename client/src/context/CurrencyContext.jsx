import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CurrencyContext = createContext();

const DEFAULT_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' }
];

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [rates, setRates] = useState({ USD: 1.0 });
  const [supportedCurrencies, setSupportedCurrencies] = useState(DEFAULT_CURRENCIES);
  const [loadingRates, setLoadingRates] = useState(true);
  const [ratesLastUpdated, setRatesLastUpdated] = useState(null);

  const loadRates = async () => {
    try {
      setLoadingRates(true);
      const res = await api.getCurrencyRates('USD');
      if (res.success && res.rates) {
        setRates(res.rates);
        if (res.supportedCurrencies) {
          setSupportedCurrencies(res.supportedCurrencies);
        }
        setRatesLastUpdated(res.lastUpdated ? new Date(res.lastUpdated) : new Date());
      }
    } catch (err) {
      console.warn('Failed to load currency rates, fallback active:', err);
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const getSymbol = (currencyCode = selectedCurrency) => {
    const found = supportedCurrencies.find(c => c.code === currencyCode);
    return found ? found.symbol : currencyCode;
  };

  // Convert amount stored in USD to any target currency
  const convert = (amountInUSD, targetCurrency = selectedCurrency) => {
    if (isNaN(amountInUSD)) return 0;
    const rate = rates[targetCurrency] || 1;
    return Number((Number(amountInUSD) * rate).toFixed(2));
  };

  // Convert from any currency back to USD
  const toUSD = (amount, fromCurrency = selectedCurrency) => {
    if (isNaN(amount)) return 0;
    const rate = rates[fromCurrency] || 1;
    return Number((Number(amount) / rate).toFixed(2));
  };

  // Format amount with currency symbol
  const formatAmount = (amountInUSD, targetCurrency = selectedCurrency) => {
    const converted = convert(amountInUSD, targetCurrency);
    const symbol = getSymbol(targetCurrency);
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        rates,
        supportedCurrencies,
        loadingRates,
        ratesLastUpdated,
        convert,
        toUSD,
        formatAmount,
        getSymbol,
        refreshRates: loadRates
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
export default CurrencyContext;
