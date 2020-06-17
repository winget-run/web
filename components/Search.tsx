import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { styled } from "../utils/theme";
import Link from "next/link";

import useDebounce from "../utils/hooks/useDebounce";
import { CardTitle, CardOrg, CardDesc } from "./Card";
import AutocompleteResult from "./AutocompleteResult";
import getPackages, { IPackage } from "../api/getPackages";
import { keyframes } from "styled-components";

const resultsAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
  color: ${(x) => x.theme.darkGrey};
  border: 2px solid transparent;
  &::placeholder {
    color: ${(x) => x.theme.textFade};
  }
  &:focus {
    outline: none;
    border-color: ${(x) => x.theme.accentLight};
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  width: 100%;
  padding: 15px 20px;
  background: ${(x) => x.theme.text};
  margin-top: 10px;
  border-radius: 8px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
  animation: ${resultsAnimation} 150ms cubic-bezier(0.26, 1.29, 0.7, 1.18)
    forwards;
`;

const NoResultsText = styled.h4`
  color: ${(x) => x.theme.darkGrey};
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
      getPackages(`autocomplete?query=${debouncedSearchTerm}`).then((e) => {
        setResults(e.packages);
        setIsSearching(false);
      });
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
      {debouncedSearchTerm && !isSearching && (
        <ResultsContainer aria-live="polite" aria-modal="true">
          {results.length > 0 &&
            results.map((e) => (
              <AutocompleteResult
                key={`autocomplete-${e.Id}`}
                id={e.Id}
                title={e.latest.Name}
                org={e.latest.Publisher}
                desc={e.latest.Description?.replace(
                  new RegExp(debouncedSearchTerm, "gi"),
                  "<span>$&</span>"
                )}
              />
            ))}
          {results.length === 0 && !isSearching && (
            <NoResultsText>
              No results found for "{debouncedSearchTerm}"
            </NoResultsText>
          )}
        </ResultsContainer>
      )}
      {/* {debouncedSearchTerm && !isSearching && results.length === 0 && (
        <ResultsContainer aria-live="polite" aria-modal="true">
        </ResultsContainer>
      )} */}
    </SearchContainer>
  );
};

export default Search;
