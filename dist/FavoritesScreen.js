/* ─── TRIAGE SECTION (Saved screen) ─── */
function TriageItem({
  quote,
  onClear
}) {
  const t = useTheme();
  const isRemove = quote.triage === 'remove';
  const accentColor = isRemove ? 'oklch(52% 0.16 20)' : 'oklch(58% 0.13 60)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '10px 0',
      borderBottom: `1px solid ${t.borderSub}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 3,
      background: accentColor,
      borderRadius: 2,
      alignSelf: 'stretch',
      minHeight: 24,
      flexShrink: 0,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'DM Serif Display', serif",
      fontSize: 13.5,
      lineHeight: 1.5,
      color: isRemove ? accentColor : t.textPrimary,
      textDecoration: isRemove ? 'line-through' : 'none',
      opacity: 0.8,
      marginBottom: 3
    }
  }, quote.quote), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: t.textMuted
    }
  }, quote.book_title)), /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    title: "Clear flag",
    style: {
      flexShrink: 0,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: t.textMuted,
      padding: '2px 6px',
      fontSize: 18,
      lineHeight: 1
    }
  }, "\xD7"));
}
function TriageSection({
  allQuotes,
  onTriage
}) {
  const t = useTheme();
  const removeList = allQuotes.filter(q => q.triage === 'remove');
  const editList = allQuotes.filter(q => q.triage === 'edit');
  if (removeList.length === 0 && editList.length === 0) return null;
  const subHeader = (label, color, count) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 0 6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.6px',
      textTransform: 'uppercase',
      color,
      fontFamily: "'DM Sans', sans-serif"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: t.textMuted,
      fontFamily: "'DM Sans', sans-serif"
    }
  }, count));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      paddingTop: 20,
      borderTop: `2px solid ${t.border}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.6px',
      textTransform: 'uppercase',
      color: t.textSecondary,
      fontFamily: "'DM Sans', sans-serif"
    }
  }, "Triage"), removeList.length > 0 && /*#__PURE__*/React.createElement("div", null, subHeader('For removal', 'oklch(52% 0.16 20)', removeList.length), removeList.map((q, i) => /*#__PURE__*/React.createElement(TriageItem, {
    key: q.id,
    quote: q,
    onClear: () => onTriage(q.id, 'remove')
  }))), editList.length > 0 && /*#__PURE__*/React.createElement("div", null, subHeader('For editing', 'oklch(58% 0.13 60)', editList.length), editList.map((q, i) => /*#__PURE__*/React.createElement(TriageItem, {
    key: q.id,
    quote: q,
    onClear: () => onTriage(q.id, 'edit')
  }))));
}

/* ─── FAVORITES SCREEN ─── */
function FavoritesScreen({
  allQuotes,
  todayQuotes,
  onFavorite,
  onFocus,
  onSetToday,
  onTriage
}) {
  const t = useTheme();
  const S = makeS(t);
  const [sort, setSort] = usePersisted('fss_fav_sort', 'date');
  const [activeCat, setActiveCat] = usePersisted('fss_fav_cat', 'All');
  const [showControls, setShowControls] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const kbHeight = useKeyboardHeight();
  const toggleSearch = () => {
    setShowSearch(v => {
      if (v) setSearchQuery('');
      return !v;
    });
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
  const grouped = sort === 'cat' ? Object.entries(sorted.reduce((acc, q) => {
    (acc[q.category] = acc[q.category] || []).push(q);
    return acc;
  }, {})) : null;
  if (favs.length === 0 && triaged.length === 0) {
    const iconBg = t.dark ? t.bgCard : 'oklch(96% 0.04 20)';
    const iconBorder = t.dark ? t.border : 'transparent';
    const iconColor = 'oklch(62% 0.14 20)';
    return /*#__PURE__*/React.createElement("div", {
      style: S.screen
    }, /*#__PURE__*/React.createElement("div", {
      style: S.header
    }, /*#__PURE__*/React.createElement("span", {
      style: S.title
    }, "Saved")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 64,
        height: 64,
        borderRadius: 20,
        background: iconBg,
        border: `1px solid ${iconBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: iconColor
      }
    }, /*#__PURE__*/React.createElement(IconHeart, null)), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 20,
        color: t.textPrimary,
        textAlign: 'center'
      }
    }, "No saved quotes yet"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: t.textSecondary,
        textAlign: 'center',
        lineHeight: 1.6
      }
    }, "Tap the \u2661 on any quote in the Library to save it here.")));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: S.screen
  }, /*#__PURE__*/React.createElement("div", {
    style: S.header
  }, /*#__PURE__*/React.createElement("span", {
    style: S.title
  }, "Saved"), /*#__PURE__*/React.createElement("div", {
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
    activeSort: sort,
    onSort: setSort,
    sortOpts: SORT_OPTS_FAVORITES
  }), /*#__PURE__*/React.createElement("div", {
    className: "list-scroll",
    style: {
      ...S.body,
      gap: 0,
      padding: '0 13px 0 16px',
      paddingBottom: kbHeight > 0 ? kbHeight : 8
    }
  }, favs.length > 0 && (grouped ? grouped.map(([cat, items]) => /*#__PURE__*/React.createElement("div", {
    key: cat
  }, /*#__PURE__*/React.createElement(CatSectionHeader, {
    cat: cat
  }), items.map((quote, i) => /*#__PURE__*/React.createElement(LibraryItem, {
    key: quote.id,
    quote: quote,
    todayQuotes: todayQuotes,
    onFavorite: () => onFavorite(quote.id),
    onSetToday: () => onSetToday(quote),
    onTriage: onTriage,
    onTap: () => onFocus(sorted, sorted.findIndex(q => q.id === quote.id)),
    isLast: i === items.length - 1
  })))) : sorted.map((quote, i) => /*#__PURE__*/React.createElement(LibraryItem, {
    key: quote.id,
    quote: quote,
    todayQuotes: todayQuotes,
    onFavorite: () => onFavorite(quote.id),
    onSetToday: () => onSetToday(quote),
    onTriage: onTriage,
    onTap: () => onFocus(sorted, i),
    isLast: i === sorted.length - 1
  }))), /*#__PURE__*/React.createElement(TriageSection, {
    allQuotes: allQuotes,
    onTriage: onTriage
  })));
}