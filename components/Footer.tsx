import styled from "../utils/theme";
import { mediaBreakpointDown } from "react-grid";

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 60px 0;
  border-top: 8px solid #327080;
  background-color: #111;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &::before {
    background: url("/background.svg") 3px 20px fixed;
    opacity: 0.5;
  }

  &::after {
    background: linear-gradient(to bottom, #111, transparent);
  }

  * {
    z-index: 1;
  }
`;

const Links = styled.div`
  margin-bottom: 60px;
  a {
    margin: 0 15px;
    font-size: 18px;
    font-weight: 700;
    &:hover {
      text-decoration: underline;
    }

    ${mediaBreakpointDown("sm")} {
      display: block;
      text-align: center;
      margin-bottom: 15px;
      &::last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    max-width: 100%;
    padding: 0 15px;
  }
  small {
    margin-top: 20px;
    font-size: 12px;
  }
`;

const Footer = () => (
  <StyledFooter>
    <Links>
      <a href="https://docs.microsoft.com/en-us/windows/package-manager/">
        About Winget
      </a>
      <a href="https://docs.winget.run/docs/introduction">API Documentation</a>
      <a href="https://github.com/winget-run/wingetdotrun">GitHub</a>
      <a href="https://twitter.com/feinwaru">Twitter</a>
      <a href="https://ko-fi.com/wingetdotrun">Support Us</a>
    </Links>
    <Logo>
      <img src="/footer_logo.svg" alt="winget.run by Feinwaru Software" />
      <small>
        © 2017 - {new Date().getFullYear()} Copyright: Feinwaru Software
      </small>
    </Logo>
  </StyledFooter>
);

export default Footer;
