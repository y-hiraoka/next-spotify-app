import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { chakraTheme } from "../common/chakra-theme";
import { SpotifyClientProvider } from "../hooks/spotify-client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Spotify Clone App</title>
        <meta name="description" content="Complete Spotify clone app." />
        <meta property="og:description" content="Complete Spotify clone app." />
        <meta property="og:title" content="Spotify Clone App" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Spotify Clone App" />
      </Head>
      <ChakraProvider theme={chakraTheme}>
        <SpotifyClientProvider>
          <Component {...pageProps} />
        </SpotifyClientProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
