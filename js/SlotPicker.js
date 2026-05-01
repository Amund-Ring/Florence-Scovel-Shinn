/* ─── SLOT PICKER (bottom sheet for "Add to Today") ─── */
function SlotPicker({ quote, todayQuotes, allQuotes, onAssign, onClose }) {
  const t = useTheme();
  const col = getColor(quote.category);
  const slotLabels = ['Slot 1', 'Slot 2', 'Slot 3'];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(10,8,6,0.45)', backdropFilter: 'blur(2px)' }} />

      {/* Sheet */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: t.bg, borderRadius: '20px 20px 0 0',
        padding: '20px 20px 36px',
        display: 'flex', flexDirection: 'column', gap: 16,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: t.border, alignSelf: 'center', marginBottom: 4 }} />

        {/* Incoming quote preview */}
        <div>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, fontWeight: 400, color: t.textPrimary, marginBottom: 6 }}>Add to Today</h3>
          <div style={{ background: t.dark ? `color-mix(in oklch, ${col.accent} 10%, ${t.bgCard})` : col.bg, borderRadius: 10, padding: '10px 12px', borderLeft: `3px solid ${col.accent}` }}>
            <CatPill category={quote.category} small />
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, lineHeight: 1.5, color: t.textPrimary, marginTop: 6 }}>
              {quote.quote.length > 80 ? quote.quote.slice(0, 80) + '…' : quote.quote}
            </p>
          </div>
        </div>

        {/* Slot list */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.textSecondary, letterSpacing: '0.5px', marginBottom: 10, textTransform: 'uppercase' }}>Choose a slot to replace</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayQuotes.map((slot, i) => {
              const slotQ = allQuotes.find(q => q.id === slot.id);
              return (
                <button key={i} onClick={() => !slot.locked && onAssign(i)} disabled={slot.locked} style={{
                  width: '100%', textAlign: 'left', padding: '11px 14px', borderRadius: 12,
                  border: `1px solid ${slot.locked ? t.borderSub : t.btnBorder}`,
                  background: slot.locked ? t.borderSub : t.bgCard,
                  cursor: slot.locked ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'background 0.1s', opacity: slot.locked ? 0.6 : 1,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: t.textSecondary, minWidth: 48, fontFamily: "'DM Sans', sans-serif" }}>{slotLabels[i]}</span>
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, overflow: 'hidden' }}>
                    {slotQ && <span style={{ fontSize: 12, color: t.textPrimary, fontFamily: "'DM Serif Display', serif", lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{slotQ.quote}</span>}
                    {slotQ && <span style={{ fontSize: 10 }}><CatPill category={slotQ.category} small /></span>}
                  </span>
                  {slot.locked && <span style={{ fontSize: 12 }}>🔒</span>}
                  {!slot.locked && <IconChevronRight />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
