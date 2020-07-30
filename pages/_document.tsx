import Document, { Head, Main, NextScript } from "next/document";
import getConfig from "next/config";

import { css, Global } from "@emotion/core";
import { extractCritical } from "emotion-server";

export const globalStyles = (
  <Global
    styles={css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        font-family: Segoe UI, Arial, Helvetica, sans-serif;
      }
      body {
        margin: 0;
        background: #1f1f1f;
        color: white;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      main {
        padding-bottom: 150px;
      }

      a {
        text-decoration: none;
        cursor: pointer;
        color: inherit;
      }
      a:hover :first-child {
        text-decoration: underline;
      }
    `}
  />
);

export default class MyDocument extends Document {
  serverRuntimeConfig: any;
  publicRuntimeConfig: any;

  constructor(props) {
    super(props);
    this.serverRuntimeConfig = getConfig().serverRuntimeConfig;
    this.publicRuntimeConfig = getConfig().publicRuntimeConfig;
  }

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            data-emotion-css={styles.ids.join(" ")}
            dangerouslySetInnerHTML={{ __html: styles.css }}
          />
        </>
      ),
    };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link
            type="application/opensearchdescription+xml"
            rel="search"
            href={
              this.serverRuntimeConfig.K8S_ENV === "dev" ||
              this.publicRuntimeConfig.K8S_ENV === "dev"
                ? "https://dev-web.winget.run/opensearch.osdx"
                : "https://winget.run/opensearch.osdx"
            }
          />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="theme-color" content="#327080" />
          <meta
            name="twitter:image"
            content={
              this.serverRuntimeConfig.K8S_ENV === "dev" ||
              this.publicRuntimeConfig.K8S_ENV === "dev"
                ? "https://dev-web.winget.run/twitter_card.jpg"
                : "https://winget.run/twitter_card.jpg"
            }
          />
          <meta
            name="keywords"
            content="winget, winget packages, winget online, windows, windows package manager, run winget, winget run, wingetdotrun, windows 10 package manager, windows 10"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
