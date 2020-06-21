import React, { createContext, useReducer } from "react";
import { IPackage } from "../../api/getPackages";

const Downloads = createContext(null);

interface IDownload {
  package: IPackage;
  version: string;
}

//TODO: abstract into seperate file
function downloadsReducer(state: IDownload[], action) {
  switch (action.type) {
    case "add":
      return [
        ...state,
        { package: action.payload, version: action.payload.versions[0] },
      ];
    case "remove":
      return state.filter((e) => e.package.Id !== action.payload.Id);
    case "version":
      const stateClone: IDownload[] = JSON.parse(JSON.stringify(state));

      const verIndex = stateClone.findIndex(
        (e) => e.package.Id === action.payload.package.Id
      );
      stateClone[verIndex].version = action.payload.version;

      return stateClone;

    case "clear":
      return [];
    default:
      throw new Error();
  }
}

const DownloadsWrapper = ({ children }) => {
  const [state, dispatch] = useReducer(downloadsReducer, []);

  const addPackage = (item: IPackage) => {
    dispatch({ type: "add", payload: item });
  };
  const removePackage = (item: IPackage) => {
    dispatch({ type: "remove", payload: item });
  };

  const changePackageVersion = (item: IDownload) => {
    dispatch({ type: "version", payload: item });
  };

  const clearPackages = () => {
    dispatch({ type: "clear" });
  };

  return (
    <Downloads.Provider
      value={{
        packages: state,
        addPackage,
        removePackage,
        changePackageVersion,
        clearPackages,
      }}
    >
      {children}
    </Downloads.Provider>
  );
};

export { Downloads, DownloadsWrapper };
export type { IDownload };
