/* ─── FAVORITES SCREEN ─── */
function FavoritesScreen({ allQuotes, todayQuotes, onFavorite, onFocus, onSetToday }) {
  const t = useTheme();
  const S = makeS(t);
  const [sort, setSort]               = usePersisted('fss_fav_sort', 'date');
  const [activeCat, setActiveCat]     = usePersisted('fss_fav_cat', 'All');
  const [showControls, setShowControls] = React.useState(false);

  const favs = allQuotes.filter(q => q.is_favorite);
  const hasActive = activeCat !== 'All' || sort !== 'date';
  const displayed = activeCat === 'All' ? favs : favs.filter(q => q.category === activeCat);
  const sorted = sortQuotes(displayed, sort, allQuotes);

  const grouped = sort === 'cat'
    ? Object.entries(sorted.reduce((acc, q) => { (acc[q.category] = acc[q.category] || []).push(q); return acc; }, {}))
    : null;

  if (favs.length === 0) {
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
        <ControlsBtn onClick={() => setShowControls(v => !v)} active={showControls || hasActive} />
      </div>
      {showControls && <ControlsPanel activeCat={activeCat} onCat={setActiveCat} activeSort={sort} onSort={setSort} sortOpts={SORT_OPTS_FAVORITES} />}
      <div style={{ ...S.body, gap: 0, padding: '0 16px' }}>
        {grouped ? (
          grouped.map(([cat, items]) => (
            <div key={cat}>
              <CatSectionHeader cat={cat} />
              {items.map((quote, i) => (
                <LibraryItem key={quote.id} quote={quote} todayQuotes={todayQuotes}
                  onFavorite={() => onFavorite(quote.id)}
                                    onSetToday={() => onSetToday(quote)}
                  isLast={i === items.length - 1} />
              ))}
            </div>
          ))
        ) : (
          sorted.map((quote, i) => (
            <LibraryItem key={quote.id} quote={quote} todayQuotes={todayQuotes}
              onFavorite={() => onFavorite(quote.id)}
                            onSetToday={() => onSetToday(quote)}
              isLast={i === sorted.length - 1} />
          ))
        )}
      </div>
    </div>
  );
}
