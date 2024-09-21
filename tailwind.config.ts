import { Config } from "tailwindcss"

const config: Config = {
  content: ["app/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        foreground: "#190c0a",
        background: "#fbf6f5",
        primary: "#ed6a5a",
        secondary: "#5ca4a9",
      },
    },
  },
}

export default config
