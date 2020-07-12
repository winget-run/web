import { styled } from "../utils/theme";
import React from "react";
import { keyframes } from "styled-components";

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
    &::before {
      background: ${(x) => x.theme.accent};
    }
  }

  &:hover::before {
    width: calc(100% + 32px);
    transition: width 250ms cubic-bezier(0.26, 1.29, 0.7, 1.18);
  }

  img {
    margin-left: 6px;
    transform: translateY(1px);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  display: inline-block;
  margin-left: 6px;
  animation: ${rotate} 1s linear infinite;
`;

interface IProps{
  isLoading: boolean;
  onClick: () => void;
}

const LoadMore = (props: IProps) => {
    return (
      <Button>
        Load more packages {props.isLoading ? <Spinner><img src={require("./icons/spinner.svg")} alt="Loading"/></Spinner> : <img src={require("./icons/plus.svg")} alt="Load More" /> }
      </Button>
    );
  };

export default LoadMore;
