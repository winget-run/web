import { useState, useEffect } from "react";
import styled from "styled-components";

import useDebounce from "../utils/hooks/useDebounce";
import Link from "next/link";
import { CardTitle, CardOrg, CardDesc } from "./Card";

const SearchContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 100px;
  font-weight: bold;
  font-size: 16px;
  color: ${(x: any) => x.theme.darkGrey};
  &::placeholder {
    color: ${(x: any) => x.theme.textFade};
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  width: 100%;
  padding: 15px 20px;
  background: ${(x: any) => x.theme.text};
  margin-top: 10px;
  border-radius: 8px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
`;

const Title = styled(CardTitle)`
  display: inline;
  color: ${(x: any) => x.theme.darkGrey};
  margin-right: 8px;
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

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      // autoCompleteApi(debouncedSearchTerm).then(results => {
      //   setIsSearching(false);
      //   setResults(results);
      // });
      console.log(debouncedSearchTerm);
    } else {
      // setResults([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <SearchContainer>
      <StyledInput
        aria-label="Search packages"
        type="text"
        placeholder="Search packages..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ResultsContainer>
        <Result>
          <span>
            {/* <Link href="/pkg/[org]/[pkg]" as={`/pkg/${links[0]}/${links[1]}`}> */}
            <a>
              <Title>Git Extensions</Title>
            </a>
            {/* </Link> */}
            {/* <Link href="/pkg/[org]" as={`/pkg/${links[0]}`}> */}
            <a>
              <Org>Git Extensions Team</Org>
            </a>
            {/* </Link> */}
          </span>
          <Desc>
            Git Extensions is a graphical user interface for Git that allows you
            to control Git without using the commandline
          </Desc>
        </Result>
        <Result>
          <span>
            {/* <Link href="/pkg/[org]/[pkg]" as={`/pkg/${links[0]}/${links[1]}`}> */}
            <a>
              <Title>Git Extensions</Title>
            </a>
            {/* </Link> */}
            {/* <Link href="/pkg/[org]" as={`/pkg/${links[0]}`}> */}
            <a>
              <Org>Git Extensions Team</Org>
            </a>
            {/* </Link> */}
          </span>
          <Desc>
            <span>Git</span> Extensions is a graphical user interface for Git
            that allows you to control Git without using the commandline
          </Desc>
        </Result>
      </ResultsContainer>
    </SearchContainer>
  );
};

export default Search;
