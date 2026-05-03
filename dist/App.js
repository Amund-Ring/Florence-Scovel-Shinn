/* ─── ROOT APP ─── */
function App() {
  const [quotes, setQuotes] = usePersisted('fss_quotes', []);
  const [quotesVersion, setQuotesVersion] = usePersisted('fss_version', 0);
  const [todaySlots, setTodaySlots] = usePersisted('fss_today', []);
  const [darkMode, setDarkMode] = usePersisted('fss_dark', false);
  const [tab, setTab] = React.useState('today');
  const [focusMode, setFocusMode] = React.useState(null);
  const [focusBg, setFocusBg] = React.useState(null);
  const [slotPicker, setSlotPicker] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 600);

  // Still loading only if we have no quotes yet (first visit)
  const [loading, setLoading] = React.useState(quotes.length === 0);
  const activeTheme = darkMode ? THEMES.night : THEMES.ivory;

  // Always fetch quotes.json to check the version number.
  // If the version matches what's stored, use localStorage as-is.
  // If it differs (quotes edited/added/removed), merge: update quote content
  // but preserve user fields (is_favorite, triage, times_shown, last_shown).
  React.useEffect(() => {
    fetch('./quotes.json').then(r => r.json()).then(data => {
      const newVersion = data.version ?? 1;
      if (quotes.length > 0 && quotesVersion === newVersion) {
        setLoading(false);
        return;
      }
      const storedMap = Object.fromEntries(quotes.map(q => [q.id, q]));
      const merged = data.quotes.map(q => {
        const stored = storedMap[q.id];
        if (!stored) return q;
        return {
          ...q,
          is_favorite: stored.is_favorite ?? false,
          triage: stored.triage ?? null,
          times_shown: stored.times_shown ?? 0,
          last_shown: stored.last_shown ?? null
        };
      });
      setQuotes(merged);
      setQuotesVersion(newVersion);
      if (todaySlots.length === 0) {
        const s1 = pickQuote(merged, []);
        const s2 = pickQuote(merged, [s1.id]);
        const s3 = pickQuote(merged, [s1.id, s2.id]);
        setTodaySlots([{
          id: s1.id,
          locked: false
        }, {
          id: s2.id,
          locked: false
        }, {
          id: s3.id,
          locked: false
        }]);
      } else {
        // Replace any today slots whose quote was removed from the list
        const mergedIds = new Set(merged.map(q => q.id));
        if (todaySlots.some(s => !mergedIds.has(s.id))) {
          const valid = todaySlots.filter(s => mergedIds.has(s.id));
          const newSlots = [...valid];
          while (newSlots.length < 3) {
            const q = pickQuote(merged, newSlots.map(s => s.id));
            newSlots.push({
              id: q.id,
              locked: false
            });
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

  /* ── Quote slot handlers ── */
  const handleLock = slotIdx => {
    setTodaySlots(slots => slots.map((s, i) => i === slotIdx ? {
      ...s,
      locked: !s.locked
    } : s));
  };
  const handleRefreshSlot = slotIdx => {
    const exclude = todaySlots.map(s => s.id).filter((_, i) => i !== slotIdx);
    const newQ = pickQuote(quotes, exclude);
    setTodaySlots(slots => slots.map((s, i) => i === slotIdx ? {
      ...s,
      id: newQ.id
    } : s));
    setQuotes(qs => qs.map(q => q.id === newQ.id ? {
      ...q,
      times_shown: q.times_shown + 1,
      last_shown: new Date().toDateString()
    } : q));
  };
  const handleRefreshAll = () => {
    const newSlots = [...todaySlots];
    const lockedIds = todaySlots.filter(s => s.locked).map(s => s.id);
    for (let i = 0; i < newSlots.length; i++) {
      if (newSlots[i].locked) continue;
      const alreadyPicked = newSlots.slice(0, i).filter((_, j) => !todaySlots[j].locked).map(s => s.id);
      const newQ = pickQuote(quotes, [...lockedIds, ...alreadyPicked]);
      newSlots[i] = {
        ...newSlots[i],
        id: newQ.id
      };
      setQuotes(qs => qs.map(q => q.id === newQ.id ? {
        ...q,
        times_shown: q.times_shown + 1,
        last_shown: new Date().toDateString()
      } : q));
    }
    setTodaySlots(newSlots);
  };
  const handleFavorite = qId => {
    setQuotes(qs => qs.map(q => q.id === qId ? {
      ...q,
      is_favorite: !q.is_favorite
    } : q));
  };
  const handleTriage = (qId, status) => {
    setQuotes(qs => qs.map(q => q.id === qId ? {
      ...q,
      triage: q.triage === status ? null : status
    } : q));
  };
  const handleAssignSlot = slotIdx => {
    if (!slotPicker) return;
    setTodaySlots(slots => slots.map((s, i) => i === slotIdx ? {
      ...s,
      id: slotPicker.id
    } : s));
    setQuotes(qs => qs.map(q => q.id === slotPicker.id ? {
      ...q,
      times_shown: q.times_shown + 1,
      last_shown: new Date().toDateString()
    } : q));
    setSlotPicker(null);
  };

  /* ── Dark mode toggle ── */
  const handleToggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) window.location.reload();
  };

  /* ── Focus mode ── */
  const openTodayFocus = startIdx => {
    const todayFull = todaySlots.map(tq => quotes.find(q => q.id === tq.id)).filter(Boolean);
    setFocusMode({
      quotes: todayFull,
      startIdx
    });
  };
  const openLibFocus = startIdx => setFocusMode({
    quotes,
    startIdx
  });
  const openFavFocus = (filteredQuotes, startIdx) => setFocusMode({
    quotes: filteredQuotes,
    startIdx
  });

  /* ── Shared screen content ── */
  const screens = /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: isMobile ? 0 : 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'hidden',
      position: 'relative'
    }
  }, loading && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: activeTheme.textSecondary,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14
    }
  }, "Loading\u2026"), !loading && tab === 'today' && /*#__PURE__*/React.createElement(TodayScreen, {
    todayQuotes: todaySlots,
    allQuotes: quotes,
    onLock: handleLock,
    onRefreshSlot: handleRefreshSlot,
    onRefreshAll: handleRefreshAll,
    onFocus: openTodayFocus,
    darkMode: darkMode,
    onToggleDark: handleToggleDark
  }), !loading && tab === 'library' && /*#__PURE__*/React.createElement(LibraryScreen, {
    allQuotes: quotes,
    todayQuotes: todaySlots,
    onFavorite: handleFavorite,
    onSetToday: q => setSlotPicker(q),
    onTriage: handleTriage
  }), !loading && tab === 'favorites' && /*#__PURE__*/React.createElement(FavoritesScreen, {
    allQuotes: quotes,
    todayQuotes: todaySlots,
    onFavorite: handleFavorite,
    onSetToday: q => setSlotPicker(q),
    onFocus: openFavFocus,
    onTriage: handleTriage
  }), focusMode && /*#__PURE__*/React.createElement(FocusMode, {
    quotes: focusMode.quotes,
    startIdx: focusMode.startIdx,
    onClose: () => {
      setFocusMode(null);
      setFocusBg(null);
    },
    onFavorite: handleFavorite,
    allQuotes: quotes,
    isMobile: isMobile,
    onBgChange: isMobile ? null : setFocusBg
  }), slotPicker && /*#__PURE__*/React.createElement(SlotPicker, {
    quote: slotPicker,
    todayQuotes: todaySlots,
    allQuotes: quotes,
    onAssign: handleAssignSlot,
    onClose: () => setSlotPicker(null)
  })), !focusMode && /*#__PURE__*/React.createElement(TabBar, {
    active: tab,
    onTab: setTab
  }));

  /* ── Mobile: full-screen, no device frame ── */
  if (isMobile) {
    return /*#__PURE__*/React.createElement(ThemeCtx.Provider, {
      value: activeTheme
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'env(safe-area-inset-top)',
        background: activeTheme.bg,
        zIndex: 1000
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: activeTheme.bg,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.3s'
      }
    }, screens));
  }

  /* ── Desktop: iOS device frame ── */
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '40px 20px'
    }
  }, /*#__PURE__*/React.createElement(ThemeCtx.Provider, {
    value: activeTheme
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 390,
    height: 844,
    dark: darkMode,
    bg: focusBg || activeTheme.bg
  }, screens)));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));