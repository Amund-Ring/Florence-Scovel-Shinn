/* ─── ADJUSTABLE SIZES ─────────────────────────────────────────────────────
   Change these values to resize UI elements without digging through styles.   */
const HEART_SIZE    = 14;   // px — heart icon in Library/Favorites rows
const CHIP_LABEL    = 9;   // px — "CATEGORY" / "SORT BY" section header text
const CHIP_FONT     = 12;   // px — filter chip button text (All, Faith, A–Z…)
const CHIP_PAD      = '5px 13px';  // vertical horizontal — filter chip padding
/* ─────────────────────────────────────────────────────────────────────────── */

/* ─── FILTER / SORT CONTROLS ─── */
function SearchBtn({ onClick, active }) {
  const t = useTheme();
  return (
    <button onClick={onClick} title="Search" style={{
      width: 34, height: 34, borderRadius: 10,
      border: `1px solid ${active ? t.btnActiveBorder : t.btnBorder}`,
      background: active ? t.btnActiveBg : t.bgCard,
      color: active ? (t.dark ? t.bg : '#fff') : t.textSecondary,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s', flexShrink: 0,
    }}>
      <IconSearch />
    </button>
  );
}

function SearchBar({ value, onChange }) {
  const t = useTheme();
  const inputRef = React.useRef(null);
  React.useEffect(() => { inputRef.current?.focus(); }, []);
  return (
    <div style={{ padding: '8px 16px 10px', borderBottom: `1px solid ${t.border}` }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: t.dark ? 'oklch(28% 0.015 60)' : 'oklch(94% 0.008 60)',
        borderRadius: 10, padding: '7px 12px',
      }}>
        <span style={{ color: t.textMuted, display: 'flex', flexShrink: 0 }}><IconSearch /></span>
        <input
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search quotes…"
          style={{
            flex: 1, border: 'none', background: 'transparent',
            fontFamily: "'DM Sans', sans-serif", fontSize: 15,
            color: t.textPrimary, outline: 'none',
          }}
        />
        {value && (
          <button onClick={() => { onChange(''); inputRef.current?.focus(); }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: t.textMuted, padding: 0, display: 'flex', flexShrink: 0,
          }}><IconX /></button>
        )}
      </div>
    </div>
  );
}

function ControlsBtn({ onClick, active }) {
  const t = useTheme();
  // In dark mode the near-white btnActiveBg is too harsh; use a mid-dark tone instead
  const activeBg    = active ? (t.dark ? t.border    : t.btnActiveBg) : t.bgCard;
  const activeColor = active ? (t.dark ? t.textPrimary : '#fff')       : t.textSecondary;
  const activeBorder = active ? (t.dark ? t.textSecondary : t.btnActiveBorder) : t.btnBorder;
  return (
    <button onClick={onClick} title="Filter &amp; Sort" style={{
      width: 34, height: 34, borderRadius: 10,
      border: `1px solid ${activeBorder}`,
      background: activeBg,
      color: activeColor,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s', flexShrink: 0,
    }}>
      <IconControls active={active} />
    </button>
  );
}

function ScrollChipRow({ label, options, active, onSelect }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <span style={{ fontSize: CHIP_LABEL, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', color: t.textSecondary, padding: '10px 16px 5px', fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 16px 10px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {options.map(opt => (
          <button key={opt.id} onClick={() => onSelect(opt.id)} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: CHIP_FONT, fontWeight: 500,
            padding: CHIP_PAD, borderRadius: 20, flexShrink: 0,
            border: `1px solid ${active === opt.id ? t.btnActiveBorder : t.btnBorder}`,
            background: active === opt.id ? t.btnActiveBg : t.bgCard,
            color: active === opt.id ? (t.dark ? t.bg : '#fff') : t.textSecondary,
            cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>{opt.label}</button>
        ))}
      </div>
    </div>
  );
}

