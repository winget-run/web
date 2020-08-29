import { IResponse } from "../../api/getPackages";
import { useReducer, createContext } from "react";

enum SearchActionType {
  Search = "search",
  Results = "results",
  Term = "term",
  ClearResults = "clearResults",
  Clear = "clear",
}

type ISearchAction =
  | { type: SearchActionType.Search; payload: ISearchFilters }
  | { type: SearchActionType.Term; payload: string }
  | { type: SearchActionType.Results; payload: IResponse }
  | {
      type: SearchActionType.Clear | SearchActionType.ClearResults;
      payload: null;
    };

// can be expanded later to add more search functionality
export interface ISearchFilters {
  query?: string;
  name?: string;
  publisher?: string;
  description?: string;
  tags?: string;
  sort?: string;
  order?: number;
}

interface ISearchState {
  filters?: ISearchFilters;
  term?: string;
  results?: IResponse;
}

interface ISearchContext {
  search: ISearchState;
  updateSearch: (filters: ISearchFilters) => void;
  updateSearchTerm: (term: string) => void;
  updateResults: (results: IResponse) => void;
  updateClearResults: () => void;
  updateClear: () => void;
}

const Search: React.Context<ISearchContext> = createContext(null);

const searchReducer = (state: ISearchState, action: ISearchAction) => {
  switch (action.type) {
    case "search": {
      return {
        ...state,
        filters: action.payload,
      };
      // break;
    }
    case "term": {
      return { ...state, term: action.payload };
    }
    case "results": {
      return {
        ...state,
        results: action.payload,
      };
      // break;
    }
    case "clearResults": {
      return {
        ...state,
        results: null,
      };
      // break;
    }
    case "clear": {
      return {};
      // break;
    }
    default: {
      throw new Error("Unknown searchReducer action type");
      // break;
    }
  }
};

const SearchWrapper = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, {});

  const updateSearch = (filters) =>
    dispatch({ type: SearchActionType.Search, payload: filters });

  const updateSearchTerm = (term: string) =>
    dispatch({ type: SearchActionType.Term, payload: term });

  const updateResults = (results) =>
    dispatch({ type: SearchActionType.Results, payload: results });

  const updateClearResults = () =>
    dispatch({ type: SearchActionType.ClearResults, payload: null });

  const updateClear = () =>
    dispatch({ type: SearchActionType.Clear, payload: null });

  return (
    <Search.Provider
      value={{
        search: state,
        updateSearch,
        updateSearchTerm,
        updateResults,
        updateClearResults,
        updateClear,
      }}
    >
      {children}
    </Search.Provider>
  );
};

export { Search, SearchWrapper };
