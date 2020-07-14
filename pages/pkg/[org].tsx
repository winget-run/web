import Head from "next/head";
import Card from "../../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../../components/Header";
import getPackages, { IResponse, IPackage } from "../../api/getPackages";
import { useState } from "react";
import { useRouter } from "next/router";
import DownloadModal from "../../components/DownloadModal";
import Error from "../_error";
import LoadMore from "../../components/LoadMore";
import SectionHeader from "../../components/SectionHeader";

export default function Org({ data }: { data: IResponse }) {
  const router = useRouter();
  const { org } = router.query;

  const [packages, setPackages] = useState(data.Packages);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  if (data.Packages == null || data.Packages.length === 0) {
    return <Error statusCode={404} />;
  }

  const loadMore = () => {
    setIsLoading(true);
    getPackages(`packages/${org}?page=${page + 1}`).then((e: IResponse) => {
      setPackages((prev) => [...prev, ...e.Packages]);
      setPage((prev) => ++prev);
      setIsLoading(false);
    });
  };

  return (
    <div className="container">
      <Head>
        <title>
          Download and install packages by {packages[0].Latest.Publisher} with
          winget
        </title>
        <meta
          name="description"
          content={`View packages by ${packages[0].Latest.Publisher} on winget.run`}
        />
        <meta
          name="twitter:title"
          content={`${packages[0].Latest.Publisher} on winget.run`}
        />
        <meta
          name="twitter:description"
          content={`View packages by ${packages[0].Latest.Publisher} on winget.run`}
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
                Packages by {packages[0].Latest.Publisher}
                <span>{data.Total} packages</span>
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

export async function getServerSideProps({ params }) {
  const data = await getPackages(`packages/${params.org}`);

  return { props: { data } };
}
