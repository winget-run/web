import Head from "next/head";
import Card from "../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../components/Header";
import DownloadBar from "../components/DownloadBar";
import { useState, useEffect } from "react";
import getPackages, { IPackage } from "../api/getPackages";
import useSWR, { useSWRPages } from "swr";
import LoadMore from "../components/LoadMore";

export default function Home(props) {
  const [selectedPackages, setSelectedPackages] = useState([]);

  const handleAddPackage = (add: boolean, data: IPackage) => {
    if (add) {
      setSelectedPackages((prev) => [...prev, data]);
    } else {
      setSelectedPackages((prev) => prev.filter((x) => x !== data));
    }
  };

  const { pages, isLoadingMore, loadMore, pageSWRs, pageCount } = useSWRPages(
    "allPackages",
    ({ offset, withSWR }) => {
      let initialData = null;

      if (!offset) {
        initialData = props.data;
      }

      const { data } = withSWR(
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useSWR(`?page=${offset || 0}`, getPackages, { initialData })
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
            selected={selectedPackages.find((x) => x.Id === e.Id)}
            addFn={handleAddPackage}
          />
        </Col>
      ));
    },
    () => pageCount,
    // deps of the page component
    []
  );

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
        <Header
          showSearch
          title="winget.run"
          totalPackages={pageSWRs[0]?.data.total}
        />
      </header>
      <main>
        <Container>
          <Row>{pages}</Row>
          <LoadMore onClick={loadMore} />
        </Container>
        <DownloadBar packages={selectedPackages} />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const data = await getPackages();
  return { props: { data } };
}
