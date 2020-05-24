import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();

    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />)
    );

    const styleTags = sheet.getStyleElement();

    return { ...page, styleTags };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          {/* @ts-ignore */}
          {this.props.styleTags}
          <style>
            {`
              *, *::before, *::after {
                box-sizing: border-box;
                font-family: Segoe UI, Arial, Helvetica, sans-serif;
              }
              body {
                margin: 0;
                background: #1F1F1F;
                color: white;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
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
          </style>
          <link rel="icon" href="/favicon.ico" />
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="theme-color" content="#327080" />
          <meta
            name="twitter:image"
            content="https://winget.run/twitter_card.jpg"
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
