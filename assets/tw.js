tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Libre Franklin", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#1A1714",
          soft: "#3D3934",
          mute: "#67625B",
          faint: "#9C978F",
        },
        paper: { DEFAULT: "#FFFFFF", tint: "#F5F4F1", line: "#E4E1DB" },
        ribbon: { DEFAULT: "#FFCC00", deep: "#F2BD00", ink: "#8A5C05" },
      },
    },
  },
};
