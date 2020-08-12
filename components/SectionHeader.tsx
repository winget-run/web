import styled from "../utils/theme";
import { mediaBreakpointDown } from "react-grid";

const SectionHeader = styled.h2`
  position: relative;
  margin: 0 0 30px;
  padding: 0 0 19px;
  font-weight: 700;
  font-size: 32px;

  ${mediaBreakpointDown("sm")} {
    font-size: 26px;
  }

  &::after {
    content: "";
    position: absolute;
    width: 60px;
    height: 4px;
    left: 0;
    bottom: 0;
    background-color: ${(x) => x.theme.accent};
  }
  > span {
    color: ${(x) => x.theme.textFade};
    font-size: 20px;
    display: inline-block;
    margin-left: 20px;
    ${mediaBreakpointDown("xs")} {
      margin-left: 0;
      display: block;
    }
  }

  code {
    padding: 8px 20px 12px;
    background: ${(x) => x.theme.grey};
    border-radius: 8px;
    font-size: 0.8em;
    white-space: nowrap;
    display: inline-block;
    margin-bottom: 10px;
    &:not(:last-child) {
      margin-right: 10px;
    }
    span {
      color: ${(x) => x.theme.accentLight};
    }
  }
`;

export default SectionHeader;
