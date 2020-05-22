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
              }
              a:hover :first-child {
                text-decoration: underline;
              }
            
              main {
                margin-top: 60px;
              }
            `}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
