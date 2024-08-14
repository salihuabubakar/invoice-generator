import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#0096ff",
        "primary-content": "#ffffff",
        "primary-dark": "#0078cc",
        "primary-light": "#33abff",

        secondary: "#000000",
        "secondary-content": "#808080",
        "secondary-dark": "#000000",
        "secondary-light": "#1a1a1a",

        background: "#eff0f1",
        foreground: "#fbfbfb",
        border: "#dde0e2",

        copy: "#232729",
        "copy-light": "#5e676e",
        "copy-lighter": "#848e95",

        success: "#00ff00",
        warning: "#ffff00",
        error: "#ff0000",

        "success-content": "#000000",
        "warning-content": "#000000",
        "error-content": "#ffffff"
      },
    },
  },
  plugins: [],
};
export default config;
