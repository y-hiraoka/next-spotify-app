import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { WebPlaybackProvider } from "../components/WebPlaybackProvider";
import { AccessTokenProvider } from "../state/token";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AccessTokenProvider>
        <WebPlaybackProvider>
          <Component {...pageProps} />
        </WebPlaybackProvider>
      </AccessTokenProvider>
    </ChakraProvider>
  );
}

export default MyApp;
