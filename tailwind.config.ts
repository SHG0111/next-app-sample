import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }: any) {
      addUtilities({
        ".box-bg-hover-effect": {
          transition: "all 0.2s ease-in-out",
          position: "relative",
          minWidth: "100px",
          zIndex: "1",
          overflow: "hidden",
          padding: "9px 15px",
          textAlign: "center",
          background: "transparent",
          textTransform: "uppercase",
          color: "black",
          textDecoration: "none",
          cursor: "pointer",
          outline: "none",
          border: "2px solid black",

          "&::before, &::after": {
            content: '""', // ← Changed from "" to '""'
            display: "block",
            height: "100%",
            width: "100%",
            transform: "skew(90deg) translate(-50%, -50%)",
            position: "absolute",
            inset: "50%",
            zIndex: "-1",
            transition: "0.5s all ease-in-out",
            backgroundColor: "black",
          },
          "&::before": {
            top: "-50%",
            left: "-25%",
            transform: "skew(90deg) rotate(180deg) translate(-50%, -50%)",
          },

          "&::after": {
            left: "15%",
          },
        },
        ".box-bg-hover-effect:active": {
          filter: "brightness(0.7)",
          transform: "scale(0.95)",
        },
        // ← ADD GROUP HOVER SUPPORT HERE
        ".group:hover .box-bg-hover-effect": {
          color: "white",
        },
        ".group:hover .box-bg-hover-effect::before": {
          transform: "skew(45deg) rotate(180deg) translate(-50%, -50%)",
        },
        ".group:hover .box-bg-hover-effect::after": {
          transform: "skew(45deg) translate(-50%, -50%)",
        },
      });
    },
  ],
};
export default config;
