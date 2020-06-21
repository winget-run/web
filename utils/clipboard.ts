import { IDownload } from "./state/Downloads";
import generateCommand from "./generateCommand";

const clipboard = (str: string) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const generateClipboard = (packages: IDownload[]) =>
  clipboard(generateCommand(packages));

export default generateClipboard;
