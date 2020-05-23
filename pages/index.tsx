import Head from "next/head";
import Card from "../components/Card";
import { Container, Row, Col } from "styled-bootstrap-grid";
import Header from "../components/Header";
import DownloadBar from "../components/DownloadBar";
import { useState } from "react";
import getPackages, { IPackage } from "../api/getPackages";
import useSWR from "swr";
import { IResponse } from "../api/getPackages";

export default function Home(props) {
  const initialData = props.data;
  const { data } = useSWR("home", getPackages, { initialData });
  const [packages, setPackages] = useState([]);

  const handleAddPackage = (add: boolean, data: IPackage) => {
    if (add) {
      setPackages([...packages, data]);
    } else {
      setPackages(packages.filter((x) => x !== data));
    }
  };

  return (
    <div className="container">
      <Head>
        <title>winget.run | Finding winget packages made simple.</title>
      </Head>
      <header>
        <Header showSearch title="winget.run" totalPackages={data.total} />
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

export async function getServerSideProps() {
  const data = await getPackages();
  return { props: { data } };
}
