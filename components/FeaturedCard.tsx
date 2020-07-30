import Link from "next/link";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import { IPackage } from "../api/getPackages";
import generateClipboard from "../utils/clipboard";
import { Downloads } from "../utils/state/Downloads";
import styled from "../utils/theme";
import { CardContainer, Add, Copy } from "./Card";

const FeaturedCardContainer = styled(CardContainer)<{
  selected?: boolean;
  small: boolean;
}>`
  min-height: ${(x) => (x.small ? "172px" : "235px")};
  background-position: center;
  background-size: cover;
  background-origin: border-box;
  border-color: rgba(0, 0, 0, 0.65);
  overflow: hidden;

  ${(x) =>
    x.selected &&
    `
  border-color: ${x.theme.accent};
  `}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.65);
  }
`;

const Logo = styled.img<{ small: boolean }>`
  position: absolute;
  height: auto;
  width: auto;
  max-height: ${(x) => (x.small ? "68px" : "112px")};
  max-width: ${(x) => (x.small ? "166px" : "220px")};
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: 250ms ease;
`;

const FeaturedCard = ({ p, small }: { p: IPackage; small?: boolean }) => {
  const [org, ...pkg] = p.Id.split(".");
  const { packages, addPackage, removePackage } = useContext(Downloads);
  const inPackages = !!packages.find((e) => e.Package.Id === p.Id);
  return (
    <FeaturedCardContainer
      selected={inPackages}
      small={small}
      style={{ backgroundImage: `url(${p.Banner})` }}
    >
      <Add
        onClick={() => {
          inPackages ? removePackage(p) : addPackage(p);
        }}
        selected={inPackages}
        aria-label="Add to selection"
        title={inPackages ? "Remove from selection" : "Add to selection"}
      />
      <Link href="/pkg/[org]/[pkg]" as={`/pkg/${org}/${pkg.join(".")}`}>
        <a>
          <Logo small={small} src={p.Logo} alt={`${p.Latest.Name} logo`} />
        </a>
      </Link>
      <Copy
        onClick={() => {
          generateClipboard([{ Package: p, Version: p.Versions[0] }]);
          toast.dark(`Copied ${p.Latest.Name} to clipboard!`);
        }}
        title="Copy the command to your clipboard"
      >
        <img src={require("./icons/copy.svg")} alt="" />
        Copy command
      </Copy>
    </FeaturedCardContainer>
  );
};

export default FeaturedCard;
