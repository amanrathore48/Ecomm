/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xxs: "300px",
        xs: "400px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Additional brand colors
        brand: {
          red: "hsl(346, 77%, 41%)",
        },
      },
      backgroundImage: {
        "herobg-1": "url('/slide.jpg')",
        formbg: "url('/formimg.jpg')",
      },
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
        "6xl": "3.75rem", // 60px
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            h1: {
              fontSize: "2.25rem",
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            h2: {
              fontSize: "1.5rem",
              marginTop: "1.75rem",
              marginBottom: "0.75rem",
            },
            h3: {
              fontSize: "1.25rem",
              marginTop: "1.5rem",
              marginBottom: "0.5rem",
            },
          },
        },
      },
    },
    fontFamily: {
      sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      serif: ["Georgia", "serif"],
      mono: ["Menlo", "Monaco", "Courier New", "monospace"],
      montserrat: ["var(--font-montserrat)", "sans-serif"],
      poppins: ["var(--font-poppins)", "sans-serif"],
      inter: ["var(--font-inter)", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      ubuntu: ["Ubuntu", "sans-serif"],
      pango: ["Pangolin", "cursive"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
