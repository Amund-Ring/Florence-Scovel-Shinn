/* ─── ROOT APP ─── */
function App() {
  const [quotes, setQuotes]       = React.useState([]);
  const [loading, setLoading]     = React.useState(true);
  const [todaySlots, setTodaySlots] = React.useState([]);
  const [tab, setTab]             = React.useState('today');
  const [focusMode, setFocusMode] = React.useState(null);
  const [slotPicker, setSlotPicker] = React.useState(null);
  const [darkMode, setDarkMode]   = React.useState(false);
  const [isMobile, setIsMobile]   = React.useState(window.innerWidth <= 600);

  const activeTheme = darkMode ? THEMES.night : THEMES.ivory;

  // Load quotes from quotes.json and pick 3 random ones for today
  React.useEffect(() => {
    fetch('./quotes.json')
      .then(r => r.json())
      .then(data => {
        const qs = data.quotes;
        setQuotes(qs);
        const s1 = pickQuote(qs, []);
        const s2 = pickQuote(qs, [s1.id]);
        const s3 = pickQuote(qs, [s1.id, s2.id]);
        setTodaySlots([
          { id: s1.id, locked: false },
          { id: s2.id, locked: false },
          { id: s3.id, locked: false },
        ]);
        setLoading(false);
      });
  }, []);

  // Sync body background with theme on mobile
  React.useEffect(() => {
    document.body.style.background = isMobile ? activeTheme.bg : '#1c1917';
  }, [isMobile, activeTheme]);

  // Respond to window resize for mobile/desktop switch
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  /* ── Quote slot handlers ── */
  const handleLock = (slotIdx) => {
    setTodaySlots(slots => slots.map((s, i) => i === slotIdx ? { ...s, locked: !s.locked } : s));
  };

  const handleRefreshSlot = (slotIdx) => {
    const exclude = todaySlots.map(s => s.id).filter((_, i) => i !== slotIdx);
    const newQ = pickQuote(quotes, exclude);
    setTodaySlots(slots => slots.map((s, i) => i === slotIdx ? { ...s, id: newQ.id } : s));
    setQuotes(qs => qs.map(q => q.id === newQ.id ? { ...q, times_shown: q.times_shown + 1, last_shown: new Date().toDateString() } : q));
  };

  const handleRefreshAll = () => {
    const newSlots = [...todaySlots];
    const lockedIds = todaySlots.filter(s => s.locked).map(s => s.id);
    for (let i = 0; i < newSlots.length; i++) {
      if (newSlots[i].locked) continue;
      const alreadyPicked = newSlots.slice(0, i).filter((_, j) => !todaySlots[j].locked).map(s => s.id);
      const newQ = pickQuote(quotes, [...lockedIds, ...alreadyPicked]);
      newSlots[i] = { ...newSlots[i], id: newQ.id };
      setQuotes(qs => qs.map(q => q.id === newQ.id ? { ...q, times_shown: q.times_shown + 1, last_shown: new Date().toDateString() } : q));
    }
    setTodaySlots(newSlots);
  };

  const handleFavorite = (qId) => {
    setQuotes(qs => qs.map(q => q.id === qId ? { ...q, is_favorite: !q.is_favorite } : q));
  };

  const handleAssignSlot = (slotIdx) => {
    if (!slotPicker) return;
    setTodaySlots(slots => slots.map((s, i) => i === slotIdx ? { ...s, id: slotPicker.id } : s));
    setQuotes(qs => qs.map(q => q.id === slotPicker.id ? { ...q, times_shown: q.times_shown + 1, last_shown: new Date().toDateString() } : q));
    setSlotPicker(null);
  };

  /* ── Focus mode helpers ── */
  const openTodayFocus = (startIdx) => {
    const todayFull = todaySlots.map(tq => quotes.find(q => q.id === tq.id)).filter(Boolean);
    setFocusMode({ quotes: todayFull, startIdx });
  };
  const openLibFocus = (startIdx) => setFocusMode({ quotes, startIdx });

  /* ── Shared screen content ── */
  const screens = (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', paddingTop: isMobile ? 0 : 50 }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: activeTheme.textSecondary, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
            Loading…
          </div>
        )}
        {!loading && tab === 'today' && (
          <TodayScreen
            todayQuotes={todaySlots} allQuotes={quotes}
            onLock={handleLock} onRefreshSlot={handleRefreshSlot}
            onRefreshAll={handleRefreshAll} onFocus={openTodayFocus}
            darkMode={darkMode} onToggleDark={() => setDarkMode(v => !v)}
          />
        )}
        {!loading && tab === 'library' && (
          <LibraryScreen allQuotes={quotes} todayQuotes={todaySlots}
            onFavorite={handleFavorite} onFocus={openLibFocus}
            onSetToday={(q) => setSlotPicker(q)} />
        )}
        {!loading && tab === 'favorites' && (
          <FavoritesScreen allQuotes={quotes} todayQuotes={todaySlots}
            onFavorite={handleFavorite} onFocus={openLibFocus}
            onSetToday={(q) => setSlotPicker(q)} />
        )}
        {focusMode && (
          <FocusMode quotes={focusMode.quotes} startIdx={focusMode.startIdx}
            onClose={() => setFocusMode(null)} onFavorite={handleFavorite} allQuotes={quotes} />
        )}
        {slotPicker && (
          <SlotPicker quote={slotPicker} todayQuotes={todaySlots} allQuotes={quotes}
            onAssign={handleAssignSlot} onClose={() => setSlotPicker(null)} />
        )}
      </div>
      {!focusMode && <TabBar active={tab} onTab={setTab} />}
    </div>
  );

  /* ── Mobile: full-screen, no device frame ── */
  if (isMobile) {
    return (
      <ThemeCtx.Provider value={activeTheme}>
        <div style={{
          position: 'fixed', inset: 0,
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          background: activeTheme.bg,
          display: 'flex', flexDirection: 'column',
          transition: 'background 0.3s',
        }}>
          {screens}
        </div>
      </ThemeCtx.Provider>
    );
  }

  /* ── Desktop: iOS device frame ── */
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 20px' }}>
      <ThemeCtx.Provider value={activeTheme}>
        <IOSDevice width={390} height={844} dark={darkMode}>
          {screens}
        </IOSDevice>
      </ThemeCtx.Provider>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
