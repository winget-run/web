import React, { createContext, useReducer } from "react";
import { IPackage } from "../../api/getPackages";

interface IDownload {
  Package: IPackage;
  Version: string;
}

interface IDownloadContext {
  packages: IDownload[];
  addPackage: (item: IPackage) => void;
  removePackage: (item: IPackage) => void;
  changePackageVersion: (item: IDownload) => void;
  clearPackages: () => void;
}

const Downloads: React.Context<IDownloadContext> = createContext(null);

//TODO: abstract into seperate file
function downloadsReducer(state: IDownload[], action) {
  switch (action.type) {
    case "add":
      return [
        ...state,
        { Package: action.payload, Version: action.payload.Versions[0] },
      ];
    case "remove":
      return state.filter((e) => e.Package.Id !== action.payload.Id);
    case "version":
      const stateClone: IDownload[] = JSON.parse(JSON.stringify(state));

      const verIndex = stateClone.findIndex(
        (e) => e.Package.Id === action.payload.Package.Id
      );
      stateClone[verIndex].Version = action.payload.Version;

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
