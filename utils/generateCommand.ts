import { IDownload } from "./state/Downloads";

export default function generateCommand(packages: IDownload[]): string {
  return `${packages
    .map(
      (e) =>
        `winget install -e --id ${e.Package.Id}${
          e.Version !== e.Package.Versions[0] ? ` -v ${e.Version}` : ""
        }`
    )
    .join(";")}`;
}
