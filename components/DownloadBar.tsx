import { styled } from "../utils/theme";
import generateDownload, { fileType } from "../utils/generateDownload";
import generateClipboard from "../utils/generateClipboard";
import { IPackage } from "../api/getPackages";
import { useContext } from "react";
import { Downloads } from "./StateWrapper";

const Container = styled.div<{ visible: boolean }>`
  position: fixed;
  z-index: 60;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px 0;
  background-color: ${(x) => x.theme.accentDark};
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
  transform: translateY(100%);
  transition: transform 350ms ease, box-shadow 350ms ease;

  ${(x) =>
    x.visible &&
    `
    transform: translateY(0);
    box-shadow: 0 -3px 8px rgba(0, 0, 0, 0.3);
  `}
`;

const Contents = styled.div`
  display: flex;
  max-width: 744px;
  width: 100%;
  margin: 0 auto;

  > div {
    padding: 0 15px;
    &:first-child {
      flex: 0 1 auto;
    }
    &:last-child {
      flex: 1 0 auto;
    }
  }

  h3 {
    font-size: 24px;
    margin: 0 0 10px;
  }

  h4 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  h4,
  h5 {
    font-size: 20px;
    font-weight: normal;
    margin: 0;
  }

  h5 {
    text-align: right;

    img {
      cursor: pointer;
      &:first-of-type {
        margin: 0 10px;
      }
    }
  }
`;

interface IProps {
  packages: IPackage[];
}

const DownloadBar = () => {
  const { packages } = useContext(Downloads);

  return (
    <Container
      visible={packages.length > 0}
      aria-live={packages.length > 0 ? "polite" : "off"}
      aria-modal={packages.length > 0}
    >
      <Contents>
        <div>
          <h3>
            {packages.length} package{packages.length !== 1 && "s"} selected
          </h3>
          <h4>{packages.map((e) => e.latest.Name).join(", ")}</h4>
        </div>
        <div>
          <h5>
            powershell
            <img
              role="button"
              aria-label="Copy script for Powershell"
              src={require("./icons/copy.svg")}
              alt=""
              onClick={() => generateClipboard(packages.map((e) => e.Id))}
            />
            <img
              role="download"
              aria-label="Download script for Powershell"
              src={require("./icons/download.svg")}
              alt=""
              onClick={() =>
                generateDownload(
                  fileType.powershell,
                  packages.map((e) => e.Id)
                )
              }
            />
          </h5>
          <h5>
            cmd
            <img
              role="button"
              aria-label="Copy script for CMD"
              src={require("./icons/copy.svg")}
              alt=""
              onClick={() => generateClipboard(packages.map((e) => e.Id))}
            />
            <img
              role="download"
              aria-label="Download script for CMD"
              src={require("./icons/download.svg")}
              alt=""
              onClick={() =>
                generateDownload(
                  fileType.bat,
                  packages.map((e) => e.Id)
                )
              }
            />
          </h5>
          <h5>
            bash
            <img
              role="button"
              aria-label="Copy script for Bash"
              src={require("./icons/copy.svg")}
              alt=""
              onClick={() => generateClipboard(packages.map((e) => e.Id))}
            />
            <img
              role="download"
              aria-label="Download script for Bash"
              src={require("./icons/download.svg")}
              alt=""
              onClick={() =>
                generateDownload(
                  fileType.bash,
                  packages.map((e) => e.Id)
                )
              }
            />
          </h5>
        </div>
      </Contents>
    </Container>
  );
};

export default DownloadBar;
