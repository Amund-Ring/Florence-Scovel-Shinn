/* ─── CATEGORY PILL ─── */
function CatPill({
  category,
  small
}) {
  const t = useTheme();
  const col = getColor(category);
  // In dark mode: tinted dark background + accent text instead of the light-on-light palette
  const bg = t.dark ? `color-mix(in oklch, ${col.accent} 14%, ${t.bgCard})` : col.bg;
  const color = t.dark ? col.accent : col.text;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      background: bg,
      color: color,
      fontSize: small ? 10 : 11,
      fontWeight: 500,
      padding: small ? '2px 7px' : '3px 9px',
      borderRadius: 20,
      letterSpacing: '0.3px',
      fontFamily: "'DM Sans', sans-serif"
    }
  }, category);
}

/* ─── TAB BAR ─── */
function TabBar({
  active,
  onTab
}) {
  const t = useTheme();
  const S = makeS(t);
  const tabs = [{
    id: 'today',
    icon: /*#__PURE__*/React.createElement(IconSun, null),
    label: 'Today'
  }, {
    id: 'library',
    icon: /*#__PURE__*/React.createElement(IconBooks, null),
    label: 'Library'
  }, {
    id: 'favorites',
    icon: /*#__PURE__*/React.createElement(IconStar, {
      filled: active === 'favorites'
    }),
    label: 'Saved'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: S.tabBar
  }, tabs.map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab.id,
    style: S.tab(active === tab.id),
    onClick: () => onTab(tab.id)
  }, tab.icon, /*#__PURE__*/React.createElement("span", null, tab.label))));
}