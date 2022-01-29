import { ColorModeScript } from "@chakra-ui/react";
import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import { chakraTheme } from "../common/chakra-theme";

class MyDocument extends Document {
  static async getInitialProps(context: DocumentContext) {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
