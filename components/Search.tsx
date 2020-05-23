import { useState, useEffect, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import Link from "next/link";
import fetch from "isomorphic-unfetch";

import useDebounce from "../utils/hooks/useDebounce";
import { CardTitle, CardOrg, CardDesc } from "./Card";
import AutocompleteResult from "./AutocompleteResult";
import { IPackage } from "../api/getPackages";

const SearchContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 28px;
  margin: 47px 0 0;
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

const NoResultsText = styled.h4`
  color: ${(x: any) => x.theme.darkGrey};
  text-align: center;
  font-size: 24px;
  margin: 15px 0;
`;

const Search = ({ totalPackages }: { totalPackages: number }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [results, setResults]: [
    IPackage[],
    Dispatch<SetStateAction<any[]>>
  ] = useState([]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      fetch(
        `https://api.winget.run/api/v1/autocomplete?query=${debouncedSearchTerm}`
      )
        .then((e) => e.json())
        .then((e) => {
          setIsSearching(false);
          setResults(e.packages);
          console.log(e.packages);
        });
      console.log(debouncedSearchTerm);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <SearchContainer>
      <StyledInput
        aria-label="Search packages"
        type="text"
        placeholder={`Search ${totalPackages} packages...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {debouncedSearchTerm && results.length > 0 && (
        <ResultsContainer aria-live="polite" aria-modal="true">
          {results.map((e) => (
            <AutocompleteResult
              id={e.Id}
              title={e.Name}
              org={e.Publisher}
              desc={e.Description?.replace(
                new RegExp(debouncedSearchTerm, "gi"),
                "<span>$&</span>"
              )}
            />
          ))}
        </ResultsContainer>
      )}
      {debouncedSearchTerm && results.length === 0 && (
        <ResultsContainer aria-live="polite" aria-modal="true">
          <NoResultsText>
            No results found for "{debouncedSearchTerm}"
          </NoResultsText>
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

export default Search;
