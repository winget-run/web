import clipboard from "./clipboard";

export default function generateClipboard(
  packages: string[],
  versions?: string[]
) {
  const commands = `${packages
    .map(
      (e, i) =>
        `winget install -e ${
          versions?.length > 0 ? `-v ${versions[i]}` : ""
        } --id ${e}`
    )
    .join("\r\n")}\r\n`;

  clipboard(commands);
}
