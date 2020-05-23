import clipboard from "./clipboard";

export default function generateClipboard(packages: string[]) {
  const commands = `${packages
    .map((e) => `winget install -e --id ${e}`)
    .join("\r\n")}\r\n`;

  clipboard(commands);
}
