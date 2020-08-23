import { useContext, useState, useEffect } from "react";
import { mediaBreakpointDown } from "react-grid";

import styled from "../utils/theme";
import { Downloads, IDownload } from "../utils/state/Downloads";
import generateClipboard from "../utils/clipboard";
import generateDownload from "../utils/download";
import { CardIcon } from "./Card";
import { getIcon } from "../utils/helperFunctions";
import Tooltip from "./Tooltip";

interface IVisibleExpanded {
  visible: boolean;
  expanded: boolean;
}

const Button = styled.button<IVisibleExpanded>`
  background-color: ${(x) => x.theme.accentDark};
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  position: fixed;
  bottom: 50px;
  right: 50px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 250ms ease;
  transform: scale(0.5);
  opacity: 0;
  z-index: 999;
  overflow: visible;
  ${mediaBreakpointDown("xs")} {
    padding: 30px;
    bottom: 30px;
    right: 30px;
  }

  ${(x) =>
    x.visible &&
    `
      transform: scale(1);
      opacity: 1;
      transition: transform 250ms cubic-bezier(0.26, 1.29, 0.7, 1.18);
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

const ModalContainer = styled.div<IVisibleExpanded>`
  position: fixed;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: ${(x) => x.theme.accentDark};
  max-width: 370px;
  width: calc(100% - 30px);
  height: 468px;
  max-height: calc(100% - (50px + 56px + 100px));
  min-height: 200px;
  bottom: 120px;
  right: 50px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  padding: 20px;
  pointer-events: none;
  z-index: 999;

  ${mediaBreakpointDown("xs")} {
    max-height: calc(100% - (30px + 56px + 100px));
    bottom: 100px;
    right: 15px;
  }

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
  margin-right: -10px;
  padding-right: 10px;

  span {
    display: flex;
    position: relative;
    justify-content: space-between;
    margin: 0 0 20px;

    .arrow {
      position: absolute;
      pointer-events: none;
      right: 0;
      top: 12px;
    }
  }

  select {
    font-size: 14px;
    height: 30px;
    color: rgba(255, 255, 255, 0.8);
    background-color: transparent;
    border: none;
    appearance: none;
    margin-left: 20px;
    padding-right: 18px;
    cursor: pointer;
    option {
      font-size: 14px;
      color: black;
    }
  }

  h4 {
    display: inline-block;
    font-size: 20px;
    font-weight: normal;
    margin: 0;
    user-select: none;
    cursor: pointer;
    transition: text-decoration 150ms ease;
    &:hover,
    &:focus {
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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

  img {
    margin-right: 10px;
  }

  &:hover {
    background-color: ${(x) => x.theme.accentDarker};
  }
`;

const DownloadButton = styled(CopyButton)`
  margin-right: 0;
`;

const DownloadModal = () => {
  const {
    packages,
    removePackage,
    changePackageVersion,
    clearPackages,
  } = useContext(Downloads);
  const [expanded, setExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const shouldBeVisible = packages.length > 0;

  useEffect(() => {
    if (packages.length === 0) {
      setExpanded(false);
    }
  }, [packages]);

  useEffect(() => {
    if (showTooltip) {
      setTimeout(() => setShowTooltip(false), 1000);
    }
  }, [showTooltip]);

  return (
    <>
      {/* Modal */}
      <ModalContainer
        visible={shouldBeVisible}
        expanded={shouldBeVisible && expanded}
      >
        {/* Modal Header */}
        <h3>
          {packages.length} package{packages.length !== 1 && "s"} selected
          <img
            className="clear"
            src={require("./icons/clear.svg")}
            alt="Clear all packages"
            onClick={clearPackages}
          />
        </h3>

        {/* List of Packages */}
        <ScrollContainer>
          {shouldBeVisible &&
            packages.map((e: IDownload) => (
              <span key={`download-${e.Package.Id}`}>
                <h4 onClick={() => removePackage(e.Package)} tabIndex={0}>
                  <CardIcon
                    src={
                      e.Package.IconUrl ||
                      getIcon(e.Package.Latest.Homepage, false)
                    }
                    alt=""
                  />
                  {e.Package.Latest.Name}
                </h4>
                <select
                  value={e.Version}
                  onChange={(ev) =>
                    changePackageVersion({
                      ...e,
                      Version: ev.currentTarget.value,
                    })
                  }
                >
                  {e.Package.Versions.map((v) => (
                    <option key={e.Package.Id + v}>{v}</option>
                  ))}
                </select>
                <img
                  className="arrow"
                  src={require("./icons/chevron-down.svg")}
                  alt=""
                />
              </span>
            ))}
        </ScrollContainer>

        {/* Bottom Buttons */}
        <ButtonContainer>
          <CopyButton
            onClick={() => {
              generateClipboard(packages);
              setShowTooltip(true);
            }}
          >
            <img src={require("./icons/copy.svg")} alt="" />
            Copy
            {showTooltip && <Tooltip />}
          </CopyButton>
          <DownloadButton onClick={() => generateDownload(packages)}>
            <img src={require("./icons/download.svg")} alt="" />
            Download
          </DownloadButton>
        </ButtonContainer>
      </ModalContainer>

      {/* Floating Action Button */}
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
