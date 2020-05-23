import styled from "styled-components";
import Link from "next/link";

import { CardTitle, CardOrg, CardDesc } from "./Card";

const Title = styled(CardTitle)`
  display: inline;
  color: ${(x: any) => x.theme.darkGrey};
  margin-right: 8px;
  padding-right: 0;
`;

const Org = styled(CardOrg)`
  display: inline;
  color: ${(x: any) => x.theme.accent};
  transform: translateY(7px);
`;

const Desc = styled(CardDesc)`
  color: ${(x: any) => x.theme.darkGrey};
  span {
    font-weight: bold;
    background: #ffffa2;
  }
`;

const Result = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${(x: any) => x.theme.lightGrey};
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
`;

interface IProps {
  id: string;
  title: string;
  org: string;
  desc: string;
}

const AutocompleteResult = (props: IProps) => {
  const links = props.id.split(".");
  return (
    <Result>
      <span>
        <Link href="/pkg/[org]/[pkg]" as={`/pkg/${links[0]}/${links[1]}`}>
          <a>
            <Title>{props.title}</Title>
          </a>
        </Link>
        <Link href="/pkg/[org]" as={`/pkg/${links[0]}`}>
          <a>
            <Org>{props.org}</Org>
          </a>
        </Link>
      </span>
      <Desc dangerouslySetInnerHTML={{ __html: props.desc }}></Desc>
    </Result>
  );
};

export default AutocompleteResult;
