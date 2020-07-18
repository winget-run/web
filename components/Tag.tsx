import { styled } from "../utils/theme";

const Tag = styled.a`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${(x) => x.theme.accent};
  transition: background-color 150ms ease;
  font-size: 18px;
  cursor: pointer;
  margin: 0px 15px 15px 0px;
  &:last-child {
    margin: 0px 0px 30px;
  }
  border-radius: 8px;

  &:hover {
    background-color: ${(x) => x.theme.accentDark};
  }
`;

export default Tag;
