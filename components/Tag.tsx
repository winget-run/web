import { styled } from "../utils/theme";

const Tag = styled.a `
    display: inline-block;
    background: transparent;
    padding: 10px;
    background: ${(x) => x.theme.accent};
    transition: background-color 150ms ease;
    font-size: 18px;
    cursor: pointer;
    margin: 0px 15px 30px 0px;
    &:last-child {
        margin-right: 0;
       }
    border-radius: 15px;

    &:hover{
        background: ${(x) => x.theme.accentDark};
    }

`;

export default Tag;