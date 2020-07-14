import { IDownload } from "./state/Downloads";
import generateCommand from "./generateCommand";

const download = (filename: string, text: string) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const generateDownload = (packages: IDownload[]) => {
  const names = packages.map((e) => {
    const [_, ...name] = e.Package.Id.split(".");
    return name.join("-");
  });
  const fileName = `winget-${names.join("_")}.ps1`;

  download(fileName, generateCommand(packages));
};

export default generateDownload;
