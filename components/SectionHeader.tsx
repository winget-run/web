import { media } from "styled-bootstrap-grid";
import { styled } from "../utils/theme";

const SectionHeader = styled.h2`
  position: relative;
  margin: 0 0 30px;
  padding: 0 0 19px;
  font-weight: 700;
  font-size: 26px;
  ${media.md`
      font-size: 32px;
    `}

  &::after {
    content: "";
    position: absolute;
    width: 60px;
    height: 4px;
    left: 0;
    bottom: 0;
    background-color: ${(x) => x.theme.accent};
  }
  span {
    color: ${(x) => x.theme.textFade};
    font-size: 20px;
    margin-left: 0;
    display: block;
    ${media.md`
    display: inline-block;
    margin-left: 20px;
    `}
  }
`;

export default SectionHeader;
