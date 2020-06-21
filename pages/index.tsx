import Head from "next/head";
import Card from "../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../components/Header";
import DownloadModal from "../components/DownloadModal";
import getPackages, { IResponse } from "../api/getPackages";
import { useState, useEffect } from "react";
import LoadMore from "../components/LoadMore";
import { useRouter } from "next/router";

export default function Home({ data }: { data: IResponse }) {
  const [packages, setPackages] = useState(data.packages);
  const [page, setPage] = useState(0);

  const loadMore = () => {
    getPackages(
      `search?name=&limit=24&sort=updatedAt&order=-1&page=${page + 1}`
    ).then((e: IResponse) => {
      setPackages((prev) => [...prev, ...e.packages]);
      setPage((prev) => ++prev);
    });
  };

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
            {packages.map((e) => (
              <Col key={e.Id} md={6} lg={4} xl={3}>
                <Card p={e} />
              </Col>
            ))}
          </Row>
        </Container>
        {packages.length < data.total && <LoadMore onClick={loadMore} />}
        <DownloadModal />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const data = await getPackages(
      `search?name=&limit=24&sort=updatedAt&order=-1`
    );
    return { props: { data } };
  } catch (error) {
    return { props: { data: { packages: [], total: 0 } } };
  }
}
