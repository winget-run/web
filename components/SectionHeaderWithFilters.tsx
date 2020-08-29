import styled from "../utils/theme";
import { mediaBreakpointDown } from "react-grid";
import SectionHeader from "./SectionHeader";

export const SortSelectWrapper = styled.div`
  position: relative;
  ${mediaBreakpointDown("xs")} {
    flex: 1;
  }
`;

export const SortSelect = styled.select`
  display: block;
  padding: 10px 40px 10px 15px;
  border-radius: 8px;
  border: none;
  background-color: ${(x) => x.theme.grey};
  appearance: none;
  color: white;
  font-size: 18px;
  text-align: left;
  width: 214px;
  cursor: pointer;

  ${mediaBreakpointDown("xs")} {
    width: 100%;
  }

  + img {
    position: absolute;
    pointer-events: none;
    width: 13px;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
  }
`;

export const OrderButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  background-color: ${(x) => x.theme.grey};
  color: white;
  font-size: 18px;
  width: 170px;
  margin-left: 30px;
  text-align: left;
  cursor: pointer;

  ${mediaBreakpointDown("sm")} {
    width: auto;
    height: 44px;
    padding: 15px;
    margin-left: 15px;
    span {
      display: none;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SectionHeaderWithFilters = styled(SectionHeader)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 0;
  ${mediaBreakpointDown("sm")} {
    flex-direction: column;
  }
  > div {
    &:first-of-type {
      flex: auto;
      position: relative;
      margin: 0 0 30px;
      padding: 0 0 19px;
      &::after {
        content: "";
        position: absolute;
        width: 60px;
        height: 4px;
        left: 0;
        bottom: 0;
        background-color: #327080;
      }
    }
    &:last-child {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
    }
  }
  &::after {
    display: none;
  }
`;
