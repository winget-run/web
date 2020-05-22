import App from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import { GridThemeProvider } from "styled-bootstrap-grid";

const gridTheme = {
  breakpoints: {
    xxl: 1400,
  },
  container: {
    maxWidth: {
      xl: 1478,
    },
  },
};

const styledTheme = {
  accent: "#327080",
  accentDark: "#195261",
  accentLight: "#64B0C4",
  text: "#fff",
  textFade: "#aaa",
  background: "#1f1f1f",
  darkGrey: "#111111",
  grey: "#2b2b2b",
  lightGrey: "#9d9d9d",
};

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={styledTheme}>
        <GridThemeProvider gridTheme={gridTheme}>
          <>
            <Component {...pageProps} />
          </>
        </GridThemeProvider>
      </ThemeProvider>
    );
  }
}
