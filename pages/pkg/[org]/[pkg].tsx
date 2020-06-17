import Head from "next/head";
import Card, { CardContainer, Add } from "../../../components/Card";
import { Container, Row, Col, media } from "styled-bootstrap-grid";
import useSWR, { useSWRPages } from "swr";
import getPackages, {
  IResponse,
  IPackage,
  IResponseSingle,
} from "../../../api/getPackages";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import DownloadModal from "../../../components/DownloadModal";
import Error from "../../_error";
import { styled } from "../../../utils/theme";
import Header, { SearchBar } from "../../../components/Header";
import generateClipboard from "../../../utils/generateClipboard";
import { Downloads } from "../../../components/StateWrapper";
import { toast } from "react-toastify";
import Link from "next/link";

const TopBar = styled(SearchBar)`
  padding: 91px 0 !important;
  background-image: none;
  margin-bottom: 30px;

  h1 {
    font-size: 36px;
    line-height: 1.2;
    margin: 0;

    ${media.md`
      font-size: 60px;
    `}

    span {
      font-size: 22px;
      margin-left: 15px;

      ${media.md`
      font-size: 32px;
    `}
    }
  }

  h2 {
    font-size: 26px;
    margin: 15px 0 0;

    ${media.md`
      margin: 0;
      font-size: 32px;
    `}
  }
  h3 {
    font-size: 18px;
    margin: 8px 0 0;
    img {
      margin-left: 10px;
    }
  }
`;

const CustomRow = styled(Row)`
  flex-direction: column-reverse;
  ${media.lg`
    flex-direction: row;
  `};
`;

const SectionHeader = styled.h2`
  font-size: 24px;
  line-height: 32px;
  margin: 0 0 15px;
`;

const SectionInfo = styled.p`
  font-size: 16px;
  line-height: 30px;
  color: ${(x) => x.theme.textFade};
  margin: 0 0 30px;
  ${media.md`
      font-size: 20px;
  `}
  a:hover {
    text-decoration: underline;
  }

  img {
    margin-right: 10px;
  }
`;

const VersionsCard = styled(CardContainer)`
  padding: 20px;
  height: auto !important;
`;

const AddCard = styled(VersionsCard)`
  ${SectionHeader} {
    margin: 0;
    font-weight: 500;
    font-size: 20px;
  }
  ${Add} {
    top: 50%;
    transform: translateY(-50%);
  }
`;

const Version = styled.p`
  font-weight: 500;
  font-size: 16px;
  margin: 0 0 20px;
  ${media.md`
    font-size: 20px;
  `}

  span {
    float: right;
    cursor: pointer;
  }

  &:last-child {
    margin: 0;
  }
`;

const CodeBlock = styled.code`
  display: block;
  position: relative;
  margin-bottom: 30px;
  padding: 16px 62px 16px 20px;
  font-family: "Consolas", monospace;
  font-size: 16px;
  color: ${(x) => x.theme.textFade};
  border-radius: 8px;
  background-color: ${(x) => x.theme.darkGrey};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.md`
      font-size: 20px;
    `}

  &::before {
    content: "> ";
    user-select: none;
  }

  img {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    padding: 0px;
    cursor: pointer;
    height: 25px;
    width: 22px;
  }

  span {
    font-family: inherit;
    color: #fcff9b;
  }
`;

export default function Pkg(props) {
  const router = useRouter();
  const { org, pkg } = router.query;
  const initialData = props.data;
  const { data } = useSWR(`${org}/${pkg}`, getPackages, { initialData });
  const { packages, addPackage, removePackage } = useContext(Downloads);

  if ((data as IResponseSingle).package == null) {
    return <Error statusCode={404} />;
  }

  const p = data.package as IPackage;

  const inDownloads = packages.find((e) => e.Id === p.Id);

  return (
    <div className="container">
      <Head>
        <title>Download and install {p.latest.Name} with winget</title>
        <meta
          name="description"
          content={
            p.latest.Description ||
            `Download and install ${p.latest.Name} and other packages with winget`
          }
        />
        <meta name="twitter:title" content={`${p.latest.Name} on winget.run`} />
        <meta
          name="twitter:description"
          content={
            p.latest.Description ||
            `Download and install ${p.latest.Name} and other packages with winget`
          }
        />
      </Head>
      <header>
        <Header customBar>
          <TopBar>
            <Container>
              <Row>
                <Col col={12}>
                  <h1>
                    {p.latest.Name}
                    <span>v{p.latest.Version}</span>
                  </h1>
                  <Link href="/pkg/[org]" as={`/pkg/${org}`}>
                    <a>
                      <h2>{p.latest.Publisher}</h2>
                    </a>
                  </Link>
                  {p.latest.Homepage && (
                    <a href={p.latest.Homepage}>
                      <h3>
                        Visit website
                        <img
                          src={require("../../../components/icons/link.svg")}
                          alt=""
                        />
                      </h3>
                    </a>
                  )}
                </Col>
              </Row>
            </Container>
          </TopBar>
        </Header>
      </header>
      <main>
        <Container>
          <CustomRow>
            <Col col={12} lg={4} xl={3}>
              <AddCard>
                <SectionHeader>
                  {inDownloads ? "Remove from list" : "Add to list"}
                </SectionHeader>
                <Add
                  onClick={() => {
                    inDownloads ? removePackage(p) : addPackage(p);
                  }}
                  selected={inDownloads}
                  aria-label="Add to multi-download"
                />
              </AddCard>
              <VersionsCard>
                <SectionHeader>Versions</SectionHeader>
                {p.versions.map((e) => (
                  <Version>
                    {e}
                    <span>
                      <img
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          generateClipboard([p.Id], [e]);
                          toast.dark(
                            `Copied ${p.latest.Name}@${e} to clipboard!`
                          );
                        }}
                        src={require("../../../components/icons/copy.svg")}
                        alt=""
                        aria-label={`Copy command for version ${e}`}
                      />
                    </span>
                  </Version>
                ))}
              </VersionsCard>
            </Col>
            <Col col={12} lg={8} xl={7}>
              <section>
                <SectionHeader>How to install</SectionHeader>
                <CodeBlock>
                  <span>winget</span> install -e --id {p.Id}
                  <img
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      generateClipboard([p.Id]);
                      toast.dark(`Copied ${p.latest.Name} to clipboard!`);
                    }}
                    src={require("../../../components/icons/copy.svg")}
                    alt=""
                    aria-label="Copy command"
                  />
                </CodeBlock>
              </section>
              {p.latest.Description && (
                <section>
                  <SectionHeader>About {p.latest.Name}</SectionHeader>
                  <SectionInfo>{p.latest.Description}</SectionInfo>
                </section>
              )}
              {p.latest.License && (
                <section>
                  <SectionHeader>License</SectionHeader>
                  <SectionInfo>
                    {p.latest.LicenseUrl ? (
                      <a href={p.latest.LicenseUrl}>
                        <img
                          src={require("../../../components/icons/link.svg")}
                          alt=""
                        />
                        {p.latest.License}
                      </a>
                    ) : (
                      p.latest.License
                    )}
                  </SectionInfo>
                </section>
              )}
            </Col>
          </CustomRow>
        </Container>
        <DownloadModal />
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const data = await getPackages(`${params.org}/${params.pkg}`);

  return { props: { data } };
}
