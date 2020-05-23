import Link from "next/link";
import styled from "styled-components";
import { media } from "styled-bootstrap-grid";

import generateClipboard from "../utils/generateClipboard";

const StyledContainer = styled.div<{ selected: boolean }>`
  border-radius: 8px;
  background: ${(x: any) => x.theme.grey};
  width: 100%;
  height: calc(100% - 15px);
  padding: 15px 15px 54px;
  margin-bottom: 15px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  border: 2px solid transparent;
  transition: border-color 200ms ease;

  ${media.md`
    height: calc(100% - 30px);
    margin-bottom: 30px;
  `}

  ${(x) =>
    x.selected &&
    `
  border-color: ${x.theme.accent};
  `}
`;

const Add = styled.button<{ selected: boolean }>`
  width: 50px;
  height: 50px;
  background: transparent;
  border: none;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  &::before,
  &::after {
    content: "";
    position: absolute;
    background: ${(x: any) => x.theme.text};
    border-radius: 20px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &::before {
    width: 3px;
    height: calc(100% - 30px);
    transition: height 200ms ease;

    ${(x) => x.selected && `height: 0%`}
  }
  &::after {
    width: calc(100% - 30px);
    height: 3px;
  }

  &:focus {
    outline: none;
    &::before,
    &::after {
      background: ${(x: any) => x.theme.accentLight};
    }
  }
`;

const Copy = styled.button`
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 14px;
  background: transparent;
  border: none;
  color: ${(x: any) => x.theme.text};
  cursor: pointer;
  line-height: 19px;

  &:focus {
    outline: none;
    color: ${(x: any) => x.theme.accentLight};
  }

  img {
    margin-right: 8px;
    transform: translateY(4px);
  }
`;

export const CardTitle = styled.h2`
  display: inline;
  color: ${(x: any) => x.theme.text};
  font-size: 20px;
  margin: 0;
  padding-right: 30px;
`;

export const CardOrg = styled.h3`
  display: inline;
  color: ${(x: any) => x.theme.accentLight};
  font-size: 14px;
  margin: 2px 0 0;
`;

export const CardDesc = styled.p`
  color: ${(x: any) => x.theme.textFade};
  font-size: 16px;
  line-height: 20px;
  margin: 10px 0;
`;

interface IProps {
  title: string;
  org: string;
  description: string;
  id: string;
  selected?: boolean;
  addFn: (add: boolean, title: string) => void;
}

const Card = (props: IProps) => {
  const links = props.id.split(".");

  return (
    <StyledContainer selected={props.selected}>
      <Add
        onClick={() => props.addFn(!props.selected, props.title)}
        selected={props.selected}
        aria-label="Add to multi-download"
      />
      <Link href="/pkg/[org]/[pkg]" as={`/pkg/${links[0]}/${links[1]}`}>
        <a>
          <CardTitle>{props.title}</CardTitle>
        </a>
      </Link>
      <br />
      <Link href="/pkg/[org]" as={`/pkg/${links[0]}`}>
        <a>
          <CardOrg>{props.org}</CardOrg>
        </a>
      </Link>
      <CardDesc>{props.description}</CardDesc>
      <Copy onClick={() => generateClipboard([props.id])}>
        <img src={require("./icons/copy.svg")} alt="" />
        Copy command
      </Copy>
    </StyledContainer>
  );
};

export default Card;
