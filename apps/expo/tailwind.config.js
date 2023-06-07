// TODO: Add support for TS config files in Nativewind.

// import { type Config } from "tailwindcss";

// import baseConfig from "@acme/tailwind-config";

// export default {
//   presets: [baseConfig],
//   content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
// } satisfies Config;

const config = {
  theme: {
    fontFamily: {
      sans: ['Prata'],
    },
    colors: {
      primary: "#F27052",
      primaryLight: "#F89E7C",
      backgroundBlk: "#232323",
      bone: "#EAE8E1",
      accentDark: "#BF5841",
      accentLight: "#cdcdcd",
      niceBlue: "#BF5841",
      backgroundGr: "#5555",
      primaryGreen: "#70A198",
      primaryGreenLight: "#89B39E",
    },
  },
  content: ["./src/**/*.{ts,tsx}"],
};

module.exports = config;
