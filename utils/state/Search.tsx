import { IResponse } from "../../api/getPackages";
import { useReducer, createContext } from "react";

enum SearchActionType {
  Search = "search",
  Results = "results",
  ClearResults = "clearResults",
  Clear = "clear",
}

type ISearchAction =
  | { type: SearchActionType.Search; payload: ISearchFilters }
  | { type: SearchActionType.Results; payload: IResponse }
  | {
      type: SearchActionType.Clear | SearchActionType.ClearResults;
      payload: null;
    };

// can be expanded later to add more search functionality
interface ISearchFilters {
  query?: string;
}

interface ISearchState {
  filters?: ISearchFilters;
  results?: IResponse;
}

interface ISearchContext {
  search: ISearchState;
  updateSearch: (filters: ISearchFilters) => void;
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
