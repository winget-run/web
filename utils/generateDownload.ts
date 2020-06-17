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
  const names = packages.map((e) => {
    const [_, ...name] = e.split(".");
    return name.join("-");
  });
  const fileName = `winget-${names.join("_")}.${fileType}`;
  const commands = `${packages
    .map((e) => `winget install -e --id ${e}`)
    .join("\r\n")}\r\n`;
  const output = `powershell\r\n${commands}\r\nexit`;

  download(fileName, output);
}
