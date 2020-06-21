//TODO: fix this fucking abortion
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { media } from "styled-bootstrap-grid";

import { IPackage } from "../api/getPackages";
import { Downloads } from "../utils/state/Downloads";
import { styled } from "../utils/theme";
import generateClipboard from "../utils/clipboard";

export const CardContainer = styled.div<{ selected?: boolean }>`
  border-radius: 8px;
  background: ${(x) => x.theme.grey};
  width: 100%;
  height: calc(100% - 15px);
  padding: 15px 15px 54px;
  margin-bottom: 15px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  border: 2px solid transparent;
  transition: border-color 200ms ease;

  ${(x) =>
    x.selected &&
    `
  border-color: ${x.theme.accent};
  `}

  ${media.md`
    height: calc(100% - 30px);
    margin-bottom: 30px;
  `}
`;

export const Add = styled.button<{ selected: boolean }>`
  width: 50px;
  height: 50px;
  background: transparent;
  border: none;
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  &::before,
  &::after {
    content: "";
    position: absolute;
    background: ${(x) => x.theme.text};
    border-radius: 20px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &::before {
    width: 3px;
    height: calc(100% - 30px);
    transition: height 200ms ease;

    ${(x) => x.selected && `height: 0%`}
  }
  &::after {
    width: calc(100% - 30px);
    height: 3px;
  }

  &:focus {
    outline: none;
    &::before,
    &::after {
      background: ${(x) => x.theme.accentLight};
    }
  }
`;

const Copy = styled.button`
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 14px;
  background: transparent;
  border: none;
  color: ${(x) => x.theme.text};
  cursor: pointer;
  line-height: 19px;

  &:focus {
    outline: none;
    color: ${(x) => x.theme.accentLight};
  }

  img {
    margin-right: 8px;
    transform: translateY(4px);
  }
`;

export const CardTitle = styled.h2`
  display: block;
  color: ${(x) => x.theme.text};
  font-size: 20px;
  margin: 0;
  padding-right: 30px;
  max-width: calc(100% - 30px);
  word-break: break-word;
`;

export const CardIcon = styled.img`
  height: 22px;
  width: 22px;
  margin-right: 10px;
  transform: translateY(4px);
`;

export const CardOrg = styled.h3`
  display: inline-block;
  color: ${(x) => x.theme.accentLight};
  font-size: 14px;
  margin: 5px 0 0;
`;

export const CardDesc = styled.p`
  color: ${(x) => x.theme.textFade};
  font-size: 16px;
  line-height: 20px;
  margin: 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Card = ({ p }: { p: IPackage }) => {
  const links = p.Id.split(".");
  const { packages, addPackage, removePackage } = useContext(Downloads);
  const inPackages = !!packages.find((e) => e.package.Id === p.Id);
  return (
    <CardContainer selected={inPackages}>
      <Add
        onClick={() => {
          inPackages ? removePackage(p) : addPackage(p);
        }}
        selected={inPackages}
        aria-label="Add to selection"
        title={inPackages ? "Remove from selection" : "Add to selection"}
      />
      <Link href="/pkg/[org]/[pkg]" as={`/pkg/${links[0]}/${links[1]}`}>
        <a>
          <CardTitle>
            <CardIcon
              src={
                p.latest.IconUrl ||
                (p.latest.Homepage
                  ? `https://www.google.com/s2/favicons?sz=32&domain_url=${p.latest.Homepage}`
                  : "/favicon.ico")
              }
              alt=""
            />
            {p.latest.Name}
          </CardTitle>
        </a>
      </Link>
      <Link href="/pkg/[org]" as={`/pkg/${links[0]}`}>
        <a>
          <CardOrg>{p.latest.Publisher}</CardOrg>
        </a>
      </Link>
      <CardDesc>{p.latest.Description}</CardDesc>
      <Copy
        onClick={() => {
          generateClipboard([{ package: p, version: p.versions[0] }]);
          toast.dark(`Copied ${p.latest.Name} to clipboard!`);
        }}
        title="Copy the command to your clipboard"
      >
        <img src={require("./icons/copy.svg")} alt="" />
        Copy command
      </Copy>
    </CardContainer>
  );
};

export default Card;
