export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        secondary: "#8B5CF6",
        accent: "#00D4FF",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(25, 31, 52, 0.10)",
      },
    },
  },
  plugins: [],
};
