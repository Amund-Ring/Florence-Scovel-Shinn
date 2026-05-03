/* ─── CATEGORY COLORS ─── */
const CAT_COLORS = {
  Abundance: {
    accent: 'oklch(68% 0.12 75)',
    bg: 'oklch(96% 0.03 75)',
    text: 'oklch(42% 0.10 75)'
  },
  Faith: {
    accent: 'oklch(58% 0.10 155)',
    bg: 'oklch(96% 0.03 155)',
    text: 'oklch(36% 0.08 155)'
  },
  Mindset: {
    accent: 'oklch(58% 0.10 285)',
    bg: 'oklch(96% 0.03 285)',
    text: 'oklch(36% 0.08 285)'
  },
  Love: {
    accent: 'oklch(58% 0.10 25)',
    bg: 'oklch(96% 0.03 25)',
    text: 'oklch(38% 0.10 25)'
  }
};
const DEFAULT_COLOR = {
  accent: 'oklch(58% 0.06 60)',
  bg: 'oklch(96% 0.02 60)',
  text: 'oklch(38% 0.05 60)'
};
const getColor = cat => CAT_COLORS[cat] || DEFAULT_COLOR;

/* ─── THEMES ─── */
const THEMES = {
  ivory: {
    bg: 'oklch(98% 0.008 60)',
    bgCard: '#ffffff',
    border: 'oklch(90% 0.01 60)',
    borderSub: 'oklch(93% 0.008 60)',
    textPrimary: 'oklch(18% 0.02 60)',
    textSecondary: 'oklch(60% 0.015 60)',
    textMuted: 'oklch(65% 0.015 60)',
    btnBorder: 'oklch(88% 0.01 60)',
    btnActiveBg: 'oklch(42% 0.05 65)',
    btnActiveBorder: 'oklch(28% 0.06 65)',
    shadow: '0 1px 4px rgba(0,0,0,0.05)',
    dark: false
  },
  night: {
    bg: 'oklch(16% 0.015 60)',
    bgCard: 'oklch(22% 0.015 60)',
    border: 'oklch(28% 0.015 60)',
    borderSub: 'oklch(25% 0.012 60)',
    textPrimary: 'oklch(92% 0.008 60)',
    textSecondary: 'oklch(62% 0.015 60)',
    textMuted: 'oklch(55% 0.012 60)',
    btnBorder: 'oklch(34% 0.015 60)',
    btnActiveBg: 'oklch(88% 0.008 60)',
    btnActiveBorder: 'oklch(62% 0.015 60)',
    shadow: '0 1px 8px rgba(0,0,0,0.3)',
    dark: true
  }
};
const ThemeCtx = React.createContext(THEMES.ivory);
const useTheme = () => React.useContext(ThemeCtx);

/* ─── SHARED STYLE FACTORY ─── */
function makeS(t) {
  return {
    screen: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: t.bg,
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
      transition: 'background 0.3s'
    },
    header: {
      padding: '16px 20px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${t.border}`
    },
    title: {
      fontFamily: "'DM Serif Display', serif",
      fontSize: 26,
      fontWeight: 400,
      color: t.textPrimary,
      letterSpacing: '-0.3px'
    },
    body: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px 16px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      minHeight: 0
    },
    tabBar: {
      height: 60,
      borderTop: `1px solid ${t.border}`,
      display: 'flex',
      background: t.bg,
      paddingBottom: 6,
      transition: 'background 0.3s'
    },
    tab: active => ({
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      cursor: 'pointer',
      color: active ? t.textPrimary : t.textSecondary,
      transition: 'color 0.15s',
      fontSize: 10,
      fontWeight: active ? 600 : 400,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: '0.3px',
      background: 'none',
      border: 'none'
    })
  };
}