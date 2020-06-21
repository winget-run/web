import { IDownload } from "./state/Downloads";

export default function generateCommand(packages: IDownload[]): string {
  const commands = `${packages
    .map(
      (e) =>
        `winget install -e --id ${e.package.Id}${
          e.version !== e.package.versions[0] ? ` -v ${e.version}` : ""
        }`
    )
    .join("\r\n")}\r\n`;

  return `powershell\r\n${commands}\r\nexit`;
}
