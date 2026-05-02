/* ─── SLOT PICKER (bottom sheet for "Add to Today") ─── */
function SlotPicker({
  quote,
  todayQuotes,
  allQuotes,
  onAssign,
  onClose
}) {
  const t = useTheme();
  const col = getColor(quote.category);
  const slotLabels = ['Slot 1', 'Slot 2', 'Slot 3'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(10,8,6,0.45)',
      backdropFilter: 'blur(2px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      background: t.bg,
      borderRadius: '20px 20px 0 0',
      padding: '20px 20px 36px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      boxShadow: '0 -8px 40px rgba(0,0,0,0.15)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: t.border,
      alignSelf: 'center',
      marginBottom: 4
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "'DM Serif Display', serif",
      fontSize: 20,
      fontWeight: 400,
      color: t.textPrimary,
      marginBottom: 6
    }
  }, "Add to Today"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.dark ? `color-mix(in oklch, ${col.accent} 10%, ${t.bgCard})` : col.bg,
      borderRadius: 10,
      padding: '10px 12px',
      borderLeft: `3px solid ${col.accent}`
    }
  }, /*#__PURE__*/React.createElement(CatPill, {
    category: quote.category,
    small: true
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'DM Serif Display', serif",
      fontSize: 14,
      lineHeight: 1.5,
      color: t.textPrimary,
      marginTop: 6
    }
  }, quote.quote.length > 80 ? quote.quote.slice(0, 80) + '…' : quote.quote))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: t.textSecondary,
      letterSpacing: '0.5px',
      marginBottom: 10,
      textTransform: 'uppercase'
    }
  }, "Choose a slot to replace"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, todayQuotes.map((slot, i) => {
    const slotQ = allQuotes.find(q => q.id === slot.id);
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => !slot.locked && onAssign(i),
      disabled: slot.locked,
      style: {
        width: '100%',
        textAlign: 'left',
        padding: '11px 14px',
        borderRadius: 12,
        border: `1px solid ${slot.locked ? t.borderSub : t.btnBorder}`,
        background: slot.locked ? t.borderSub : t.bgCard,
        cursor: slot.locked ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'background 0.1s',
        opacity: slot.locked ? 0.6 : 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: t.textSecondary,
        minWidth: 48,
        fontFamily: "'DM Sans', sans-serif"
      }
    }, slotLabels[i]), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0,
        overflow: 'hidden'
      }
    }, slotQ && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: t.textPrimary,
        fontFamily: "'DM Serif Display', serif",
        lineHeight: 1.3,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block'
      }
    }, slotQ.quote), slotQ && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10
      }
    }, /*#__PURE__*/React.createElement(CatPill, {
      category: slotQ.category,
      small: true
    }))), slot.locked && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12
      }
    }, "\uD83D\uDD12"), !slot.locked && /*#__PURE__*/React.createElement(IconChevronRight, null));
  })))));
}