import { useState, useEffect } from "react";
import { mediaBreakpointDown, mediaBreakpointUp } from "react-grid";
import Link from "next/link";

import styled from "../utils/theme";
import { Container, Row, Col } from "../utils/grid";
import Search from "./Search";

const TopBar = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  width: 100%;
  z-index: 666;
  height: 70px;
  padding: 0;
  background: ${(x) => x.theme.accent};
`;

export const SearchBar = styled.div`
  margin: 70px 0 60px;
  background: url("/header_tess.svg") center no-repeat;
  padding: 80px 0;
  position: relative;
  &::before {
    content: "";
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url("/background.svg") ${(x) => x.theme.accent} 3px 20px fixed;
  }
`;

const SearchContainer = styled.div<{ fullWidth: boolean }>`
  padding: 0 15px;
  margin: 0 auto;
  width: 100%;

  ${(x) =>
    x.fullWidth &&
    `
    max-width: 630px;
  `}

  h1 {
    font-size: 71px;
    margin: 0;
    line-height: 1;
    text-align: center;
    word-break: break-word;

    ${mediaBreakpointDown("sm")} {
      font-size: 42px;
    }
  }
`;

const Links = styled(Col)`
  display: flex;
  align-items: center;
  ${mediaBreakpointDown("sm")} {
    flex-grow: 0;
  }

  &.socials {
    flex: 1 0;
    justify-content: flex-end;
    > a {
      ${mediaBreakpointUp("lg")} {
        display: none;
      }
    }
  }
`;

const NavLink = styled.h2`
  position: relative;
  margin: 0 30px 0 0;
  display: inline-block;
  font-size: 20px;
  font-weight: bold;
  height: auto;

  ${mediaBreakpointDown("md")} {
    display: none;
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 0px;
    left: 0;
    bottom: -21px;
    background-color: white;
    transition: 150ms ease;
  }

  &:hover {
    &::after {
      height: 4px;
      transition: 150ms cubic-bezier(0.26, 1.29, 0.7, 1.18);
    }
  }

  &:last-of-type {
    margin: 0;
  }

  a:hover {
    text-decoration: none !important;
  }
`;

const SocialIcon = styled.img`
  margin-left: 15px;
  height: 37px;
  width: auto;
`;

const NavIcon = styled(SocialIcon)`
  margin-left: 0;
  margin-right: 30px;
  ${mediaBreakpointDown("md")} {
    margin-right: -15px;
  }
`;

interface IProps {
  title?: string;
  showSearch?: boolean;
  customBar?: boolean;
  children?: React.ReactChild | React.ReactChild[];
}

const Header = (props: IProps) => {
  // props.customBar used to check if were on the front page
  // hide nav search on main page and show it on any other page by default
  const [showNavSearch, setShowNavSearch] = useState(true && props.customBar);

  const handleScroll = () =>
    setShowNavSearch(window.scrollY > 254 || props.customBar);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <TopBar>
        <Container>
          <Row css={{ justifyContent: "between", alignItems: "center" }}>
            <Links col="auto" role="nav">
              <Link href="/" as="/">
                <a>
                  <NavIcon
                    src={require("./icons/nav.svg")}
                    alt="winget.run logo"
                    title="Stay home!"
                  />
                </a>
              </Link>
              <NavLink>
                <a href="https://github.com/microsoft/winget-cli/releases">
                  Install winget
                </a>
              </NavLink>
              <NavLink>
                <a href="https://github.com/winget-run">GitHub</a>
              </NavLink>
              <NavLink>
                <a href="https://ko-fi.com/wingetdotrun">Support us</a>
              </NavLink>
            </Links>
            <Links col="auto" className="socials">
              <Search hidden={!showNavSearch} inNav />
              <a href="https://ko-fi.com/wingetdotrun">
                <SocialIcon
                  src={require("./icons/kofi.svg")}
                  alt="Support us on Ko-Fi!"
                />
              </a>
              <a href="https://github.com/winget-run">
                <SocialIcon
                  src={require("./icons/github.svg")}
                  alt="View on GitHub"
                />
              </a>
            </Links>
          </Row>
        </Container>
      </TopBar>
      {props.customBar ? (
        props.children
      ) : (
        <SearchBar>
          <Container>
            <Row>
              <SearchContainer fullWidth={props.showSearch}>
                <h1 role="heading" aria-level={1}>
                  {props.title}
                </h1>
                {props.showSearch && <Search resultsHidden={showNavSearch} />}
              </SearchContainer>
            </Row>
          </Container>
        </SearchBar>
      )}
    </>
  );
};

export default Header;
