import baseStyled, { ThemedStyledInterface } from "styled-components";

export const theme = {
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

export type Theme = typeof theme;
export const styled = baseStyled as ThemedStyledInterface<Theme>;
