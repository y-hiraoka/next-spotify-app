import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { WebPlaybackProvider } from "../components/WebPlaybackProvider";
import { SpotifyClientProvider } from "../state/spotify-client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <SpotifyClientProvider>
        <WebPlaybackProvider>
          <Component {...pageProps} />
        </WebPlaybackProvider>
      </SpotifyClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
