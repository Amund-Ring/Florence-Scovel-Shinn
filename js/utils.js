/* ─── FILTER / SORT OPTIONS ─── */
const ALL_CATS = ['All', 'Faith', 'Abundance', 'Mindset', 'Love'];

// Library uses "Order in Book" because JSON order = book order
const SORT_OPTS_LIBRARY = [
  { id: 'date',  label: 'Order in Book' },
  { id: 'alpha', label: 'A–Z' },
  { id: 'cat',   label: 'By Category' },
];

// Favorites uses "Date Added" because order = when the user saved it
const SORT_OPTS_FAVORITES = [
  { id: 'date',  label: 'Date Added' },
  { id: 'alpha', label: 'A–Z' },
  { id: 'cat',   label: 'By Category' },
];

const CAT_OPTS = ALL_CATS.map(c => ({ id: c, label: c }));

/* ─── PERSISTENCE HOOK ─── */
// Drop-in replacement for React.useState that reads/writes localStorage.
function usePersisted(key, defaultValue) {
  const [value, setValue] = React.useState(function() {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch(e) {
      return defaultValue;
    }
  });

  function set(next) {
    setValue(function(prev) {
      const newVal = typeof next === 'function' ? next(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(newVal)); } catch(e) {}
      return newVal;
    });
  }

  return [value, set];
}

/* ─── WEIGHTED RANDOM QUOTE PICKER ─── */
// Quotes shown less often are more likely to be picked.
// Quotes already shown today are heavily penalised.
function pickQuote(quotes, excludeIds) {
  const pool = quotes.filter(q => !excludeIds.includes(q.id));
  if (!pool.length) return quotes.find(q => !excludeIds.includes(q.id)) || quotes[0];
  const today = new Date().toDateString();
  const weights = pool.map(q => {
    let w = 1 / (q.times_shown + 1);
    if (q.last_shown === today) w *= 0.1;
    return w;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/* ─── SORT HELPER ─── */
function sortQuotes(list, sort, allQuotes) {
  if (sort === 'alpha') return [...list].sort((a, b) => a.quote.localeCompare(b.quote));
  if (sort === 'date')  return [...list].sort((a, b) => allQuotes.findIndex(q => q.id === a.id) - allQuotes.findIndex(q => q.id === b.id));
  // 'cat' — sort by category then alphabetically within
  return [...list].sort((a, b) => a.category !== b.category ? a.category.localeCompare(b.category) : a.quote.localeCompare(b.quote));
}