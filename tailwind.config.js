/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        base: {
          DEFAULT: '#0A0B0E',
          warm: '#0D0E12',
        },
        surface: {
          DEFAULT: '#14161B',
          raised: '#1A1D24',
        },
        'surface-elevated': '#1E2129',
        accent: {
          DEFAULT: '#8B5CF6',
          bright: '#A78BFA',
          dim: '#7C3AED',
          glow: 'rgba(139, 92, 246, 0.35)',
          muted: 'rgba(139, 92, 246, 0.12)',
        },
        ink: {
          primary: '#F4F4F6',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        line: {
          subtle: 'rgba(255,255,255,0.08)',
          hover: 'rgba(255,255,255,0.14)',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(139, 92, 246, 0.25)',
        'glow-sm': '0 0 20px rgba(139, 92, 246, 0.18)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.55), 0 0 32px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
};
