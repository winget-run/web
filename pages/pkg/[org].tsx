import Head from "next/head";
import Card from "../../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../../components/Header";
import getOrgPackages from "../../api/getOrgPackages";
import useSWR from "swr";
import { IResponse, IPackage } from "../../api/getPackages";
import { useState } from "react";
import { useRouter } from "next/router";
import DownloadBar from "../../components/DownloadBar";
import Error from "../_error";

export default function Org(props) {
  const router = useRouter();
  const { org } = router.query;

  const initialData = props.data;
  console.log(props);
  const { data } = useSWR(org, getOrgPackages, { initialData });
  const [packages, setPackages] = useState([]);

  const handleAddPackage = (add: boolean, data: IPackage) => {
    if (add) {
      setPackages([...packages, data]);
    } else {
      setPackages(packages.filter((x) => x !== data));
    }
  };

  if (data.packages.length === 0) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="container">
      <Head>
        <title>winget.run | Finding winget packages made simple.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Header title={data.packages[0].Publisher || org} />
      </header>
      <main>
        <Container>
          <Row>
            {(data as IResponse).packages.map((e) => (
              <Col md={6} lg={4} xl={3}>
                <Card
                  package={e}
                  title={e.Name}
                  org={e.Publisher}
                  description={e.Description}
                  id={e.Id}
                  selected={packages.find((x) => x === e)}
                  addFn={handleAddPackage}
                />
              </Col>
            ))}
          </Row>
        </Container>
        <DownloadBar packages={packages} />
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const data = await getOrgPackages(params.org);

  return { props: { data } };
}
