/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // ✅ 讓 Tailwind 掃描 src 內的所有檔案
  theme: {
    extend: {},
  },
  plugins: [],
};
