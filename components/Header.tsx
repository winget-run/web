import { styled } from "../utils/theme";
import { Container, Row, Col, media } from "styled-bootstrap-grid";
import Link from "next/link";

import Search from "./Search";
import { useState, useEffect, createContext, useContext } from "react";

import { Search as SearchContext } from "../utils/state/Search";

const TopBar = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  width: 100%;
  z-index: 50;
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

const SearchContainer = (styled.div as any)`
  padding: 0 15px;
  margin: 0 auto;
  width: 100%;

  ${(x) =>
    x.fullWidth &&
    `
    max-width: 630px;
  `}

  h1 {
    font-size: 42px;
    margin: 0;
    line-height: 1;
    text-align: center;
    word-break: break-word;

    ${media.md`
      font-size: 71px;
    `}
  }
`;

const Links = styled(Col)`
  display: flex;
  align-items: center;
`;

const NavLink = styled.h2`
  position: relative;
  margin: 0 20px 0 0;
  display: none;
  font-size: 20px;
  font-weight: bold;
  height: auto;

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

  ${media.lg`
    display: inline-block;
  `}
`;

const SocialIcon = styled.img`
  margin-left: 15px;
  height: 37px;
  width: auto;
`;

const NavIcon = styled(SocialIcon)`
  margin-left: 0;
  margin-right: -15px;
  ${media.lg`
  margin-right: 30px;
  `}
`;

interface IProps {
  title?: string;
  showSearch?: boolean;
  totalPackages?: number;
  customBar?: boolean;
  children?: React.ReactChild | React.ReactChild[];
}

const Header = (props: IProps) => {
  const { search, updateSearch, updateResults, updateClear } = useContext(
    SearchContext
  );

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
          <Row justifyContent="between" alignItems="center">
            <Links col="auto">
              <Link href="/" as="/">
                <a>
                  <NavIcon
                    src={require("./icons/nav.svg")}
                    alt="winget.run logo"
                    title="Go home!"
                  />
                </a>
              </Link>
              <NavLink>
                <a href="https://github.com/microsoft/winget-cli/releases">
                  Install winget
                </a>
              </NavLink>
              <NavLink>
                <a href="https://docs.microsoft.com/en-us/windows/package-manager/">
                  Documentation
                </a>
              </NavLink>
            </Links>
            <Links
              col="auto"
              style={{ flex: "1 0", justifyContent: "flex-end" }}
            >
              <Search hidden={!showNavSearch} inNav />
              <a href="https://ko-fi.com/wingetdotrun">
                <SocialIcon
                  src={require("./icons/kofi.svg")}
                  alt="Support us on Ko-Fi!"
                  title="Support us on Ko-Fi!"
                />
              </a>
              <a href="https://github.com/winget-run">
                <SocialIcon
                  src={require("./icons/github.svg")}
                  alt="View on GitHub"
                  title="Contribute on GitHub"
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
                <h1>{props.title}</h1>
                {props.showSearch && (
                  <Search
                    resultsHidden={showNavSearch}
                    totalPackages={props.totalPackages}
                  />
                )}
              </SearchContainer>
            </Row>
          </Container>
        </SearchBar>
      )}
    </>
  );
};

export default Header;
