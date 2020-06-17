import { styled } from "../utils/theme";
import generateDownload, { fileType } from "../utils/generateDownload";
import generateClipboard from "../utils/generateClipboard";
import { IPackage } from "../api/getPackages";
import { useContext, useState, useEffect } from "react";
import { Downloads } from "./StateWrapper";
import { toast } from "react-toastify";
import { media } from "styled-bootstrap-grid";

const Button = (styled.button as any)`
  background-color: ${(x) => x.theme.accentDark};
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  position: fixed;
  bottom: 30px;
  right: 30px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 250ms ease;
  transform: scale(0.5);
  opacity: 0;
  z-index: 999;
  ${(x) =>
    x.visible &&
    `
      transform: scale(1);
      opacity: 1;
      transition: transform 250ms cubic-bezier(0.26, 1.29, 0.7, 1.18);
    `}

  ${media.sm`
    bottom: 50px;
    right: 50px;
  `}

  &:focus {
    outline: none;
  }

  img {
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .download {
    height: 26px;
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 1;
    transition: all 250ms cubic-bezier(0.26, 1.29, 0.7, 1.18);
    ${(x) =>
      !x.expanded &&
      `
      transform: translate(-50%, -50%) rotate(-115deg);
      opacity: 0;
    `}
  }

  .close {
    height: 22px;
    transform: translate(-50%, -50%) rotate(80deg);
    opacity: 0;
    transition: all 250ms cubic-bezier(0.26, 1.29, 0.7, 1.18);
    ${(x) =>
      !x.expanded &&
      `
      transform: translate(-50%, -50%) rotate(-45deg);
      opacity: 1;
    `}
  }

  > span {
    position: absolute;
    top: -10px;
    left: -10px;
    background-color: ${(x) => x.theme.accent};
    border-radius: 50%;
    width: 30px;
    height: 30px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    font-size: 16px;
    color: white;
    line-height: 1.8;
    text-align: center;
    transition: all 250ms ease;
    transform: scale(0.5);
    opacity: 0;
    ${(x) =>
      x.expanded &&
      `
      transform: scale(1);
      opacity: 1;
      transition: transform 250ms cubic-bezier(0.26, 1.29, 0.7, 1.18);
    `}
  }
`;

const ModalContainer = (styled.div as any)`
  position: fixed;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: ${(x) => x.theme.accentDark};
  max-width: 370px;
  width: calc(100% - 30px);
  height: 468px;
  max-height: calc(100% - (30px + 56px + 100px));
  min-height: 200px;
  bottom: 100px;
  right: 15px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  padding: 20px;
  pointer-events: none;
  z-index: 999;

  ${media.sm`
    right: 50px;
    bottom: 120px;
    max-height: calc(100% - (50px + 56px + 100px));
  `}

  h3 {
    font-size: 24px;
    margin: 0 0 20px;
    user-select: none;

    img {
      cursor: pointer;
      float: right;
      margin-top: 7px;
    }
  }

  transition: all 250ms ease;
  transform: translateY(30px);
  opacity: 0;
  ${(x) =>
    x.expanded &&
    `
    transform: translateY(0);
      opacity: 1;
      transition: transform 250ms cubic-bezier(0.26, 1.29, 0.7, 1.18);
      pointer-events: all;
    `}
`;

const ScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  h4 {
    font-size: 20px;
    font-weight: normal;
    margin: 0 0 15px;
    user-select: none;
    cursor: pointer;
    transition: text-decoration 150ms ease;
    &:hover {
      text-decoration: line-through;
    }
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  &::-webkit-scrollbar-button {
    width: 0px;
    height: 0px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(x) => x.theme.accentDarker};
    border: 0px none #ffffff;
    border-radius: 100px;
  }
  &::-webkit-scrollbar-thumb:hover,
  &::-webkit-scrollbar-thumb:active {
    background: ${(x) => x.theme.accent};
  }
  &::-webkit-scrollbar-track {
    background: ${(x) => x.theme.accentDark};
    border: 0px none #ffffff;
    border-radius: 100px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const CopyButton = styled.button`
  background-color: ${(x) => x.theme.accent};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 10px 15px;
  width: 100%;
  white-space: nowrap;
  margin-top: 20px;
  font-weight: bold;
  color: white;
  font-size: 18px;
  margin-right: 10px;
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${(x) => x.theme.accentDarker};
  }
`;

const DownloadButton = styled(CopyButton)`
  margin-right: 0;
`;

const DownloadModal = () => {
  const { packages, removePackage, clearPackages } = useContext(Downloads);
  const [expanded, setExpanded] = useState(false);

  const shouldBeVisible = packages.length > 0;

  useEffect(() => {
    if (packages.length === 0) {
      setExpanded(false);
    }
  }, [packages]);

  return (
    <>
      <ModalContainer
        visible={shouldBeVisible}
        expanded={shouldBeVisible && expanded}
      >
        <h3>
          {packages.length} package{packages.length !== 1 && "s"} selected
          <img
            className="clear"
            src={require("./icons/clear.svg")}
            alt="Clear all packages"
            onClick={clearPackages}
          />
        </h3>
        <ScrollContainer>
          {shouldBeVisible &&
            packages.map((e) => (
              <h4 key={`download-${e.Id}`} onClick={() => removePackage(e)}>
                {e.latest.Name}
              </h4>
            ))}
        </ScrollContainer>
        <ButtonContainer>
          <CopyButton
            onClick={() => {
              generateClipboard(packages.map((e) => e.Id));
              toast.dark(`Copied packages to clipboard!`);
            }}
          >
            Copy
          </CopyButton>
          <DownloadButton
            onClick={() =>
              generateDownload(
                fileType.powershell,
                packages.map((e) => e.Id)
              )
            }
          >
            Download
          </DownloadButton>
        </ButtonContainer>
      </ModalContainer>
      <Button
        onClick={() => setExpanded(!expanded)}
        visible={shouldBeVisible}
        expanded={!expanded}
      >
        <span>{packages.length}</span>
        <img
          className="download"
          src={require("./icons/download.svg")}
          alt=""
        />
        <img className="close" src={require("./icons/plus.svg")} alt="" />
      </Button>
    </>
  );
};

export default DownloadModal;
