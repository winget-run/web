import styled, { CreateStyled } from "@emotion/styled";

export const theme = {
  accent: "#327080",
  accentDarker: "#094555",
  accentDark: "#195261",
  accentLight: "#64B0C4",
  text: "#fff",
  textFade: "#aaa",
  background: "#1f1f1f",
  darkGrey: "#111111",
  grey: "#2b2b2b",
  lightGrey: "#9d9d9d",
  dirtyWhite: "#EEE",
};

type Theme = {
  accent: "#327080";
  accentDarker: "#094555";
  accentDark: "#195261";
  accentLight: "#64B0C4";
  text: "#fff";
  textFade: "#aaa";
  background: "#1f1f1f";
  darkGrey: "#111111";
  grey: "#2b2b2b";
  lightGrey: "#9d9d9d";
  dirtyWhite: "#EEE";
};

export default styled as CreateStyled<Theme>;
