import Head from "next/head";
import Card from "../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../components/Header";
import DownloadModal from "../components/DownloadModal";
import getPackages, { IResponse } from "../api/getPackages";
import { useState, useEffect } from "react";
import LoadMore from "../components/LoadMore";
import { useRouter } from "next/router";
import SectionHeader from "../components/SectionHeader";
import { parseQueryString } from "../utils/helperFunctions";
import Tag from "../components/Tag";

export default function Search({ data }: { data: IResponse }) {
  const router = useRouter();
  const [packages, setPackages] = useState(data.Packages);
  const [searchTerm, setSearchTerm] = useState(router.query.q);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = () => {
    setIsLoading(true);
    getPackages(
      `packages?ensureContains=true&partialMatch=true&take=12&${parseQueryString(
        router.query
      )}&page=${page + 1}`
    ).then((e: IResponse) => {
      setPackages((prev) => [...prev, ...e.Packages]);
      setPage((prev) => ++prev);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    setPage(0);
    getPackages(
      `packages?ensureContains=true&partialMatch=true&take=12&${parseQueryString(
        router.query
      )}`
    ).then((e: IResponse) => {
      setPackages(e.Packages);
      setIsLoading(false);
    });
  }, [router.query]);

  return (
    <div className="container">
      <Head>
        <title>Search results for {searchTerm} | winget.run</title>
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
        <Header showSearch title="winget.run" />
      </header>
      <main>
        <Container>
          <Row>
            <Col col={12}>
              <SectionHeader>
                Results for{" "}
                {Object.entries(router.query).map((e) => (
                  <code>
                    <span>{e[0]}: </span>
                    {e[1]}
                  </code>
                ))}
                <span>
                  {packages.length} result{packages.length !== 1 ? "s" : ""}
                </span>
              </SectionHeader>
            </Col>
          </Row>
          <Row>
            {packages.map((e) => (
              <Col key={e.Id} md={6} lg={4} xl={3}>
                <Card p={e} />
              </Col>
            ))}
          </Row>
        </Container>
        {packages.length < data.Total && (
          <LoadMore onClick={loadMore} isLoading={isLoading} />
        )}
        <DownloadModal />
      </main>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  try {
    const data = await getPackages(
      `packages?ensureContains=true&partialMatch=true&take=12&${parseQueryString(
        query
      )}`
    );
    return { props: { data } };
  } catch (error) {
    return { props: { data: { packages: [], total: 0 } } };
  }
}
