import styled from "styled-components";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Search from "./Search";

const TopBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  height: 50px;
  padding: 0;
  background: ${(x: any) => x.theme.accentDark};
`;

const SearchBar = styled.div`
  margin-top: 50px;
  background: ${(x: any) => x.theme.accent};
  padding: 85px 0;
`;

const SearchContainer = styled.div`
  max-width: 630px;
  padding: 0 15px;
  margin: 0 auto;
  width: 100%;

  h1 {
    font-size: 71px;
    margin: 0 0 47px;
    line-height: 1;
    text-align: center;
  }
`;

const Title = styled.h1`
  margin: 0;
`;

const Header = () => {
  return (
    <>
      <TopBar>
        <Container>
          <Row>
            <Col col={6}>
              <Title>winget.run</Title>
            </Col>
          </Row>
        </Container>
      </TopBar>
      <SearchBar>
        <Container>
          <Row>
            <SearchContainer>
              <h1>winget.run</h1>
              <Search />
            </SearchContainer>
          </Row>
        </Container>
      </SearchBar>
    </>
  );
};

export default Header;
