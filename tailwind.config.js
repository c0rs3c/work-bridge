/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        text: "var(--text)",
        muted: "var(--muted)",
        brand: "var(--brand)",
        danger: "var(--danger)",
        success: "var(--success)",
        border: "var(--border)"
      },
      boxShadow: {
        panel: "0 12px 40px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};
