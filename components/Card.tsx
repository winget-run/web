import Link from "next/link";
import styled from "styled-components";

const StyledContainer = styled.div`
  border-radius: 8px;
  background: ${(x: any) => x.theme.grey};
  width: 100%;
  height: calc(100% - 45px);
  padding: 15px 15px 54px;
  margin-bottom: 45px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const Add = styled.button`
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
  &::before,
  &::after {
    content: "";
    position: absolute;
    background: ${(x: any) => x.theme.text};
    border-radius: 20px;
  }
  &::before {
    width: 3px;
    height: 100%;
    left: 50%;
    top: 0;
    transform: translate(-50%);
  }
  &::after {
    width: 100%;
    height: 3px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const Copy = styled.button`
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 14px;
  padding-left: 24px;
  background: transparent;
  border: none;
  color: ${(x: any) => x.theme.text};
  cursor: pointer;
  line-height: 19px;
`;

export const CardTitle = styled.h2`
  color: ${(x: any) => x.theme.text};
  font-size: 20px;
  margin: 0;
`;

export const CardOrg = styled.h3`
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
}

const Card = (props: IProps) => {
  const links = props.id.split(".");
  return (
    <StyledContainer>
      <Add aria-label="Add to multi-download" />
      <Link href="/pkg/[org]/[pkg]" as={`/pkg/${links[0]}/${links[1]}`}>
        <a>
          <CardTitle>{props.title}</CardTitle>
        </a>
      </Link>
      <Link href="/pkg/[org]" as={`/pkg/${links[0]}`}>
        <a>
          <CardOrg>{props.org}</CardOrg>
        </a>
      </Link>
      <CardDesc>{props.description}</CardDesc>
      <Copy>Copy command</Copy>
    </StyledContainer>
  );
};

export default Card;
