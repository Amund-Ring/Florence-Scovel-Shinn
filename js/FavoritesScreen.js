/* ─── TRIAGE SECTION (Saved screen) ─── */
function TriageItem({ quote, onClear }) {
  const t = useTheme();
  const isRemove = quote.triage === 'remove';
  const accentColor = isRemove ? 'oklch(52% 0.16 20)' : 'oklch(58% 0.13 60)';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: `1px solid ${t.borderSub}` }}>
      <div style={{ width: 3, background: accentColor, borderRadius: 2, alignSelf: 'stretch', minHeight: 24, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 13.5, lineHeight: 1.5,
          color: isRemove ? accentColor : t.textPrimary,
          textDecoration: isRemove ? 'line-through' : 'none',
          opacity: 0.8, marginBottom: 3,
        }}>{quote.quote}</p>
        <span style={{ fontSize: 10, color: t.textMuted }}>{quote.book_title}</span>
      </div>
      <button onClick={onClear} title="Clear flag" style={{
        flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
        color: t.textMuted, padding: '2px 6px', fontSize: 18, lineHeight: 1,
      }}>×</button>
    </div>
  );
}

function TriageSection({ allQuotes, onTriage }) {
  const t = useTheme();
  const removeList = allQuotes.filter(q => q.triage === 'remove');
  const editList   = allQuotes.filter(q => q.triage === 'edit');
  if (removeList.length === 0 && editList.length === 0) return null;

  const subHeader = (label, color, count) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '12px 0 6px',
    }}>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <span style={{ fontSize: 9, color: t.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{count}</span>
    </div>
  );

  return (
    <div style={{ marginTop: 28, paddingTop: 20, borderTop: `2px solid ${t.border}` }}>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: t.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>Triage</span>
      {removeList.length > 0 && (
        <div>
          {subHeader('For removal', 'oklch(52% 0.16 20)', removeList.length)}
          {removeList.map((q, i) => (
            <TriageItem key={q.id} quote={q} onClear={() => onTriage(q.id, 'remove')} />
          ))}
        </div>
      )}
      {editList.length > 0 && (
        <div>
          {subHeader('For editing', 'oklch(58% 0.13 60)', editList.length)}
          {editList.map((q, i) => (
            <TriageItem key={q.id} quote={q} onClear={() => onTriage(q.id, 'edit')} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── FAVORITES SCREEN ─── */
function FavoritesScreen({ allQuotes, todayQuotes, onFavorite, onFocus, onSetToday, onTriage }) {
  const t = useTheme();
  const S = makeS(t);
  const [sort, setSort]               = usePersisted('fss_fav_sort', 'date');
  const [activeCat, setActiveCat]     = usePersisted('fss_fav_cat', 'All');
  const [showControls, setShowControls] = React.useState(false);
  const [showSearch, setShowSearch]   = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const kbHeight = useKeyboardHeight();

  const toggleSearch = () => {
    setShowSearch(v => { if (v) setSearchQuery(''); return !v; });
  };

  const favs = allQuotes.filter(q => q.is_favorite);
  const triaged = allQuotes.filter(q => q.triage === 'remove' || q.triage === 'edit');
  const hasActive = activeCat !== 'All' || sort !== 'date';
  let displayed = activeCat === 'All' ? favs : favs.filter(q => q.category === activeCat);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayed = displayed.filter(quote => quote.quote.toLowerCase().includes(q));
  }
  const sorted = sortQuotes(displayed, sort, allQuotes);

  const grouped = sort === 'cat'
    ? Object.entries(sorted.reduce((acc, q) => { (acc[q.category] = acc[q.category] || []).push(q); return acc; }, {}))
    : null;

  if (favs.length === 0 && triaged.length === 0) {
    const iconBg    = t.dark ? t.bgCard    : 'oklch(96% 0.04 20)';
    const iconBorder = t.dark ? t.border   : 'transparent';
    const iconColor = 'oklch(62% 0.14 20)';
    return (
      <div style={S.screen}>
        <div style={S.header}><span style={S.title}>Saved</span></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: iconBg, border: `1px solid ${iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
            <IconHeart />
          </div>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: t.textPrimary, textAlign: 'center' }}>No saved quotes yet</p>
          <p style={{ fontSize: 13, color: t.textSecondary, textAlign: 'center', lineHeight: 1.6 }}>Tap the ♡ on any quote in the Library to save it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.screen}>
      <div style={S.header}>
        <span style={S.title}>Saved</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <SearchBtn onClick={toggleSearch} active={showSearch || !!searchQuery.trim()} />
          <ControlsBtn onClick={() => setShowControls(v => !v)} active={showControls || hasActive} />
        </div>
      </div>
      {showSearch && <SearchBar value={searchQuery} onChange={setSearchQuery} />}
      {showControls && <ControlsPanel activeCat={activeCat} onCat={setActiveCat} activeSort={sort} onSort={setSort} sortOpts={SORT_OPTS_FAVORITES} />}
      <div className="list-scroll" style={{ ...S.body, gap: 0, padding: '0 13px 0 16px', paddingBottom: kbHeight > 0 ? kbHeight : 8 }}>
        {favs.length > 0 && (grouped ? (
          grouped.map(([cat, items]) => (
            <div key={cat}>
              <CatSectionHeader cat={cat} />
              {items.map((quote, i) => (
                <LibraryItem key={quote.id} quote={quote} todayQuotes={todayQuotes}
                  onFavorite={() => onFavorite(quote.id)}
                  onSetToday={() => onSetToday(quote)}
                  onTriage={onTriage}
                  onTap={() => onFocus(sorted, sorted.findIndex(q => q.id === quote.id))}
                  isLast={i === items.length - 1} />
              ))}
            </div>
          ))
        ) : (
          sorted.map((quote, i) => (
            <LibraryItem key={quote.id} quote={quote} todayQuotes={todayQuotes}
              onFavorite={() => onFavorite(quote.id)}
              onSetToday={() => onSetToday(quote)}
              onTriage={onTriage}
              onTap={() => onFocus(sorted, i)}
              isLast={i === sorted.length - 1} />
          ))
        ))}
        <TriageSection allQuotes={allQuotes} onTriage={onTriage} />
      </div>
    </div>
  );
}
