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

export default function Org(props) {
  const router = useRouter();
  const { org } = router.query;

  const [selectedPackages, setSelectedPackages] = useState([]);

  const handleAddPackage = (add: boolean, data: IPackage) => {
    if (add) {
      setSelectedPackages((prev) => [...prev, data]);
    } else {
      setSelectedPackages((prev) => prev.filter((x) => x !== data));
    }
  };

  const { pages, isLoadingMore, loadMore, pageSWRs, pageCount } = useSWRPages(
    org as string,
    ({ offset, withSWR }) => {
      let initialData = null;

      if (!offset) {
        initialData = props.data;
      }
      const { data } = withSWR(
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useSWR(`${org}?page=${offset || 0}`, getPackages, { initialData })
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

  if (pageSWRs[0]?.data.packages.length === 0) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="container">
      <Head>
        {/* TODO: add meta tags */}
        <title>winget.run | Finding winget packages made simple.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Header title={pageSWRs[0]?.data.packages[0].Publisher || org} />
      </header>
      <main>
        <Container>
          <Row>{pages}</Row>
        </Container>
        <DownloadBar packages={selectedPackages} />
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const data = await getPackages(params.org);

  return { props: { data } };
}
