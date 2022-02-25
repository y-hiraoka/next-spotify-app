import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { chakraTheme } from "../common/chakra-theme";
import { SpotifyClientProvider } from "../hooks/spotify-client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={chakraTheme}>
      <SpotifyClientProvider>
        <Component {...pageProps} />
      </SpotifyClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
