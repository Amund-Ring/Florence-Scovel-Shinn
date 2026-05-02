/* ─── ADJUSTABLE SIZES ─────────────────────────────────────────────────────
   Change these values to resize UI elements without digging through styles.   */
const HEART_SIZE = 14; // px — heart icon in Library/Favorites rows
const CHIP_LABEL = 9; // px — "CATEGORY" / "SORT BY" section header text
const CHIP_FONT = 12; // px — filter chip button text (All, Faith, A–Z…)
const CHIP_PAD = '5px 13px'; // vertical horizontal — filter chip padding
/* ─────────────────────────────────────────────────────────────────────────── */

/* ─── FILTER / SORT CONTROLS ─── */
function SearchBtn({
  onClick,
  active
}) {
  const t = useTheme();
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: "Search",
    style: {
      width: 34,
      height: 34,
      borderRadius: 10,
      border: `1px solid ${active ? t.btnActiveBorder : t.btnBorder}`,
      background: active ? t.btnActiveBg : t.bgCard,
      color: active ? t.dark ? t.bg : '#fff' : t.textSecondary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconSearch, null));
}
function SearchBar({
  value,
  onChange
}) {
  const t = useTheme();
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px 10px',
      borderBottom: `1px solid ${t.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: t.dark ? 'oklch(28% 0.015 60)' : 'oklch(94% 0.008 60)',
      borderRadius: 10,
      padding: '7px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.textMuted,
      display: 'flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconSearch, null)), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: "Search quotes\u2026",
    style: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 15,
      color: t.textPrimary,
      outline: 'none'
    }
  }), value && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onChange('');
      inputRef.current?.focus();
    },
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: t.textMuted,
      padding: 0,
      display: 'flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconX, null))));
}
function ControlsBtn({
  onClick,
  active
}) {
  const t = useTheme();
  // In dark mode the near-white btnActiveBg is too harsh; use a mid-dark tone instead
  const activeBg = active ? t.dark ? t.border : t.btnActiveBg : t.bgCard;
  const activeColor = active ? t.dark ? t.textPrimary : '#fff' : t.textSecondary;
  const activeBorder = active ? t.dark ? t.textSecondary : t.btnActiveBorder : t.btnBorder;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: "Filter & Sort",
    style: {
      width: 34,
      height: 34,
      borderRadius: 10,
      border: `1px solid ${activeBorder}`,
      background: activeBg,
      color: activeColor,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconControls, {
    active: active
  }));
}
function ScrollChipRow({
  label,
  options,
  active,
  onSelect
}) {
  const t = useTheme();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: CHIP_LABEL,
      fontWeight: 600,
      letterSpacing: '0.6px',
      textTransform: 'uppercase',
      color: t.textSecondary,
      padding: '10px 16px 5px',
      fontFamily: "'DM Sans', sans-serif"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      overflowX: 'auto',
      padding: '0 16px 10px',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch'
    }
  }, options.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.id,
    onClick: () => onSelect(opt.id),
    style: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: CHIP_FONT,
      fontWeight: 500,
      padding: CHIP_PAD,
      borderRadius: 20,
      flexShrink: 0,
      border: `1px solid ${active === opt.id ? t.btnActiveBorder : t.btnBorder}`,
      background: active === opt.id ? t.btnActiveBg : t.bgCard,
      color: active === opt.id ? t.dark ? t.bg : '#fff' : t.textSecondary,
      cursor: 'pointer',
      transition: 'all 0.15s',
      whiteSpace: 'nowrap'
    }
  }, opt.label))));
}

// sortOpts prop lets Library and Favorites pass different label sets
function ControlsPanel({
  activeCat,
  onCat,
  activeSort,
  onSort,
  sortOpts
}) {
  const t = useTheme();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${t.border}`,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(ScrollChipRow, {
    label: "Category",
    options: CAT_OPTS,
    active: activeCat,
    onSelect: onCat
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: t.border
    }
  }), /*#__PURE__*/React.createElement(ScrollChipRow, {
    label: "Sort by",
    options: sortOpts,
    active: activeSort,
    onSelect: onSort
  }));
}

