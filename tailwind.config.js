/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}"
  ],
theme: {
  extend: {
    colors: {
      primary: "#4F46E5",   // SendIt brand blue
      success: "#16A34A",  // money green
      bg: "#F8FAFC",       // soft background
      card: "#FFFFFF"
    },
    borderRadius: {
      xl: "14px",
      "2xl": "20px"
    },
    boxShadow: {
      soft: "0 6px 20px rgba(0,0,0,0.08)"
    }
  },
},
  
  plugins: [],
}