// sortOpts prop lets Library and Favorites pass different label sets
function ControlsPanel({ activeCat, onCat, activeBook, onBook, activeSort, onSort, sortOpts }) {
  const t = useTheme();
  return (
    <div style={{ borderBottom: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ScrollChipRow label="Category" options={CAT_OPTS} active={activeCat} onSelect={onCat} />
      <div style={{ height: 1, background: t.border }} />
      <ScrollChipRow label="Book" options={BOOK_OPTS} active={activeBook} onSelect={onBook} />
      <div style={{ height: 1, background: t.border }} />
      <ScrollChipRow label="Sort by" options={sortOpts} active={activeSort} onSelect={onSort} />
    </div>
  );
}

/* ─── LIBRARY ITEM (shared with FavoritesScreen) ─── */
function LibraryItem({ quote, todayQuotes, onFavorite, onTap, onSetToday, onTriage, isLast }) {
  const t = useTheme();
  const col = getColor(quote.category);
  const [showTriageMenu, setShowTriageMenu] = React.useState(false);
  const longPressTimer = React.useRef(null);

  const startLongPress = (e) => {
    e.preventDefault();
    longPressTimer.current = setTimeout(() => setShowTriageMenu(true), 1200);
  };
  const cancelLongPress = () => {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };
  const handleTriageSelect = (status) => {
    setShowTriageMenu(false);
    onTriage?.(quote.id, status);
  };

  const isRemove = quote.triage === 'remove';
  const isEdit   = quote.triage === 'edit';
  const isTriaged = isRemove || isEdit;
  const triageAccent = isRemove ? 'oklch(52% 0.16 20)' : 'oklch(58% 0.13 60)';

  const quoteTextStyle = {
    fontFamily: "'DM Serif Display', serif", fontSize: 14.5, lineHeight: 1.55,
    fontWeight: 400, textWrap: 'pretty', marginBottom: 5,
    color: isRemove ? triageAccent : t.textPrimary,
    textDecoration: isRemove ? 'line-through' : 'none',
    opacity: isTriaged ? 0.65 : 1,
    transition: 'all 0.2s',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 0',
      borderBottom: isLast ? 'none' : `1px solid ${t.borderSub}`,
      cursor: onTap ? 'pointer' : 'default',
    }} onClick={showTriageMenu ? () => setShowTriageMenu(false) : (onTap || undefined)}>
      <div style={{ width: 3, background: isTriaged ? triageAccent : col.accent, borderRadius: 2, alignSelf: 'stretch', minHeight: 32, flexShrink: 0, marginTop: 3, transition: 'background 0.2s' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="selectable" style={quoteTextStyle}>{quote.quote}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <CatPill category={quote.category} small />
          <span style={{ fontSize: 10, color: t.textMuted }}>· {quote.book_title}</span>
          {isTriaged && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
              color: triageAccent, padding: '1px 5px', borderRadius: 4,
              border: `1px solid ${triageAccent}`, opacity: 0.85,
            }}>{isRemove ? 'Remove' : 'Edit'}</span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, paddingTop: 2, position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onFavorite} style={{
          width: 30, height: 30, borderRadius: 8,
          border: `1px solid ${quote.is_favorite ? 'oklch(62% 0.14 20)' : t.btnBorder}`,
          background: quote.is_favorite ? (t.dark ? `color-mix(in oklch, oklch(58% 0.14 20) 14%, ${t.bgCard})` : 'oklch(96% 0.04 20)') : t.bgCard,
          color: quote.is_favorite ? 'oklch(62% 0.14 20)' : t.textSecondary,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}><IconHeart filled={quote.is_favorite} size={HEART_SIZE} /></button>
        <button
          onPointerDown={startLongPress}
          onPointerUp={cancelLongPress}
          onPointerLeave={cancelLongPress}
          onContextMenu={e => { e.preventDefault(); cancelLongPress(); }}
          onClick={() => { if (!showTriageMenu) onSetToday(); }}
          title="Add to Today · hold 2s to triage"
          style={{
            width: 30, height: 30, borderRadius: 8,
            border: `1px solid ${isTriaged ? triageAccent : t.btnBorder}`,
            background: isTriaged
              ? (t.dark ? `color-mix(in oklch, ${triageAccent} 12%, ${t.bgCard})` : `color-mix(in oklch, ${triageAccent} 8%, ${t.bgCard})`)
              : t.bgCard,
            color: isTriaged ? triageAccent : t.textSecondary,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.2s',
          }}
        >+</button>
        {showTriageMenu && (
          <div style={{
            position: 'absolute', right: 36, top: 0,
            background: t.bgCard, border: `1px solid ${t.border}`,
            borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            zIndex: 20, minWidth: 170, overflow: 'hidden',
          }}>
            <button onClick={() => handleTriageSelect('remove')} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '11px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              border: 'none', borderBottom: `1px solid ${t.border}`,
              background: isRemove ? `color-mix(in oklch, oklch(52% 0.16 20) 8%, ${t.bgCard})` : 'none',
              color: 'oklch(52% 0.16 20)', cursor: 'pointer', fontWeight: isRemove ? 600 : 400,
            }}>{isRemove ? '✕ Clear removal flag' : '✕ Mark for removal'}</button>
            <button onClick={() => handleTriageSelect('edit')} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '11px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              border: 'none', borderBottom: `1px solid ${t.border}`,
              background: isEdit ? `color-mix(in oklch, oklch(58% 0.13 60) 8%, ${t.bgCard})` : 'none',
              color: 'oklch(58% 0.13 60)', cursor: 'pointer', fontWeight: isEdit ? 600 : 400,
            }}>{isEdit ? '✎ Clear edit flag' : '✎ Mark for edit'}</button>
            <button onClick={() => setShowTriageMenu(false)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '11px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              border: 'none', background: 'none', color: t.textSecondary, cursor: 'pointer',
            }}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CATEGORY SECTION HEADER (shared between Library and Favorites) ─── */
