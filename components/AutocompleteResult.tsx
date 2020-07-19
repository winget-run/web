import { styled } from "../utils/theme";
import Link from "next/link";

import { CardTitle, CardOrg, CardDesc, CardIcon } from "./Card";
import { useContext } from "react";

import { Search as SearchContext } from "../utils/state/Search";
import { getIcon } from "../utils/helperFunctions";

const Title = styled(CardTitle)`
  display: inline;
  color: ${(x) => x.theme.darkGrey};
  margin-right: 8px;
  padding-right: 0;
`;

const Org = styled(CardOrg)`
  display: inline;
  color: ${(x) => x.theme.accent};
  transform: translateY(7px);
`;

const Desc = styled(CardDesc)`
  color: ${(x) => x.theme.darkGrey};
  span {
    font-weight: bold;
    background: #ffffa2;
  }
`;

const Result = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${(x) => x.theme.lightGrey};
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
`;

interface IProps {
  id: string;
  title: string;
  org: string;
  desc: string;
  url: string;
  iconUrl: string;
}

const AutocompleteResult = (props: IProps) => {
  const { search, updateSearch, updateResults, updateClear } = useContext(
    SearchContext
  );

  const [org, ...pkg] = props.id.split(".");
  return (
    <Result>
      <span>
        <Link href="/pkg/[org]/[pkg]" as={`/pkg/${org}/${pkg.join(".")}`}>
          <a onClick={() => updateClear()}>
            <Title>
              <CardIcon src={props.iconUrl || getIcon(props.url, true)} alt="" />
              {props.title}
            </Title>
          </a>
        </Link>
        <Link href="/pkg/[org]" as={`/pkg/${org}`}>
          <a onClick={() => updateClear()}>
            <Org>{props.org}</Org>
          </a>
        </Link>
      </span>
      <Desc dangerouslySetInnerHTML={{ __html: props.desc }}></Desc>
    </Result>
  );
};

export default AutocompleteResult;
