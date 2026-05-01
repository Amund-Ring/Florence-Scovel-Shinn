/* ─── FOCUS MODE (full-screen swipeable quote viewer) ─── */
function FocusMode({ quotes, startIdx, onClose, onFavorite, allQuotes }) {
  const t = useTheme();
  const [idx, setIdx]           = React.useState(startIdx);
  const [dragStart, setDragStart] = React.useState(null);
  const [offset, setOffset]     = React.useState(0);
  const [animDir, setAnimDir]   = React.useState(0);

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

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: panelBg, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background 0.3s' }}>
      {/* Top bar: close + dot nav + favorite */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 0' }}>
        <button onClick={onClose} style={{
          width: 36, height: 36, borderRadius: 10,
          border: `1px solid ${t.border}`,
          background: t.dark ? t.bg : 'rgba(255,255,255,0.7)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: t.textSecondary,
        }}><IconX /></button>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {quotes.map((_, i) => (
            <div key={i} onClick={() => goTo(i)} style={{
              width: i === idx ? 20 : 7, height: 7, borderRadius: 4, cursor: 'pointer',
              background: i === idx ? col.accent : t.border,
              transition: 'width 0.25s, background 0.25s',
            }} />
          ))}
        </div>
        <button onClick={() => onFavorite(q.id)} style={{
          width: 36, height: 36, borderRadius: 10,
          border: `1px solid ${isFav ? col.accent : t.border}`,
          background: isFav ? col.bg : (t.dark ? t.bg : 'rgba(255,255,255,0.7)'),
          color: isFav ? col.accent : t.textSecondary,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><IconHeart filled={isFav} /></button>
      </div>

      {/* Swipeable quote area */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 28px', userSelect: 'none', cursor: 'grab', touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
      >
        <div style={{ transform: `translateX(${offset * 0.4}px)`, opacity: animDir !== 0 ? 0 : 1, transition: animDir !== 0 ? 'opacity 0.18s, transform 0.18s' : 'transform 0.1s' }}>
          <div style={{ marginBottom: 20 }}><CatPill category={q.category} /></div>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, lineHeight: 1.7, color: t.textPrimary, fontWeight: 400, textWrap: 'pretty' }}>{q.quote}</p>
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <p style={{ fontSize: 12, color: t.textSecondary, fontStyle: 'italic' }}>{shortBookTitle(q.book_title)}</p>
            <p style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>{q.chapter_title}</p>
          </div>
        </div>
      </div>

      {/* Bottom bar: prev + counter + next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px 28px', alignItems: 'center' }}>
        <button onClick={() => goTo(idx - 1)} disabled={idx === 0} style={{
          width: 40, height: 40, borderRadius: 12,
          border: `1px solid ${t.border}`,
          background: t.dark ? t.bg : 'rgba(255,255,255,0.7)',
          color: idx === 0 ? t.border : t.textPrimary,
          cursor: idx === 0 ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><IconChevronLeft /></button>
        <span style={{ fontSize: 12, color: t.textSecondary, fontWeight: 500 }}>{idx + 1} / {quotes.length}</span>
        <button onClick={() => goTo(idx + 1)} disabled={idx === quotes.length - 1} style={{
          width: 40, height: 40, borderRadius: 12,
          border: `1px solid ${t.border}`,
          background: t.dark ? t.bg : 'rgba(255,255,255,0.7)',
          color: idx === quotes.length - 1 ? t.border : t.textPrimary,
          cursor: idx === quotes.length - 1 ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><IconChevronRight /></button>
      </div>
    </div>
  );
}
