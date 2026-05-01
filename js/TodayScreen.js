/* ─── TODAY QUOTE CARD ─── */
function TodayCard({ quote, locked, onLock, onRefresh, onTap }) {
  const t = useTheme();
  const col = getColor(quote.category);
  return (
    <div
      onClick={onTap}
      style={{
        background: t.bgCard, borderRadius: 16,
        border: `1px solid ${t.border}`, overflow: 'hidden',
        boxShadow: t.shadow, cursor: 'pointer', flexShrink: 0,
        transition: 'box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = t.dark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ height: 4, background: col.accent }} />
      <div style={{ padding: '14px 16px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <CatPill category={quote.category} />
          <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
            {!locked && (
              <button onClick={onRefresh} title="Replace this quote" style={{
                width: 30, height: 30, borderRadius: 8,
                border: `1px solid ${t.btnBorder}`,
                background: t.bgCard, color: t.textSecondary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.1s, color 0.1s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = col.bg; e.currentTarget.style.color = col.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = t.bgCard; e.currentTarget.style.color = t.textSecondary; }}
              >
                <IconRefresh />
              </button>
            )}
            <button onClick={onLock} title={locked ? 'Unlock quote' : 'Lock quote'} style={{
              width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${locked ? col.accent : t.btnBorder}`,
              background: locked ? (t.dark ? `color-mix(in oklch, ${col.accent} 14%, ${t.bgCard})` : col.bg) : t.bgCard,
              color: locked ? col.accent : t.textSecondary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {locked ? <IconLock /> : <IconUnlock />}
            </button>
          </div>
        </div>
        <p style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 16, lineHeight: 1.6,
          color: t.textPrimary, fontWeight: 400, textWrap: 'pretty',
        }}>{quote.quote}</p>
        <p style={{ fontSize: 11, color: t.textMuted, marginTop: 10, fontStyle: 'italic' }}>
          {quote.book_title}
        </p>
      </div>
    </div>
  );
}

/* ─── TODAY SCREEN ─── */
function TodayScreen({ todayQuotes, allQuotes, onLock, onRefreshSlot, onRefreshAll, onFocus, darkMode, onToggleDark }) {
  const t = useTheme();
  const S = makeS(t);
  const todayFull = todayQuotes.map(tq => ({ ...allQuotes.find(q => q.id === tq.id), locked: tq.locked })).filter(Boolean);

  return (
    <div style={S.screen}>
      <div style={S.header}>
        <span style={S.title}>Today</span>
        <button onClick={onToggleDark} title={darkMode ? 'Switch to light' : 'Switch to dark'} style={{
          width: 34, height: 34, borderRadius: 10,
          border: `1px solid ${t.btnBorder}`,
          background: t.bgCard, color: t.textSecondary,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}>
          {darkMode ? <IconSun /> : <IconMoon />}
        </button>
      </div>
      <div style={S.body}>
        {todayFull.map((q, i) => (
          <TodayCard
            key={q.id + i} quote={q} locked={q.locked}
            onLock={() => onLock(i)}
            onRefresh={() => onRefreshSlot(i)}
            onTap={() => onFocus(i)}
          />
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4, paddingBottom: 8, flexShrink: 0 }}>
          <button onClick={onRefreshAll} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, fontWeight: 500,
            padding: '10px 28px', borderRadius: 24,
            border: `1.5px solid ${t.btnBorder}`,
            background: t.bgCard, color: t.textPrimary,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'background 0.15s, box-shadow 0.15s',
            boxShadow: t.shadow,
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; }}
          >
            <IconRefresh /> New Set
          </button>
        </div>
      </div>
    </div>
  );
}
