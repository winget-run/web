import { useEffect, useState } from "react";
import { mediaBreakpointDown } from "react-grid";

import { IPackage } from "../api/getPackages";
import styled from "../utils/theme";
import generateClipboard from "../utils/clipboard";
import Tooltip from "./Tooltip";

const StyledVersion = styled.p`
  font-weight: 500;
  font-size: 20px;
  margin: 0 0 20px;
  ${mediaBreakpointDown("sm")} {
    font-size: 16px;
  }

  span:not([role="tooltip"]) {
    position: relative;
    float: right;
    cursor: pointer;
  }

  &:last-child {
    margin: 0;
  }
`;

interface IProps {
  name: string;
  Package: IPackage;
}

const Version: React.FC<IProps> = ({ name, Package }) => {
  const [showVersionTooltip, setShowVersionTooltip] = useState(false);

  useEffect(() => {
    if (showVersionTooltip) {
      setTimeout(() => setShowVersionTooltip(false), 1000);
    }
  }, [showVersionTooltip]);
  return (
    <StyledVersion>
      {name}
      <span>
        <img
          role="button"
          tabIndex={0}
          onClick={() => {
            generateClipboard([{ Package: Package, Version: name }]);
            setShowVersionTooltip(true);
          }}
          src={require("./icons/copy.svg")}
          alt=""
          aria-label={`Copy command for version ${name}`}
        />
        {showVersionTooltip && <Tooltip />}
      </span>
    </StyledVersion>
  );
};

export default Version;
