/* ─── FILTER / SORT CONTROLS ─── */
function ControlsBtn({ onClick, active }) {
  const t = useTheme();
  return (
    <button onClick={onClick} title="Filter &amp; Sort" style={{
      width: 34, height: 34, borderRadius: 10,
      border: `1px solid ${active ? t.textPrimary : t.btnBorder}`,
      background: active ? t.btnActiveBg : t.bgCard,
      color: active ? (t.dark ? t.bg : '#fff') : t.textSecondary,
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
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', color: t.textSecondary, padding: '10px 16px 5px', fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 16px 10px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {options.map(opt => (
          <button key={opt.id} onClick={() => onSelect(opt.id)} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, fontWeight: active === opt.id ? 600 : 400,
            padding: '4px 12px', borderRadius: 20, flexShrink: 0,
            border: active === opt.id ? 'none' : `1px solid ${t.btnBorder}`,
            background: active === opt.id ? t.btnActiveBg : t.bgCard,
            color: active === opt.id ? (t.dark ? t.bg : '#fff') : t.textSecondary,
            cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>{opt.label}</button>
        ))}
      </div>
    </div>
  );
}

function ControlsPanel({ activeCat, onCat, activeSort, onSort }) {
  const t = useTheme();
  return (
    <div style={{ borderBottom: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column' }}>
      <ScrollChipRow label="Category" options={CAT_OPTS} active={activeCat} onSelect={onCat} />
      <div style={{ height: 1, background: t.border }} />
      <ScrollChipRow label="Sort by" options={SORT_OPTS} active={activeSort} onSelect={onSort} />
    </div>
  );
}

/* ─── LIBRARY ITEM (shared with FavoritesScreen) ─── */
function LibraryItem({ quote, todayQuotes, onFavorite, onTap, onSetToday, isLast }) {
  const t = useTheme();
  const col = getColor(quote.category);
  const isInToday = todayQuotes.some(tq => tq.id === quote.id);
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 0',
      borderBottom: isLast ? 'none' : `1px solid ${t.borderSub}`,
      cursor: 'pointer',
    }} onClick={onTap}>
      <div style={{ width: 3, background: col.accent, borderRadius: 2, alignSelf: 'stretch', minHeight: 32, flexShrink: 0, marginTop: 3 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14.5, lineHeight: 1.55, color: t.textPrimary, fontWeight: 400, textWrap: 'pretty', marginBottom: 5 }}>{quote.quote}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CatPill category={quote.category} small />
          <span style={{ fontSize: 10, color: t.textMuted }}>· {shortBookTitle(quote.book_title)}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, paddingTop: 2 }} onClick={e => e.stopPropagation()}>
        <button onClick={onFavorite} style={{
          width: 30, height: 30, borderRadius: 8,
          border: `1px solid ${quote.is_favorite ? 'oklch(70% 0.12 20)' : t.btnBorder}`,
          background: quote.is_favorite ? 'oklch(96% 0.04 20)' : t.bgCard,
          color: quote.is_favorite ? 'oklch(55% 0.14 20)' : t.textSecondary,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}><IconHeart filled={quote.is_favorite} /></button>
        <button onClick={onSetToday} title="Add to Today" style={{
          width: 30, height: 30, borderRadius: 8,
          border: `1px solid ${isInToday ? col.accent : t.btnBorder}`,
          background: isInToday ? col.bg : t.bgCard,
          color: isInToday ? col.text : t.textSecondary,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
          transition: 'all 0.15s',
        }}>+</button>
      </div>
    </div>
  );
}

/* ─── LIBRARY SCREEN ─── */
function LibraryScreen({ allQuotes, todayQuotes, onFavorite, onFocus, onSetToday }) {
  const t = useTheme();
  const S = makeS(t);
  const [activeCat, setActiveCat] = React.useState('All');
  const [activeSort, setActiveSort] = React.useState('date');
  const [showControls, setShowControls] = React.useState(false);

  let filtered = activeCat === 'All' ? allQuotes : allQuotes.filter(q => q.category === activeCat);
  filtered = sortQuotes(filtered, activeSort, allQuotes);
  const hasActive = activeCat !== 'All' || activeSort !== 'date';

  return (
    <div style={S.screen}>
      <div style={S.header}>
        <span style={S.title}>Library</span>
        <ControlsBtn onClick={() => setShowControls(v => !v)} active={showControls || hasActive} />
      </div>
      {showControls && <ControlsPanel activeCat={activeCat} onCat={setActiveCat} activeSort={activeSort} onSort={setActiveSort} />}
      <div style={{ ...S.body, gap: 0, padding: '0 16px' }}>
        {filtered.map((quote, i) => (
          <LibraryItem key={quote.id} quote={quote} todayQuotes={todayQuotes}
            onFavorite={() => onFavorite(quote.id)}
            onTap={() => onFocus(allQuotes.findIndex(q => q.id === quote.id))}
            onSetToday={() => onSetToday(quote)}
            isLast={i === filtered.length - 1} />
        ))}
      </div>
    </div>
  );
}
