import App from "next/app";
import React, { createContext, useReducer } from "react";
import { ThemeProvider } from "styled-components";
import { GridThemeProvider } from "styled-bootstrap-grid";
import { theme } from "../utils/theme";
import StateWrapper from "../components/StateWrapper";

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
export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <StateWrapper>
        <ThemeProvider theme={theme}>
          <GridThemeProvider gridTheme={gridTheme}>
            <>
              <Component {...pageProps} />
            </>
          </GridThemeProvider>
        </ThemeProvider>
      </StateWrapper>
    );
  }
}
