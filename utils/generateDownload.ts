import download from "./download";

export enum fileType {
  powershell = "ps1",
  bat = "bat",
  bash = "sh",
}

export default function generateDownload(
  fileType: fileType,
  packages: string[]
) {
  const fileName = `winget-${packages.join("_")}.${fileType}`;
  const commands = `${packages
    .map((e) => `winget install -e --id ${e}`)
    .join("\r\n")}\r\n`;

  download(fileName, commands);
}
