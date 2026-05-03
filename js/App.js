/* ─── ROOT APP ─── */
function App() {
  const [rawQuotes, setRawQuotes]   = React.useState([]);
  const [userData, setUserData]     = usePersisted('fss_userdata', {});
  const [todaySlots, setTodaySlots] = usePersisted('fss_today', []);
  const [darkMode, setDarkMode]     = usePersisted('fss_dark', false);

  const [tab, setTab]               = React.useState('today');
  const [focusMode, setFocusMode]   = React.useState(null);
  const [focusBg, setFocusBg]       = React.useState(null);
  const [slotPicker, setSlotPicker] = React.useState(null);
  const [isMobile, setIsMobile]     = React.useState(window.innerWidth <= 600);
  const [loading, setLoading]       = React.useState(true);

  const activeTheme = darkMode ? THEMES.night : THEMES.ivory;

  // Merge raw quotes from JSON with persisted user data
  const quotes = rawQuotes.map(q => ({
    ...q,
    is_favorite: userData[q.id]?.is_favorite ?? false,
    triage:      userData[q.id]?.triage      ?? null,
    times_shown: userData[q.id]?.times_shown ?? 0,
    last_shown:  userData[q.id]?.last_shown  ?? null,
  }));

  // Fetch quotes.json on every load — it's small and browser-cached.
  // localStorage stores only user data (favorites, triage, times_shown).
  React.useEffect(() => {
    // Clean up old storage keys from the previous full-quotes approach
    localStorage.removeItem('fss_quotes');
    localStorage.removeItem('fss_version');

    fetch('./quotes.json')
      .then(r => r.json())
      .then(data => {
        setRawQuotes(data.quotes);

        const merged = data.quotes.map(q => ({
          ...q,
          times_shown: userData[q.id]?.times_shown ?? 0,
          last_shown:  userData[q.id]?.last_shown  ?? null,
        }));

        if (todaySlots.length === 0) {
          const s1 = pickQuote(merged, []);
          const s2 = pickQuote(merged, [s1.id]);
          const s3 = pickQuote(merged, [s1.id, s2.id]);
          setTodaySlots([
            { id: s1.id, locked: false },
            { id: s2.id, locked: false },
            { id: s3.id, locked: false },
          ]);
        } else {
          // Replace any today slots whose quote was removed from the JSON
          const ids = new Set(data.quotes.map(q => q.id));
          if (todaySlots.some(s => !ids.has(s.id))) {
            const valid = todaySlots.filter(s => ids.has(s.id));
            const newSlots = [...valid];
            while (newSlots.length < 3) {
              const q = pickQuote(merged, newSlots.map(s => s.id));
              newSlots.push({ id: q.id, locked: false });
            }
            setTodaySlots(newSlots);
          }
        }

        setLoading(false);
      });
  }, []);

  // Sync body background, theme-color, and colorScheme with current theme.
  // colorScheme is the key for black-translucent status bar: iOS reads this
  // property from the native rendering pipeline and updates the overlay tint dynamically.
  React.useEffect(() => {
    document.body.style.background = isMobile ? activeTheme.bg : '#1c1917';
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', darkMode ? '#1c1917' : '#faf8f5');
      meta.remove();
      document.head.appendChild(meta);
    }
  }, [isMobile, activeTheme, darkMode]);

  // Respond to viewport resize
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  /* ── User data helper ── */
  const updateShown = (qId) => {
    setUserData(ud => ({
      ...ud,
      [qId]: { ...(ud[qId] || {}), times_shown: (ud[qId]?.times_shown ?? 0) + 1, last_shown: new Date().toDateString() },
    }));
  };

  /* ── Quote slot handlers ── */
  const handleLock = (slotIdx) => {
    setTodaySlots(slots => slots.map((s, i) => i === slotIdx ? { ...s, locked: !s.locked } : s));
  };

  const handleRefreshSlot = (slotIdx) => {
    const exclude = todaySlots.map(s => s.id).filter((_, i) => i !== slotIdx);
    const newQ = pickQuote(quotes, exclude);
    setTodaySlots(slots => slots.map((s, i) => i === slotIdx ? { ...s, id: newQ.id } : s));
    updateShown(newQ.id);
  };

  const handleRefreshAll = () => {
    const newSlots = [...todaySlots];
    const lockedIds = todaySlots.filter(s => s.locked).map(s => s.id);
    const shownIds = [];
    for (let i = 0; i < newSlots.length; i++) {
      if (newSlots[i].locked) continue;
      const alreadyPicked = newSlots.slice(0, i).filter((_, j) => !todaySlots[j].locked).map(s => s.id);
      const newQ = pickQuote(quotes, [...lockedIds, ...alreadyPicked]);
      newSlots[i] = { ...newSlots[i], id: newQ.id };
      shownIds.push(newQ.id);
    }
    setTodaySlots(newSlots);
    setUserData(ud => {
      const next = { ...ud };
      for (const qId of shownIds) {
        next[qId] = { ...(ud[qId] || {}), times_shown: (ud[qId]?.times_shown ?? 0) + 1, last_shown: new Date().toDateString() };
      }
      return next;
    });
  };

  const handleFavorite = (qId) => {
    setUserData(ud => ({
      ...ud,
      [qId]: { ...(ud[qId] || {}), is_favorite: !(ud[qId]?.is_favorite ?? false) },
    }));
  };

  const handleTriage = (qId, status) => {
    setUserData(ud => ({
      ...ud,
      [qId]: { ...(ud[qId] || {}), triage: ud[qId]?.triage === status ? null : status },
    }));
  };

  const handleAssignSlot = (slotIdx) => {
    if (!slotPicker) return;
    setTodaySlots(slots => slots.map((s, i) => i === slotIdx ? { ...s, id: slotPicker.id } : s));
    updateShown(slotPicker.id);
    setSlotPicker(null);
  };

  /* ── Dark mode toggle ── */
  const handleToggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    const isStandalone = window.navigator.standalone ||
      window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) window.location.reload();
  };

  /* ── Focus mode ── */
  const openTodayFocus = (startIdx) => {
    const todayFull = todaySlots.map(tq => quotes.find(q => q.id === tq.id)).filter(Boolean);
    setFocusMode({ quotes: todayFull, startIdx });
  };
  const openLibFocus = (startIdx) => setFocusMode({ quotes, startIdx });
  const openFavFocus = (filteredQuotes, startIdx) => setFocusMode({ quotes: filteredQuotes, startIdx });

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
            darkMode={darkMode} onToggleDark={handleToggleDark}
          />
        )}
        {!loading && tab === 'library' && (
          <LibraryScreen allQuotes={quotes} todayQuotes={todaySlots}
            onFavorite={handleFavorite}
            onSetToday={(q) => setSlotPicker(q)}
            onTriage={handleTriage} />
        )}
        {!loading && tab === 'favorites' && (
          <FavoritesScreen allQuotes={quotes} todayQuotes={todaySlots}
            onFavorite={handleFavorite}
            onSetToday={(q) => setSlotPicker(q)}
            onFocus={openFavFocus}
            onTriage={handleTriage} />
        )}
        {focusMode && (
          <FocusMode quotes={focusMode.quotes} startIdx={focusMode.startIdx}
            onClose={() => { setFocusMode(null); setFocusBg(null); }}
            onFavorite={handleFavorite} allQuotes={quotes} isMobile={isMobile}
            onBgChange={isMobile ? null : setFocusBg} />
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
        {/* Instant-color fill behind the status bar — no transition so iOS compositor
            picks up the new color in the same paint frame as the theme toggle */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: 'env(safe-area-inset-top)',
          background: activeTheme.bg,
          zIndex: 1000,
        }} />
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
        <IOSDevice width={390} height={844} dark={darkMode} bg={focusBg || activeTheme.bg}>
          {screens}
        </IOSDevice>
      </ThemeCtx.Provider>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
