import { extendTheme, ThemeConfig, Theme, DeepPartial, Colors } from "@chakra-ui/react";

const themeConfig = {
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    green: {
      "50": "#E9FCF0",
      "100": "#C1F5D4",
      "200": "#9AEFB8",
      "300": "#72E99C",
      "400": "#4AE380",
      "500": "#23DC64",
      "600": "#1CB050",
      "700": "#15843C",
      "800": "#0E5828",
      "900": "#072C14",
    },
  },
  styles: {
    global: {
      "html, body, #__next": {
        height: "100%",
      },
    },
  },
};

export const chakraTheme = extendTheme(themeConfig);
