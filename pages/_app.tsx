import App from "next/app";
import { cache } from "emotion";
import { CacheProvider } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { globalStyles } from "./_document";
import { theme } from "../utils/theme";
import StateWrapper from "../utils/state";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <StateWrapper>
        <CacheProvider value={cache}>
          {globalStyles}
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
            <ToastContainer autoClose={2000} hideProgressBar />
          </ThemeProvider>
        </CacheProvider>
      </StateWrapper>
    );
  }
}
