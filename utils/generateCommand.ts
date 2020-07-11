import { IDownload } from "./state/Downloads";

export default function generateCommand(packages: IDownload[]): string {
  return `${packages
    .map(
      (e) =>
        `winget install -e --id ${e.package.Id}${
          e.version !== e.package.versions[0] ? ` -v ${e.version}` : ""
        }`
    )
    .join("\r\n")}\r\n`;
}
