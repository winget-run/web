import { useEffect, useContext, useState } from "react";

import styled from "../utils/theme";
import useDebounce from "../utils/hooks/useDebounce";
import AutocompleteResult from "./AutocompleteResult";
import getPackages, { IPackage } from "../api/getPackages";
import { useRouter } from "next/router";

import { Search as SearchContext } from "../utils/state/Search";
import {
  escapeRegExp,
  parseQueryString,
  parseTags,
  regexWrapJSX,
} from "../utils/helperFunctions";

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

const InputRegexLayer = styled.div<{ inNav: boolean }>`
  width: 100%;
  height: 55px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -1;
  background-color: white;
  padding: 17px 28px 15px 65px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  color: transparent;

  span {
    background: #ffffa2;
    border-radius: 3px;
  }

  ${(x) =>
    x.inNav &&
    `
    background-color: ${x.theme.accentDark};
    padding-top: 18px;
    bottom: -1px;
    span {
      background: ${x.theme.accent}
    }
    `}
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
  background: transparent;
  &::-webkit-search-cancel-button {
    display: none;
  }

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
  overflow: hidden;
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

const BottomButton = styled.a`
  color: ${(x) => x.theme.darkGrey};
  font-weight: 700;
  &:hover {
    text-decoration: underline;
  }
  img {
    margin-left: 10px;
  }
`;

const NoResultsText = styled.h4`
  color: ${(x) => x.theme.darkGrey};
  text-align: center;
  font-size: 24px;
  margin: 15px 0;
`;

const SearchOptions = styled.div`
  background-color: ${(x) => x.theme.dirtyWhite};
  margin: -20px -20px -31px;
  padding: 20px 20px 40px;
  color: ${(x) => x.theme.background};

  p {
    margin: 0 0 8px;
    font-size: 16px;
    &:last-child {
      margin: 0;
    }
    code {
      font-family: Consolas, monospace;
      font-size: 18px;
      font-weight: 700;
    }
  }
`;

interface IProps {
  inNav?: boolean;
  hidden?: boolean;
  resultsHidden?: boolean;
}

const Search = ({ inNav, hidden, resultsHidden }: IProps) => {
  const router = useRouter();
  const {
    search,
    updateSearch,
    updateSearchTerm,
    updateResults,
    updateClearResults,
    updateClear,
  } = useContext(SearchContext);
  const debouncedSearchTerm = useDebounce(search?.term ?? "", 400);
  const debouncedSearchFilters = useDebounce(search?.filters, 400);
  const [focus, setFocus] = useState(false);
  const [showSearchOptions, setShowSearchOptions] = useState(false);

  useEffect(() => {
    if (
      search.filters &&
      Object.values(search.filters).every((e) => e.length > 1)
    ) {
      getPackages(
        `packages?ensureContains=true&partialMatch=true&take=3&${parseQueryString(
          search.filters
        )}`
      ).then((e) => {
        updateResults(e);
      });
    } else {
      updateClearResults();
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (search?.term?.length < 2) {
      updateClearResults();
    }
  }, [search?.term]);

  const inputRegex = /(name|publisher|description|tags):/g;

  const handleUpdateSearch = (text: string) => {
    updateSearchTerm(text);
    updateSearch(parseTags(text));
  };

  const handleSearch = () => {
    updateSearchTerm("");
    router.push({ pathname: "/search", query: search.filters as string });
    updateClear();
  };

  return (
    <SearchContainer className={hidden ?? false ? "hide" : "show"}>
      <WidthWrapper inNav={inNav}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.currentTarget.querySelector("input").blur();
            handleSearch();
          }}
        >
          <InputRegexLayer inNav={inNav}>
            {search?.term &&
              regexWrapJSX(search?.term, [new RegExp(inputRegex, "gi")])}
          </InputRegexLayer>
          <StyledInput
            aria-label="Search packages"
            type="search"
            placeholder="Search packages"
            value={search?.term ?? ""}
            onChange={(e) => handleUpdateSearch(e.target.value)}
            inNav={inNav}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
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
        </form>
        {(!resultsHidden ?? true) && (
          <ResultsContainer
            aria-live="polite"
            aria-modal={!!search?.term || focus}
          >
            {search?.results != null &&
              search?.term != "" &&
              search?.results?.Packages?.length > 0 && (
                <>
                  {search?.results?.Packages?.map((e: IPackage) => (
                    <AutocompleteResult
                      key={`autocomplete-${e.Id}`}
                      id={e.Id}
                      title={e.Latest.Name}
                      org={e.Latest.Publisher}
                      desc={
                        e?.Latest?.Description &&
                        regexWrapJSX(
                          e.Latest.Description,
                          Object.values(debouncedSearchFilters).map(
                            (x) => new RegExp(escapeRegExp(x), "gi")
                          )
                        )
                      }
                      url={e.Latest.Homepage}
                      iconUrl={e.IconUrl}
                    />
                  ))}
                  <div
                    css={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px",
                    }}
                  >
                    <BottomButton
                      onClick={() => setShowSearchOptions(!showSearchOptions)}
                    >
                      Search options
                      <img
                        src={require("./icons/chevron-down-blue.svg")}
                        alt=""
                        css={
                          showSearchOptions && {
                            transform: "rotate(180deg) translateY(2px)",
                          }
                        }
                      />
                    </BottomButton>
                    <BottomButton onClick={handleSearch}>
                      View all results
                      <img src={require("./icons/arrow.svg")} alt="" />
                    </BottomButton>
                  </div>
                </>
              )}
            {search?.results != null &&
              search?.results?.Packages?.length === 0 &&
              debouncedSearchTerm !== "" && (
                <NoResultsText>
                  No results found for "{debouncedSearchTerm}"
                </NoResultsText>
              )}
            {(search?.results?.Packages?.length === 0 ||
              search?.results === null ||
              showSearchOptions) && (
              <SearchOptions
                css={
                  search.results?.Packages?.length === 0 ||
                  (search.results?.Packages?.length > 0 && showSearchOptions)
                    ? { marginTop: "15px" }
                    : {}
                }
              >
                <p>
                  <code>name:</code> Searches only the package names.
                </p>
                <p>
                  <code>publisher:</code> Searches for packages by a publisher.
                </p>
                <p>
                  <code>description:</code> Searches only for keywords in the
                  description.
                </p>
                <p>
                  <code>tags:</code> Searches for packages with a specific tags
                  (comma separated).
                </p>
              </SearchOptions>
            )}
          </ResultsContainer>
        )}
      </WidthWrapper>
    </SearchContainer>
  );
};

export default Search;
