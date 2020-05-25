import Head from "next/head";
import Card from "../../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../../components/Header";
import useSWR, { useSWRPages } from "swr";
import getPackages, { IResponse, IPackage } from "../../api/getPackages";
import { useState } from "react";
import { useRouter } from "next/router";
import DownloadBar from "../../components/DownloadBar";
import Error from "../_error";
import LoadMore from "../../components/LoadMore";

export default function Org(props) {
  const router = useRouter();
  const { org } = router.query;

  const {
    pages,
    isLoadingMore,
    isReachingEnd,
    loadMore,
    pageSWRs,
    pageCount,
  } = useSWRPages(
    "allPackages",
    ({ offset, withSWR }) => {
      let initialData = null;

      if (!offset) {
        initialData = props.data;
      }

      const { data } = withSWR(
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useSWR(`${org}?page=${offset || 0}`, getPackages, {
          initialData,
        })
      );

      if (!data) return null;

      const { packages }: { packages: IPackage[] } = data;

      return packages.map((e) => (
        <Col key={e.Id} md={6} lg={4} xl={3}>
          <Card
            package={e}
            title={e.latest.Name}
            org={e.latest.Publisher}
            description={e.latest.Description}
            id={e.Id}
          />
        </Col>
      ));
    },
    ({ data }) => (data?.total > pageCount * 12 ? pageCount : null),
    // deps of the page component
    []
  );

  if (pageSWRs[0]?.data.packages.length === 0) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="container">
      <Head>
        <title>
          Packages by {props.data.packages[0].latest.Publisher} | winget.run
        </title>
        <meta
          name="description"
          content={`View packages by ${props.data.packages[0].latest.Publisher} on winget.run`}
        />
        <meta
          name="twitter:title"
          content={`${props.data.packages[0].latest.Publisher} on winget.run`}
        />
        <meta
          name="twitter:description"
          content={`View packages by ${props.data.packages[0].latest.Publisher} on winget.run`}
        />
      </Head>
      <header>
        <Header title={props.data.packages[0].latest.Publisher} />
      </header>
      <main>
        <Container>
          <Row>{pages}</Row>
        </Container>
        {!isReachingEnd && <LoadMore onClick={loadMore} />}
        <DownloadBar />
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const data = await getPackages(`${params.org}`);

  return { props: { data } };
}
