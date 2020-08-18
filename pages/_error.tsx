import styled from "../utils/theme";
import { Container, Row, Col } from "../utils/grid";
import { mediaBreakpointDown } from "react-grid";

import Link from "next/link";
import Head from "next/head";

const Background = styled.div`
  /* Fallback to table for browsers that don't support grid in 2020 */
  display: table;
  display: grid;
  padding: 30px 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: url("/background.svg") ${(x) => x.theme.background} 10px 10px
    fixed;

  > div,
  > div > div {
    height: 100%;
  }
  > div > div {
    align-items: center;
  }
`;

const Image = styled.img`
  margin: 0 auto;
  display: block;
  max-width: 100%;
`;

const TextContainer = styled.div`
  width: 100%;
  padding: 40px;
  background-color: ${(x) => x.theme.background};
  ${mediaBreakpointDown("sm")} {
    padding: 30px;
  }

  h1 {
    font-size: 71px;
    margin: 0;
    ${mediaBreakpointDown("sm")} {
      font-size: 48px;
    }
  }
  h2 {
    font-size: 47px;
    margin: 0 0 74px;
    ${mediaBreakpointDown("sm")} {
      font-size: 32px;
    }
  }
  a {
    display: inline-block;
    padding: 18px 40px;
    border-radius: 8px;
    background-color: #363636;
    font-size: 22px;
    font-weight: 700;
    margin: 0;
    transition: background-color 250ms ease;

    &:hover {
      background-color: ${(x) => x.theme.darkGrey};
    }
  }
`;

function Error({ statusCode }) {
  return (
    <>
      <Head>
        <title>
          {statusCode === 404 ? "Page not found" : "An error occured"} |
          winget.run
        </title>
      </Head>
      <Background>
        <Container>
          <Row>
            <Col hiddenLgDown lg={6}>
              <Image src="/error_tess.svg" alt="" />
            </Col>
            <Col lg={6}>
              <TextContainer>
                <h1>{statusCode ? statusCode : "oof"}</h1>
                <h2>
                  {statusCode === 404 ? "Page not found" : "An error occured"}
                </h2>
                <Link href="/">
                  <a>Return home?</a>
                </Link>
              </TextContainer>
            </Col>
          </Row>
        </Container>
      </Background>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
