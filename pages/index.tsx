import Head from "next/head";
import Card from "../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../components/Header";
import DownloadBar from "../components/DownloadBar";
import getPackages, { IResponse } from "../api/getPackages";

export default function Home({ data }: { data: IResponse }) {
  return (
    <div className="container">
      <Head>
        <title>winget.run | Finding winget packages made simple.</title>
        <meta
          name="description"
          content="Searching, discovering and installing winget packages made effortless without any third-party programs"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@wingetdotrun" />
        <meta name="twitter:title" content="winget.run" />
        <meta
          name="twitter:description"
          content="Searching, discovering and installing winget packages made effortless without any third-party programs"
        />
      </Head>
      <header>
        <Header showSearch title="winget.run" totalPackages={data.total} />
      </header>
      <main>
        <Container>
          <Row>
            {data.packages.map((e) => (
              <Col key={e.Id} md={6} lg={4} xl={3}>
                <Card
                  package={e}
                  title={e.latest.Name}
                  org={e.latest.Publisher}
                  description={e.latest.Description}
                  id={e.Id}
                />
              </Col>
            ))}
          </Row>
        </Container>
        <DownloadBar />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const data = await getPackages(
    `search?name=&limit=24&sort=updatedAt&order=-1`
  );
  return { props: { data } };
}
