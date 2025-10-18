import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans TC'", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f5f0ff",
          100: "#ede2ff",
          200: "#d8bfff",
          300: "#c19cff",
          400: "#a877ff",
          500: "#8d56ff",
          600: "#6f3cf5",
          700: "#5729c7",
          800: "#3b1a8f",
          900: "#201053",
        },
      },
      boxShadow: {
        soft: "0 20px 45px -20px rgba(103, 65, 217, 0.35)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
