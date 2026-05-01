/* ─── CATEGORY PILL ─── */
function CatPill({ category, small }) {
  const col = getColor(category);
  return (
    <span style={{
      display: 'inline-block',
      background: col.bg,
      color: col.text,
      fontSize: small ? 10 : 11,
      fontWeight: 500,
      padding: small ? '2px 7px' : '3px 9px',
      borderRadius: 20,
      letterSpacing: '0.3px',
      fontFamily: "'DM Sans', sans-serif",
    }}>{category}</span>
  );
}

/* ─── TAB BAR ─── */
function TabBar({ active, onTab }) {
  const t = useTheme();
  const S = makeS(t);
  const tabs = [
    { id: 'today',     icon: <IconSun />,                                    label: 'Today'   },
    { id: 'library',   icon: <IconBooks />,                                  label: 'Library' },
    { id: 'favorites', icon: <IconStar filled={active === 'favorites'} />,   label: 'Saved'   },
  ];
  return (
    <div style={S.tabBar}>
      {tabs.map(tab => (
        <button key={tab.id} style={S.tab(active === tab.id)} onClick={() => onTab(tab.id)}>
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
