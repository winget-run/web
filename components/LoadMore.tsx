import { styled } from "../utils/theme";
import React from "react";
import { keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Button = styled.button`
  display: block;
  position: relative;
  background: transparent;
  border: none;
  margin: 30px auto;
  color: ${(x) => x.theme.text};
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  overflow: visible;
  padding-right: 37px;

  &::before {
    content: "";
    position: absolute;
    width: 53px;
    height: 53px;
    border-radius: 27px;
    background: ${(x) => x.theme.accentDark};
    z-index: -1;
    right: -12px;
    top: 50%;
    transform: translateY(-50%) translateY(1px);
    transition: width 250ms ease;
  }

  &:focus {
    outline: none;
  }

  &:hover::before,
  &:focus::before {
    width: calc(100% + 32px);
    transition: width 250ms cubic-bezier(0.26, 1.29, 0.7, 1.18);
  }

  img {
    position: absolute;
    margin-left: 13px;
    margin-top: 6px;

    &.spinner {
      margin-left: 10px;
      margin-top: 2px;
      animation: ${rotate} 1s linear infinite;
    }
  }
`;

interface IProps extends React.HTMLProps<HTMLButtonElement> {
  isLoading: boolean;
}

const LoadMore = ({ isLoading, onClick }: IProps) => {
  return (
    <Button onClick={onClick}>
      Load more packages
      {isLoading ? (
        <img
          className="spinner"
          src={require("./icons/spinner.svg")}
          alt="Loading"
        />
      ) : (
        <img src={require("./icons/plus.svg")} alt="Load More" />
      )}
    </Button>
  );
};

export default LoadMore;
