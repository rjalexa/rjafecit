import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        "pastel-light": {
          "primary": "#a78bfa",          // Soft lavender
          "primary-focus": "#8b5cf6",    // Slightly deeper lavender
          "primary-content": "#1f2937",  // Dark gray for better contrast
          
          "secondary": "#fbbf24",        // Warm honey
          "secondary-focus": "#f59e0b",  // Deeper honey
          "secondary-content": "#ffffff",
          
          "accent": "#fb7185",           // Soft rose
          "accent-focus": "#f43f5e",     // Deeper rose
          "accent-content": "#ffffff",
          
          "neutral": "#6b7280",          // Soft gray
          "neutral-focus": "#4b5563",    // Deeper gray
          "neutral-content": "#ffffff",
          
          "base-100": "#fefefe",         // Almost white
          "base-200": "#f8fafc",         // Very light gray-blue
          "base-300": "#f1f5f9",         // Light gray-blue
          "base-content": "#374151",     // Dark gray for text
          
          "info": "#7dd3fc",             // Soft sky blue
          "success": "#86efac",          // Soft mint green
          "warning": "#fde047",          // Soft yellow
          "error": "#fca5a5",            // Soft coral red
        },
      },
      {
        "pastel-dark": {
          "primary": "#c4b5fd",          // Light lavender
          "primary-focus": "#a78bfa",    // Medium lavender
          "primary-content": "#ffffff",  // White for better contrast on dark theme
          
          "secondary": "#fcd34d",        // Light honey
          "secondary-focus": "#fbbf24",  // Medium honey
          "secondary-content": "#1f2937",
          
          "accent": "#fda4af",           // Light rose
          "accent-focus": "#fb7185",     // Medium rose
          "accent-content": "#1f2937",
          
          "neutral": "#9ca3af",          // Light gray
          "neutral-focus": "#6b7280",    // Medium gray
          "neutral-content": "#1f2937",
          
          "base-100": "#1f2937",         // Dark blue-gray
          "base-200": "#374151",         // Medium blue-gray
          "base-300": "#4b5563",         // Light blue-gray
          "base-content": "#f9fafb",     // Almost white text
          
          "info": "#7dd3fc",             // Soft sky blue
          "success": "#86efac",          // Soft mint green
          "warning": "#fde047",          // Soft yellow
          "error": "#fca5a5",            // Soft coral red
        },
      },
      "light",
      "dark",
    ],
  },
};
export default config;
