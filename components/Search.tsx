import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";

import useDebounce from "../utils/hooks/useDebounce";
import { CardTitle, CardOrg, CardDesc } from "./Card";
import AutocompleteResult from "./AutocompleteResult";

const SearchContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 28px;
  border: none;
  border-radius: 100px;
  font-weight: bold;
  font-size: 16px;
  color: ${(x: any) => x.theme.darkGrey};
  border: 2px solid transparent;
  &::placeholder {
    color: ${(x: any) => x.theme.textFade};
  }
  &:focus {
    outline: none;
    border-color: ${(x: any) => x.theme.accentLight};
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
      {debouncedSearchTerm && (
        <ResultsContainer aria-live="polite" aria-modal="true">
          <AutocompleteResult
            id="testorg.testapp"
            title="Test title"
            org="Test org"
            desc="This is a <span>test</span> description"
          />
          <AutocompleteResult
            id="testorg.testapp"
            title="Test title"
            org="Test org"
            desc="This is a <span>test</span> description"
          />
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

export default Search;