function CatSectionHeader({ cat }) {
  const col = getColor(cat);
  return (
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', color: col.text, padding: '14px 0 8px', borderBottom: `2px solid ${col.accent}`, marginBottom: 2 }}>{cat}</div>
  );
}

/* ─── LIBRARY SCREEN ─── */
function LibraryScreen({ allQuotes, todayQuotes, onFavorite, onFocus, onSetToday, onTriage }) {
  const t = useTheme();
  const S = makeS(t);
  const [activeCat, setActiveCat]   = usePersisted('fss_lib_cat', 'All');
  const [activeBook, setActiveBook] = usePersisted('fss_lib_book', 'All');
  const [activeSort, setActiveSort] = usePersisted('fss_lib_sort', 'date');
  const [showControls, setShowControls] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const kbHeight = useKeyboardHeight();

  const toggleSearch = () => {
    setShowSearch(v => { if (v) setSearchQuery(''); return !v; });
  };

  let filtered = activeCat === 'All' ? allQuotes : allQuotes.filter(q => q.category === activeCat);
  if (activeBook !== 'All') filtered = filtered.filter(q => q.book_title === activeBook);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(quote => quote.quote.toLowerCase().includes(q));
  }
  filtered = sortQuotes(filtered, activeSort, allQuotes);
  const hasActive = activeCat !== 'All' || activeBook !== 'All' || activeSort !== 'date';

  const grouped = activeSort === 'cat'
    ? Object.entries(filtered.reduce((acc, q) => { (acc[q.category] = acc[q.category] || []).push(q); return acc; }, {}))
    : null;

  return (
    <div style={S.screen}>
      <div style={S.header}>
        <span style={S.title}>Library</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <SearchBtn onClick={toggleSearch} active={showSearch || !!searchQuery.trim()} />
          <ControlsBtn onClick={() => setShowControls(v => !v)} active={showControls || hasActive} />
        </div>
      </div>
      {showSearch && <SearchBar value={searchQuery} onChange={setSearchQuery} />}
      {showControls && <ControlsPanel activeCat={activeCat} onCat={setActiveCat} activeBook={activeBook} onBook={setActiveBook} activeSort={activeSort} onSort={setActiveSort} sortOpts={SORT_OPTS_LIBRARY} />}
      <div className="list-scroll" style={{ ...S.body, gap: 0, padding: '0 13px 0 16px', paddingBottom: kbHeight > 0 ? kbHeight : 8 }}>
        {grouped ? (
          grouped.map(([cat, items]) => (
            <div key={cat}>
              <CatSectionHeader cat={cat} />
              {items.map((quote, i) => (
                <LibraryItem key={quote.id} quote={quote} todayQuotes={todayQuotes}
                  onFavorite={() => onFavorite(quote.id)}
                  onSetToday={() => onSetToday(quote)}
                  onTriage={onTriage}
                  isLast={i === items.length - 1} />
              ))}
            </div>
          ))
        ) : (
          filtered.map((quote, i) => (
            <LibraryItem key={quote.id} quote={quote} todayQuotes={todayQuotes}
              onFavorite={() => onFavorite(quote.id)}
              onSetToday={() => onSetToday(quote)}
              onTriage={onTriage}
              isLast={i === filtered.length - 1} />
          ))
        )}
      </div>
    </div>
  );
}
