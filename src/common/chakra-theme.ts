import { extendTheme, ThemeConfig, Theme, DeepPartial, Colors } from "@chakra-ui/react";

const themeConfig = {
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
};

export const chakraTheme = extendTheme(themeConfig);
