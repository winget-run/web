import Head from "next/head";
import Card from "../components/Card";
import { Container, Row, Col } from "../utils/grid";
import Header from "../components/Header";
import DownloadModal from "../components/DownloadModal";
import getPackages, { IResponse } from "../api/getPackages";
import { useState, useEffect, useContext } from "react";
import LoadMore from "../components/LoadMore";
import { Router, useRouter } from "next/router";
import {
  SectionHeaderWithFilters,
  SortSelectWrapper,
  SortSelect,
  OrderButton,
} from "../components/SectionHeaderWithFilters";
import { parseQueryString } from "../utils/helperFunctions";
import styled from "../utils/theme";

const orderOptions = {
  Ascending: 1,
  Descending: -1,
};

const sortOptions = {
  Name: "Latest.Name",
  Publisher: "Latest.Publisher",
  Updated: "UpdatedAt",
};

export default function Search({ data }: { data: IResponse }) {
  const { query } = useRouter();
  const [packages, setPackages] = useState(data.Packages);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(parseInt(query.order as string) || null);
  const [sort, setSort] = useState((query.sort as string) || null);

  const loadMore = () => {
    setIsLoading(true);
    getPackages(
      `packages?ensureContains=true&partialMatch=true&take=12&${parseQueryString(
        query
      )}&page=${page + 1}`
    ).then((e: IResponse) => {
      setPackages((prev) => [...prev, ...e.Packages]);
      setPage((prev) => ++prev);
      setIsLoading(false);
    });
  };

  const handleSetOrder = () => {
    if (order === null || order === orderOptions.Descending) {
      setOrder(orderOptions.Ascending);
    } else {
      setOrder(orderOptions.Descending);
    }
  };

  useEffect(() => {
    const additions = { order, sort };
    order === null && delete additions.order;
    sort === null && delete additions.sort;

    setIsLoading(true);
    setPage(0);
    getPackages(
      `packages?ensureContains=true&partialMatch=true&take=12&${parseQueryString(
        { ...query, ...additions }
      )}`
    ).then((e: IResponse) => {
      if (e.Packages) {
        setPackages(e.Packages);
      } else {
        setPackages([]);
      }
      setIsLoading(false);
    });
  }, [query, order, sort]);

  return (
    <div className="container">
      <Head>
        <title>Search results | winget.run</title>
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
              <SectionHeaderWithFilters>
                <div>
                  {Object.entries(query)
                    .filter((e) => e[0] !== "order" && e[0] !== "sort")
                    .map((e) => (
                      <code>
                        <span>{e[0]}: </span>
                        {e[1]}
                      </code>
                    ))}
                  <span>
                    {data.Total} result
                    {data.Total !== 1 ? "s" : ""}
                  </span>
                </div>
                <div>
                  <SortSelectWrapper>
                    <SortSelect
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value);
                      }}
                    >
                      <option value="">Relevancy</option>
                      {Object.entries(sortOptions).map((e) => (
                        <option value={e[1]}>{e[0]}</option>
                      ))}
                    </SortSelect>
                    <img
                      src={require("../components/icons/chevron-down.svg")}
                      alt=""
                    />
                  </SortSelectWrapper>
                  <OrderButton
                    onClick={handleSetOrder}
                    disabled={sort === null || sort === ""}
                  >
                    <span>{order === 1 ? "Ascending" : "Descending"}</span>
                    {order === 1 ? (
                      <img
                        src={require("../components/icons/sort-amount-up.svg")}
                        alt=""
                      />
                    ) : (
                      <img
                        src={require("../components/icons/sort-amount-down.svg")}
                        alt=""
                      />
                    )}
                  </OrderButton>
                </div>
              </SectionHeaderWithFilters>
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
