import { SearchWrapper } from "./Search";
import { DownloadsWrapper } from "./Downloads";

const Compose = ({ components, children }) => (
  <>
    {components.reverse().reduce((a, c) => {
      const [Provider, props] = Array.isArray(c) ? [c[0], c[1]] : [c, {}];

      return <Provider {...props}>{a}</Provider>;
    }, children)}
  </>
);

const StateWrapper = ({ children }) => (
  <Compose components={[SearchWrapper, DownloadsWrapper]}>{children}</Compose>
);

export default StateWrapper;
