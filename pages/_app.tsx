import App from "next/app";
import { cache } from "emotion";
import { CacheProvider } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { globalStyles } from "./_document";
import { theme } from "../utils/theme";
import StateWrapper from "../utils/state";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <StateWrapper>
        <CacheProvider value={cache}>
          {globalStyles}
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </StateWrapper>
    );
  }
}
