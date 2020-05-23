import Head from "next/head";
import Card from "../../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../../components/Header";

export default function Org() {
  return (
    <div className="container">
      <Head>
        <title>winget.run | Finding winget packages made simple.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Header title="Org name" />
      </header>
      <main>
        <Container>
          <Row>{/* Cards here */}</Row>
        </Container>
      </main>
    </div>
  );
}
