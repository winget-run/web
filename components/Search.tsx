import { useEffect, useContext } from "react";

import { styled } from "../utils/theme";
import useDebounce from "../utils/hooks/useDebounce";
import AutocompleteResult from "./AutocompleteResult";
import getPackages from "../api/getPackages";

import { Search as SearchContext } from "../utils/state/Search";

const SearchContainer = styled.div`
  position: relative;
  z-index: 10;

  &.hide {
    display: none;
  }
  &.show {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }
`;

const StyledInput = styled.input<{ inNav: boolean }>`
  width: 100%;
  padding: 15px 28px 15px 63px;
  margin: 47px 0 0;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  color: ${(x) => x.theme.darkGrey};
  border: 2px solid transparent;

  + svg {
    position: absolute;
    bottom: 15px;
    left: 20px;
    height: 24px;
    width: 24px;
  }
  &::placeholder {
    color: ${(x) => x.theme.textFade};
  }
  &:focus {
    outline: none;
    + svg {
      g,
      line {
        stroke: ${(x) => x.theme.darkGrey};
      }
    }
  }

  ${(x) =>
    x.inNav &&
    `
    margin: 0;
    padding-top: 14px;
    padding-bottom: 14px;
    background-color: ${x.theme.accentDark};
    color: white;

    &::placeholder {
      color: rgba(255,255,255, 0.75);
    }
    &:focus {
      + svg {
      g,
      line {
        opacity: 1;
        stroke: white;
      }
    }
    }

    ~${ResultsContainer} {
      width: calc(100% + 105px)
    }
    
  `}
`;

const WidthWrapper = styled.div<{ inNav: boolean }>`
  width: 100%;
  ${(x) =>
    x.inNav &&
    `
    position: relative;
  max-width: 466px;
  `}
`;

const ResultsContainer = styled.div`
  position: absolute;
  width: 100%;
  padding: 15px 20px;
  background: ${(x) => x.theme.text};
  margin-top: 5px;
  border-radius: 8px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: 150ms ease;

  &[aria-modal="true"] {
    pointer-events: all;
    opacity: 1;
    transform: translateY(0);
    transition: 150ms cubic-bezier(0.26, 1.29, 0.7, 1.18);
  }
`;

const NoResultsText = styled.h4`
  color: ${(x) => x.theme.darkGrey};
  text-align: center;
  font-size: 24px;
  margin: 15px 0;
`;

interface IProps {
  totalPackages?: number;
  inNav?: boolean;
  hidden?: boolean;
  resultsHidden?: boolean;
}

const Search = ({ totalPackages, inNav, hidden, resultsHidden }: IProps) => {
  const {
    search,
    updateSearch,
    updateResults,
    updateClearResults,
    updateClear,
  } = useContext(SearchContext);

  // const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(search?.filters?.query ?? "", 400);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // setIsSearching(true);
      // updateClearResults();
      getPackages(`autocomplete?query=${debouncedSearchTerm}`).then((e) => {
        updateResults(e);
        // setIsSearching(false);
      });
    } else {
      updateClearResults();
    }
  }, [debouncedSearchTerm]);

  return (
    <SearchContainer className={hidden ?? false ? "hide" : "show"}>
      <WidthWrapper inNav={inNav}>
        <StyledInput
          aria-label="Search packages"
          type="text"
          placeholder={
            inNav ? "Search packages" : `Search ${totalPackages} packages...`
          }
          value={search?.filters?.query ?? ""}
          onChange={(e) => updateSearch({ query: e.target.value })}
          inNav={inNav}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26.621"
          height="26.621"
          viewBox="0 0 26.621 26.621"
          aria-hidden
        >
          <g opacity={inNav ? 0.75 : 1}>
            <g
              fill="none"
              stroke={inNav ? "#fff" : "#aaa"}
              strokeLinecap="round"
              strokeWidth="3"
            >
              <circle cx="11" cy="11" r="11" stroke="none" />
              <circle cx="11" cy="11" r="9.5" fill="none" />
            </g>
            <line
              x2="6"
              y2="6"
              transform="translate(18.5 18.5)"
              fill="none"
              stroke={inNav ? "#fff" : "#aaa"}
              strokeLinecap="round"
              strokeWidth="3"
            />
          </g>
        </svg>
        {(!resultsHidden ?? true) && (
          <ResultsContainer
            aria-live="polite"
            aria-modal={!!(debouncedSearchTerm && search?.results != null)}
          >
            {search?.results != null &&
              search?.filters?.query != "" &&
              search?.results?.packages?.length > 0 &&
              search?.results?.packages?.map((e) => (
                <AutocompleteResult
                  key={`autocomplete-${e.Id}`}
                  id={e.Id}
                  title={e.latest.Name}
                  org={e.latest.Publisher}
                  desc={e.latest.Description?.replace(
                    new RegExp(debouncedSearchTerm, "gi"),
                    "<span>$&</span>"
                  )}
                  url={e.latest.Homepage}
                  iconUrl={e.latest.IconUrl}
                />
              ))}
            {search?.results != null &&
              search?.results?.packages?.length === 0 &&
              // !isSearching &&
              debouncedSearchTerm !== "" && (
                <NoResultsText>
                  No results found for "{debouncedSearchTerm}"
                </NoResultsText>
              )}
            {/* <Link href="/" as={`/?q=${debouncedSearchTerm}`} shallow>
              Test
            </Link> */}
          </ResultsContainer>
        )}
        {/* {debouncedSearchTerm && !isSearching && results.length === 0 && (
        <ResultsContainer aria-live="polite" aria-modal="true">
        </ResultsContainer>
      )} */}
      </WidthWrapper>
    </SearchContainer>
  );
};

export default Search;
