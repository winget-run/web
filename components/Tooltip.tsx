import { keyframes } from "@emotion/core";
import styled from "../utils/theme";

const animation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledTooltip = styled.span`
  position: absolute;
  background-color: ${(x) => x.theme.darkGrey};
  border-radius: 8px;
  padding: 10px 15px;
  color: white;
  font-size: 16px;
  bottom: -10px;
  left: 50%;
  transform: translate(-50%, 100%);
  z-index: 10;
  user-select: none;
  pointer-events: none;
  word-break: normal;
  animation: ${animation} 250ms ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);

    border-style: solid;
    border-width: 0 7.5px 8px 7.5px;
    border-color: transparent transparent ${(x) => x.theme.darkGrey} transparent;
  }
`;

const Tooltip: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <StyledTooltip role="tooltip" aria-label={text || "Copied!"}>
      {text || "Copied!"}
    </StyledTooltip>
  );
};

export default Tooltip;
