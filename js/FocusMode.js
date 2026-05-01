/* ─── FOCUS MODE (full-screen swipeable quote viewer) ─── */
function FocusMode({ quotes, startIdx, onClose, onFavorite, allQuotes }) {
  const t = useTheme();
  const [idx, setIdx]             = React.useState(startIdx);
  const [dragStart, setDragStart] = React.useState(null);
  const [offset, setOffset]       = React.useState(0);
  const [animDir, setAnimDir]     = React.useState(0);

  const q = quotes[idx];
  const col = getColor(q.category);
  const fullQ = allQuotes.find(aq => aq.id === q.id);
  const isFav = fullQ?.is_favorite;
  const panelBg = t.dark ? t.bgCard : col.bg;

  const goTo = (newIdx) => {
    if (newIdx < 0 || newIdx >= quotes.length) return;
    setAnimDir(newIdx > idx ? -1 : 1);
    setTimeout(() => { setIdx(newIdx); setAnimDir(0); setOffset(0); }, 180);
  };

  const handlePointerDown = (e) => { setDragStart(e.clientX); };
  const handlePointerMove = (e) => { if (dragStart === null) return; setOffset(e.clientX - dragStart); };
  const handlePointerUp = () => {
    if (Math.abs(offset) > 60) {
      if (offset < 0 && idx < quotes.length - 1) goTo(idx + 1);
      else if (offset > 0 && idx > 0) goTo(idx - 1);
    }
    setDragStart(null); setOffset(0);
  };

  const iconBtn = (extra) => ({
    width: 36, height: 36, borderRadius: 10,
    border: `1px solid ${t.border}`,
    background: t.dark ? t.bg : 'rgba(255,255,255,0.7)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: t.textSecondary, ...extra,
  });

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: panelBg, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background 0.3s' }}>

      {/* Top bar: close (left) · heart (right) — no dots here */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 0', flexShrink: 0 }}>
        <button onClick={onClose} style={iconBtn()}><IconX /></button>
        <button onClick={() => onFavorite(q.id)} style={iconBtn({
          border: `1px solid ${isFav ? col.accent : t.border}`,
          background: isFav ? (t.dark ? `color-mix(in oklch, ${col.accent} 14%, ${t.bgCard})` : col.bg) : (t.dark ? t.bg : 'rgba(255,255,255,0.7)'),
          color: isFav ? col.accent : t.textSecondary,
        })}><IconHeart filled={isFav} /></button>
      </div>

      {/* Centered swipeable content */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px 36px', userSelect: 'none', cursor: 'grab', touchAction: 'pan-y', textAlign: 'center' }}
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
      >
        <div style={{
          transform: `translateX(${offset * 0.4}px)`,
          opacity: animDir !== 0 ? 0 : 1,
          transition: animDir !== 0 ? 'opacity 0.18s, transform 0.18s' : 'transform 0.1s',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* Category — uppercase, spacious, muted */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 600,
            letterSpacing: '4px', textTransform: 'uppercase',
            color: t.dark ? col.accent : col.text,
            opacity: 0.55,
            marginBottom: 24,
          }}>{q.category}</p>

          {/* Quote text */}
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 24, lineHeight: 1.65,
            color: t.textPrimary, fontWeight: 400,
            textWrap: 'pretty',
            marginBottom: 28,
          }}>
            &ldquo;{q.quote}&rdquo;
          </p>

          {/* Book title + chapter — both italic, muted */}
          <p style={{ fontSize: 13, color: t.textSecondary, fontStyle: 'italic', marginBottom: 4 }}>{q.book_title}</p>
          <p style={{ fontSize: 12, color: t.textMuted, fontStyle: 'italic' }}>{q.chapter_title}</p>

          {/* Equal-width navigation pills */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 32 }}>
            {quotes.map((_, i) => (
              <div key={i} onClick={() => goTo(i)} style={{
                width: 36, height: 8, borderRadius: 4, cursor: 'pointer',
                background: i === idx ? (t.dark ? t.textPrimary : t.textPrimary) : t.border,
                opacity: i === idx ? 1 : 0.4,
                transition: 'opacity 0.25s, background 0.25s',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar: prev · counter · next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px 28px', alignItems: 'center', flexShrink: 0 }}>
        <button onClick={() => goTo(idx - 1)} disabled={idx === 0} style={iconBtn({
          width: 40, height: 40, borderRadius: 12,
          color: idx === 0 ? t.border : t.textPrimary,
          cursor: idx === 0 ? 'default' : 'pointer',
        })}><IconChevronLeft /></button>
        <span style={{ fontSize: 12, color: t.textSecondary, fontWeight: 500 }}>{idx + 1} / {quotes.length}</span>
        <button onClick={() => goTo(idx + 1)} disabled={idx === quotes.length - 1} style={iconBtn({
          width: 40, height: 40, borderRadius: 12,
          color: idx === quotes.length - 1 ? t.border : t.textPrimary,
          cursor: idx === quotes.length - 1 ? 'default' : 'pointer',
        })}><IconChevronRight /></button>
      </div>
    </div>
  );
}
