import styled from "styled-components";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Link from "next/link";

import Search from "./Search";

const TopBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  height: 50px;
  padding: 0;
  background: ${(x: any) => x.theme.accentDark};

  h1 {
    font-size: 24px;
    line-height: 1.8;
  }
`;

const SearchBar = styled.div`
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
    background: url("/background.svg") ${(x: any) => x.theme.accent} 3px 1px
      fixed;
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
  margin: 0;
`;

interface IProps {
  title: string;
  showSearch?: boolean;
  totalPackages?: number;
}

const Header = (props: IProps) => {
  return (
    <>
      <TopBar>
        <Container>
          <Row>
            <Col col={6}>
              <Link href="/" as="/">
                <a>
                  <Title>winget.run</Title>
                </a>
              </Link>
            </Col>
          </Row>
        </Container>
      </TopBar>
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
    </>
  );
};

export default Header;
