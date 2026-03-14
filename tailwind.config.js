/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo_400Regular", "Cairo_600SemiBold", "Cairo_700Bold"],
        inter: ["Inter_400Regular", "Inter_500Medium", "Inter_600SemiBold"],
      },
      borderRadius: {
        card: "24px",
        "card-lg": "32px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.08)",
        "card-dark": "0 4px 24px rgba(0,0,0,0.24)",
      },
    },
  },
  plugins: [],
};
