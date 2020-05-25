import React, { createContext, useReducer } from "react";
import { IPackage } from "../api/getPackages";

export const Downloads = createContext(null);

//TODO: abstract into seperate file
export function downloadsReducer(state: IPackage[], action) {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    case "remove":
      return state.filter((e) => e.Id !== action.payload.Id);
    default:
      throw new Error();
  }
}

const StateWrapper = ({ children }) => {
  const [state, dispatch] = useReducer(downloadsReducer, []);

  const addPackage = (item: IPackage) => {
    dispatch({ type: "add", payload: item });
  };
  const removePackage = (item: IPackage) => {
    dispatch({ type: "remove", payload: item });
  };

  return (
    <Downloads.Provider value={{ packages: state, addPackage, removePackage }}>
      {children}
    </Downloads.Provider>
  );
};

export default StateWrapper;
