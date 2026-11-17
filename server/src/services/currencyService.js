const axios = require('axios');

// Default fallback rates (Base: USD)
const FALLBACK_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 84.50,
  CAD: 1.38,
  AUD: 1.52,
  JPY: 153.20,
  SGD: 1.32,
  CHF: 0.88,
  CNY: 7.24
};

const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' }
];

let rateCache = {
  rates: FALLBACK_RATES,
  base: 'USD',
  lastUpdated: null,
  source: 'fallback'
};

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

const fetchLiveRates = async (base = 'USD') => {
  const now = Date.now();
  if (rateCache.lastUpdated && now - rateCache.lastUpdated < CACHE_DURATION_MS && rateCache.base === base) {
    return rateCache;
  }

  try {
    const response = await axios.get(`https://open.er-api.com/v6/latest/${base}`, {
      timeout: 5000
    });

    if (response.data && response.data.result === 'success' && response.data.rates) {
      rateCache = {
        rates: response.data.rates,
        base: response.data.base_code || base,
        lastUpdated: now,
        source: 'live-api'
      };
      return rateCache;
    }
  } catch (error) {
    console.warn('Currency API request failed, using cached/fallback rates:', error.message);
  }

  // Fallback if API fails
  if (!rateCache.lastUpdated) {
    rateCache.lastUpdated = now;
  }
  return rateCache;
};

const convertAmount = (amount, fromCurrency, toCurrency, rates) => {
  if (fromCurrency === toCurrency) return amount;
  const rateFrom = rates[fromCurrency] || 1;
  const rateTo = rates[toCurrency] || 1;
  // Convert from source to USD then USD to destination
  const inUSD = amount / rateFrom;
  return Number((inUSD * rateTo).toFixed(2));
};

module.exports = {
  SUPPORTED_CURRENCIES,
  FALLBACK_RATES,
  fetchLiveRates,
  convertAmount
};
