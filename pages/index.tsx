import Head from "next/head";
import Card from "../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../components/Header";
import DownloadBar from "../components/DownloadBar";
import { useState } from "react";

export default function Home() {
  const [packages, setPackages] = useState([]);

  const handleAddPackage = (add: boolean, title: string) => {
    if (add) {
      setPackages([...packages, title]);
    } else {
      setPackages(packages.filter((x) => x !== title));
    }
  };

  return (
    <div className="container">
      <Head>
        <title>winget.run | Finding winget packages made simple.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Header showSearch title="winget.run" />
      </header>
      <main>
        <Container>
          <Row>
            <Col md={6} lg={4} xl={3}>
              <Card
                title="arduino"
                org="test"
                description="test"
                id="test.test"
                selected={packages.find((e) => e === "arduino")}
                addFn={handleAddPackage}
              />
            </Col>
            <Col md={6} lg={4} xl={3}>
              <Card
                title="github"
                org="test"
                description="test"
                id="test.test"
                selected={packages.find((e) => e === "github")}
                addFn={handleAddPackage}
              />
            </Col>
            <Col md={6} lg={4} xl={3}>
              <Card
                title="test"
                org="test"
                description="test"
                id="test.test"
                selected={packages.find((e) => e === "test")}
                addFn={handleAddPackage}
              />
            </Col>
          </Row>
        </Container>
        <DownloadBar packages={packages} />
      </main>
    </div>
  );
}
