tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { DEFAULT:'#1A1612', soft:'#3B342B', mute:'#6B6256', faint:'#9A9081' },
        cream: { DEFAULT:'#FBF7EF', deep:'#F5EFE1', paper:'#FFFFFF' },
        gold: { 50:'#FEF8E4', 100:'#FCEEB8', 200:'#F9DC7B', 300:'#F5C73E', 400:'#EAAF14', DEFAULT:'#D99806', 600:'#B37B05', 700:'#8A5C05', ink:'#3E2A02' },
        navy: { DEFAULT:'#16233F', soft:'#2A3A5C' },
        ember: { DEFAULT:'#E85B2C' },
      },
      boxShadow: {
        'gold-sm': '0 1px 2px rgba(138,92,5,0.08), 0 2px 8px rgba(217,152,6,0.08)',
        'gold': '0 4px 12px -4px rgba(138,92,5,0.18), 0 18px 40px -18px rgba(217,152,6,0.35)',
        'gold-lg': '0 10px 30px -12px rgba(62,42,2,0.22), 0 30px 70px -30px rgba(217,152,6,0.45)',
        'ink-sm': '0 1px 2px rgba(26,22,18,0.06), 0 4px 14px -6px rgba(26,22,18,0.10)',
        'ink': '0 10px 30px -12px rgba(26,22,18,0.18), 0 30px 60px -30px rgba(26,22,18,0.28)',
      },
    }
  }
};
