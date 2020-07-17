import Head from "next/head";
import { CardContainer, Add } from "../../../components/Card";
import { Container, Row, Col, media } from "styled-bootstrap-grid";
import useSWR from "swr";
import getPackages, {
  IResponse,
  IPackage,
  IResponseSingle,
} from "../../../api/getPackages";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import DownloadModal from "../../../components/DownloadModal";
import Tag from "../../../components/Tag";
import Error from "../../_error";
import { styled } from "../../../utils/theme";
import Header, { SearchBar } from "../../../components/Header";
import generateClipboard from "../../../utils/clipboard";
import { Downloads } from "../../../utils/state/Downloads";
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
  button {
    top: 50% !important;
    transform: translateY(-50%) !important;
  }

  &.active {
    border: 2px solid ${(x) => x.theme.accent};
  }
`;

const ShowMoreVersions = styled.p`
  font-size: 14px;
  text-align: center;
  margin: 20px 0px 0px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
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
  const { data } = useSWR(`packages/${org}/${pkg}`, getPackages, {
    initialData,
  });
  const { packages, addPackage, removePackage } = useContext(Downloads);
  const [showMoreVersions, setShowMoreVersions] = useState(false);

  if ((data as IResponseSingle).Package == null) {
    return <Error statusCode={404} />;
  }

  const p = data.Package as IPackage;

  const inDownloads = packages.find((e) => e.Package.Id === p.Id);
  const versionsAmount = 4;
  const versionsLength = p.Versions.length;

  return (
    <div className="container">
      <Head>
        <title>Download and install {p.Latest.Name} with winget</title>
        <meta
          name="description"
          content={
            p.Latest.Description ||
            `Download and install ${p.Latest.Name} and other packages with winget`
          }
        />
        <meta name="twitter:title" content={`${p.Latest.Name} on winget.run`} />
        <meta
          name="twitter:description"
          content={
            p.Latest.Description ||
            `Download and install ${p.Latest.Name} and other packages with winget`
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
                    {p.Latest.Name}
                    <span>v{p.Versions[0]}</span>
                  </h1>
                  <Link href="/pkg/[org]" as={`/pkg/${org}`}>
                    <a>
                      <h2>{p.Latest.Publisher}</h2>
                    </a>
                  </Link>
                  {p.Latest.Homepage && (
                    <a href={p.Latest.Homepage} target="_blank">
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
              <AddCard className={inDownloads && "active"}>
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
                {p.Versions.slice(0, showMoreVersions ? versionsLength : versionsAmount).map((e) => (
                  <Version key={e}>
                    {e}
                    <span>
                      <img
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          generateClipboard([{ Package: p, Version: e }]);
                          toast.dark(
                            `Copied ${p.Latest.Name}@${e} to clipboard!`
                          );
                        }}
                        src={require("../../../components/icons/copy.svg")}
                        alt=""
                        aria-label={`Copy command for version ${e}`}
                      />
                    </span>
                  </Version>
                ))}
                {
                  
                }
                
                {p.Versions.length > versionsAmount && !showMoreVersions && (
                  <ShowMoreVersions onClick={() => setShowMoreVersions(true)}>
                    Show {versionsLength - 4} older versions
                  </ShowMoreVersions>
                )}

                {p.Versions.length > versionsAmount && showMoreVersions && (
                  <ShowMoreVersions onClick={() => setShowMoreVersions(false)}>
                    Hide {versionsLength - 4} older versions
                  </ShowMoreVersions>
                )}
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
                      generateClipboard([
                        { Package: p, Version: p.Versions[0] },
                      ]);
                      toast.dark(`Copied ${p.Latest.Name} to clipboard!`);
                    }}
                    src={require("../../../components/icons/copy.svg")}
                    alt=""
                    aria-label="Copy command"
                  />
                </CodeBlock>
              </section>
              {p.Latest.Description && (
                <section>
                  <SectionHeader>About {p.Latest.Name}</SectionHeader>
                  <SectionInfo>{p.Latest.Description}</SectionInfo>
                </section>
              )}
              {p.Latest.Tags?.length > 0 && (
                <section>
                  <SectionHeader>Tags</SectionHeader>
                  {p.Latest.Tags.map((x) => (
                    <Tag key={x}>{x}</Tag>
                  ))}
                </section>
              )}
              {p.Latest.License && (
                <section>
                  <SectionHeader>License</SectionHeader>
                  <SectionInfo>
                    {p.Latest.LicenseUrl ? (
                      <a href={p.Latest.LicenseUrl}>
                        <img
                          src={require("../../../components/icons/link.svg")}
                          alt=""
                        />
                        {p.Latest.License}
                      </a>
                    ) : (
                      p.Latest.License
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
  const data = await getPackages(`packages/${params.org}/${params.pkg}`);

  return { props: { data } };
}
