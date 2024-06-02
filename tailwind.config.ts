import type { Config } from "tailwindcss";

const config = {
  daisyui: {
    themes: ["light"],
  },
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          "50": "#F4FAF0",
          "100": "#E3F2DA",
          "200": "#C7E5B4",
          "300": "#ACD98F",
          "400": "#90CC69",
          "500": "#74BF44",
          "600": "#5D9936",
          "700": "#467329",
          "800": "#2E4C1B",
          "900": "#17260E",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        neutral: {
          "50": "#F4FAF0",
          "100": "#F5F5F5",
          "200": "#E5E5E5",
          "300": "#D4D4D4",
          "400": "#A3A3A3",
          "500": "#737373",
          "600": "#525252",
          "700": "#404040",
          "800": "#262626",
          "900": "#171717",
        },
        success: {
          "50": "#EFFBF2",
          "100": "#DEF6E5",
          "200": "#BDEDCB",
          "300": "#9DE5B1",
          "400": "#7CDC97",
          "500": "#5BD37D",
          "600": "#49A964",
          "700": "#377F4B",
          "800": "#245432",
          "900": "#122A19",
        },
        info: {
          "50": "#EBF3FF",
          "100": "#D2E3FE",
          "200": "#A6C8FE",
          "300": "#79ACFD",
          "400": "#4D91FD",
          "500": "#2075FC",
          "600": "#1A5ECA",
          "700": "#134697",
          "800": "#0D2F65",
          "900": "#061732",
        },
        warning: {
          "50": "#FFF8EB",
          "100": "#FFF0D0",
          "200": "#FFE1A2",
          "300": "#FFD373",
          "400": "#FFC445",
          "500": "#FFB516",
          "600": "#CC9112",
          "700": "#996D0D",
          "800": "#664809",
          "900": "#332404",
        },
        danger: {
          "50": "#FFF1F0",
          "100": "#FFE3E1",
          "200": "#FFC7C4",
          "300": "#FFACA6",
          "400": "#FF9089",
          "500": "#FF746B",
          "600": "#CC5D56",
          "700": "#994640",
          "800": "#662E2B",
          "900": "#331715",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
} satisfies Config;

export default config;

// import type { Config } from "tailwindcss";

// const config2: Config = {
//   daisyui: {
//     themes: ["light"],
//   },
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./node_modules/flowbite/**/*.js",
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//       },
//       colors: {
//         primary: {
//           "50": "#F4FAF0",
//           "100": "#E3F2DA",
//           "200": "#C7E5B4",
//           "300": "#ACD98F",
//           "400": "#90CC69",
//           "500": "#74BF44",
//           "600": "#5D9936",
//           "700": "#467329",
//           "800": "#2E4C1B",
//           "900": "#17260E",
//         },
//         neutral: {
//           "50": "#F4FAF0",
//           "100": "#F5F5F5",
//           "200": "#E5E5E5",
//           "300": "#D4D4D4",
//           "400": "#A3A3A3",
//           "500": "#737373",
//           "600": "#525252",
//           "700": "#404040",
//           "800": "#262626",
//           "900": "#171717",
//         },
//         success: {
//           "50": "#EFFBF2",
//           "100": "#DEF6E5",
//           "200": "#BDEDCB",
//           "300": "#9DE5B1",
//           "400": "#7CDC97",
//           "500": "#5BD37D",
//           "600": "#49A964",
//           "700": "#377F4B",
//           "800": "#245432",
//           "900": "#122A19",
//         },
//         info: {
//           "50": "#EBF3FF",
//           "100": "#D2E3FE",
//           "200": "#A6C8FE",
//           "300": "#79ACFD",
//           "400": "#4D91FD",
//           "500": "#2075FC",
//           "600": "#1A5ECA",
//           "700": "#134697",
//           "800": "#0D2F65",
//           "900": "#061732",
//         },
//         warning: {
//           "50": "#FFF8EB",
//           "100": "#FFF0D0",
//           "200": "#FFE1A2",
//           "300": "#FFD373",
//           "400": "#FFC445",
//           "500": "#FFB516",
//           "600": "#CC9112",
//           "700": "#996D0D",
//           "800": "#664809",
//           "900": "#332404",
//         },
//         danger: {
//           "50": "#FFF1F0",
//           "100": "#FFE3E1",
//           "200": "#FFC7C4",
//           "300": "#FFACA6",
//           "400": "#FF9089",
//           "500": "#FF746B",
//           "600": "#CC5D56",
//           "700": "#994640",
//           "800": "#662E2B",
//           "900": "#331715",
//         },
//       },
//     },
//   },
//   plugins: [require("daisyui")],
// };
// export default config;
