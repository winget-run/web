import Head from "next/head";
import Card from "../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>winget.run | Finding winget packages made simple.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Header />
      </header>
      <main>
        <Container>
          <Row>
            {Array.from(new Array(16)).map((e) => (
              <Col md={6} lg={4} xl={3}>
                <Card
                  title="arduino"
                  org="test"
                  description="test"
                  id="test.test"
                />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </div>
  );
}