/* ─── LIBRARY ITEM (shared with FavoritesScreen) ─── */
function LibraryItem({
  quote,
  todayQuotes,
  onFavorite,
  onTap,
  onSetToday,
  isLast
}) {
  const t = useTheme();
  const col = getColor(quote.category);
  const isInToday = todayQuotes.some(tq => tq.id === quote.id);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '14px 0',
      borderBottom: isLast ? 'none' : `1px solid ${t.borderSub}`,
      cursor: onTap ? 'pointer' : 'default'
    },
    onClick: onTap || undefined
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 3,
      background: col.accent,
      borderRadius: 2,
      alignSelf: 'stretch',
      minHeight: 32,
      flexShrink: 0,
      marginTop: 3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'DM Serif Display', serif",
      fontSize: 14.5,
      lineHeight: 1.55,
      color: t.textPrimary,
      fontWeight: 400,
      textWrap: 'pretty',
      marginBottom: 5
    }
  }, quote.quote), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(CatPill, {
    category: quote.category,
    small: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: t.textMuted
    }
  }, "\xB7 ", quote.book_title))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      flexShrink: 0,
      paddingTop: 2
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onFavorite,
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      border: `1px solid ${quote.is_favorite ? 'oklch(62% 0.14 20)' : t.btnBorder}`,
      background: quote.is_favorite ? t.dark ? `color-mix(in oklch, oklch(58% 0.14 20) 14%, ${t.bgCard})` : 'oklch(96% 0.04 20)' : t.bgCard,
      color: quote.is_favorite ? 'oklch(62% 0.14 20)' : t.textSecondary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s'
    }
  }, /*#__PURE__*/React.createElement(IconHeart, {
    filled: quote.is_favorite,
    size: HEART_SIZE
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onSetToday,
    title: "Add to Today",
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      border: `1px solid ${t.btnBorder}`,
      background: t.bgCard,
      color: t.textSecondary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      transition: 'all 0.15s'
    }
  }, "+")));
}

/* ─── CATEGORY SECTION HEADER (shared between Library and Favorites) ─── */
function CatSectionHeader({
  cat
}) {
  const col = getColor(cat);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.7px',
      textTransform: 'uppercase',
      color: col.text,
      padding: '14px 0 8px',
      borderBottom: `2px solid ${col.accent}`,
      marginBottom: 2
    }
  }, cat);
}

/* ─── LIBRARY SCREEN ─── */
function LibraryScreen({
  allQuotes,
  todayQuotes,
  onFavorite,
  onFocus,
  onSetToday
}) {
  const t = useTheme();
  const S = makeS(t);
  const [activeCat, setActiveCat] = usePersisted('fss_lib_cat', 'All');
  const [activeSort, setActiveSort] = usePersisted('fss_lib_sort', 'date');
  const [showControls, setShowControls] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const toggleSearch = () => {
    setShowSearch(v => {
      if (v) setSearchQuery('');
      return !v;
    });
  };
  let filtered = activeCat === 'All' ? allQuotes : allQuotes.filter(q => q.category === activeCat);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(quote => quote.quote.toLowerCase().includes(q));
  }
  filtered = sortQuotes(filtered, activeSort, allQuotes);
  const hasActive = activeCat !== 'All' || activeSort !== 'date';
  const grouped = activeSort === 'cat' ? Object.entries(filtered.reduce((acc, q) => {
    (acc[q.category] = acc[q.category] || []).push(q);
    return acc;
  }, {})) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: S.screen
  }, /*#__PURE__*/React.createElement("div", {
    style: S.header
  }, /*#__PURE__*/React.createElement("span", {
    style: S.title
  }, "Library"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(SearchBtn, {
    onClick: toggleSearch,
    active: showSearch || !!searchQuery.trim()
  }), /*#__PURE__*/React.createElement(ControlsBtn, {
    onClick: () => setShowControls(v => !v),
    active: showControls || hasActive
  }))), showSearch && /*#__PURE__*/React.createElement(SearchBar, {
    value: searchQuery,
    onChange: setSearchQuery
  }), showControls && /*#__PURE__*/React.createElement(ControlsPanel, {
    activeCat: activeCat,
    onCat: setActiveCat,
    activeSort: activeSort,
    onSort: setActiveSort,
    sortOpts: SORT_OPTS_LIBRARY
  }), /*#__PURE__*/React.createElement("div", {
    className: "list-scroll",
    style: {
      ...S.body,
      gap: 0,
      padding: '0 13px 0 16px'
    }
  }, grouped ? grouped.map(([cat, items]) => /*#__PURE__*/React.createElement("div", {
    key: cat
  }, /*#__PURE__*/React.createElement(CatSectionHeader, {
    cat: cat
  }), items.map((quote, i) => /*#__PURE__*/React.createElement(LibraryItem, {
    key: quote.id,
    quote: quote,
    todayQuotes: todayQuotes,
    onFavorite: () => onFavorite(quote.id),
    onSetToday: () => onSetToday(quote),
    isLast: i === items.length - 1
  })))) : filtered.map((quote, i) => /*#__PURE__*/React.createElement(LibraryItem, {
    key: quote.id,
    quote: quote,
    todayQuotes: todayQuotes,
    onFavorite: () => onFavorite(quote.id),
    onSetToday: () => onSetToday(quote),
    isLast: i === filtered.length - 1
  }))));
}