import { styled } from "../utils/theme";
import { Container, Row, Col, media } from "styled-bootstrap-grid";
import Link from "next/link";

import Search from "./Search";

const TopBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  height: 50px;
  padding: 0;
  background: ${(x) => x.theme.accentDark};
`;

export const SearchBar = styled.div`
  margin: 50px 0 60px;
  background: url("/header_tess.svg") center no-repeat;
  padding: 85px 0;
  position: relative;
  &::before {
    content: "";
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url("/background.svg") ${(x) => x.theme.accent} 3px 1px fixed;
  }
`;

const SearchContainer = styled.div`
  max-width: 630px;
  padding: 0 15px;
  margin: 0 auto;
  width: 100%;

  h1 {
    font-size: 71px;
    margin: 0;
    line-height: 1;
    text-align: center;
  }
`;

const Title = styled.h1`
  margin: 0 50px 0 0;
  display: inline-block;
  height: 50px;
  font-size: 24px;
  line-height: 1.8;
`;

const NavLink = styled.h2`
  margin: 0 20px 0 0;
  display: none;
  height: 50px;
  font-size: 16px;
  font-weight: normal;
  height: auto;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }

  ${media.md`
    display: inline-block;
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
  return (
    <>
      <TopBar>
        <Container>
          <Row justifyContent="between" alignItems="center">
            <Col col="auto">
              <Link href="/" as="/">
                <a>
                  <Title>winget.run</Title>
                </a>
              </Link>

              <NavLink>
                <a href="https://docs.microsoft.com/en-us/windows/package-manager/">
                  Documentation
                </a>
              </NavLink>
            </Col>
            <Col col="auto">
              <a href="https://github.com/winget-run">
                <img src={require("./icons/github.svg")} alt="View on GitHub" />
              </a>
            </Col>
          </Row>
        </Container>
      </TopBar>
      {props.customBar ? (
        props.children
      ) : (
        <SearchBar>
          <Container>
            <Row>
              <SearchContainer>
                <h1>{props.title}</h1>
                {props.showSearch && (
                  <Search totalPackages={props.totalPackages} />
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
