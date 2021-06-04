import getConfig from "next/config";
import { IStat, IStatsResponse } from "../api/getStats";
import { ISearchFilters } from "./state/Search";

const SAMPLING_PERIOD = 1000 * 60 * 60 * 24;
const SAMPLE_COUNT = 7;
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export const getIcon = (url: string | null, isSearch: boolean): string => {
  if (url) {
    let newUrl: string;

    // Edge Cases
    if (url.includes("github.com")) {
      if (isSearch) {
        newUrl = "https://github.githubassets.com/favicons/favicon.svg";
      } else {
        newUrl = "https://github.githubassets.com/favicons/favicon-dark.svg";
      }
    }

    if (newUrl) {
      return newUrl;
    }
    return `https://www.google.com/s2/favicons?sz=32&domain_url=${url}`;
  }
  return "/favicon.ico";
};

export const regexWrapJSX = (
  input: string,
  regexes: RegExp[]
): React.ReactElement[] | string[] | string => {
  if (!regexes.length) {
    return input;
  }
  const split = input.split(regexes[0]);
  const replacements = input.match(regexes[0]);
  const result = [];
  for (let i = 0; i < split.length - 1; i++) {
    result.push(regexWrapJSX(split[i], regexes.slice(1)));
    result.push(<span key={result.length}>{replacements[i]}</span>);
  }
  result.push(regexWrapJSX(split[split.length - 1], regexes.slice(1)));
  return result;
};

/**
 * @url https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
 *
 * @param string
 * @returns Escaped string
 */
export const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

export const parseTagMatches = (query: string): string[] => {
  const taglist = ["name", "publisher", "description", "tags"];

  const tags = taglist
    .map((e) => query.indexOf(`${e}:`))
    .filter((e) => e !== -1)
    .sort((a, b) => a - b);
  if (tags.length === 0) {
    return [`query:${query}`];
  }

  return tags.map((e, i, a) => query.slice(e, a[i + 1] ?? query.length).trim());
};

export const parseTags = (q: string): ISearchFilters => {
  const data = parseTagMatches(q);

  const final = data.reduce((a, c) => {
    const [tag, query] = c.split(":");
    return { ...a, [tag.trim()]: query.trim() };
  }, {});

  return final;
};

export const parseQueryString = (obj: ISearchFilters): string =>
  Object.entries(obj)
    .map(([k, v]) => (v ? `${k}=${encodeURIComponent(v)}` : null))
    .join("&");

export const padDate = (stats: IStat[]) => {
  const currentDateInMs = Date.now() - SAMPLING_PERIOD;
  const paddedStats = [...new Array(SAMPLE_COUNT).keys()].reverse().map((e) => {
    const time = new Date(currentDateInMs - e * SAMPLING_PERIOD);
    time.setUTCHours(0, 0, 0, 0);

    return (
      stats.find((f) => f.Period === time.toISOString()) ?? {
        Period: time.toISOString(),
        Value: 0,
      }
    );
  });
  return paddedStats;
};

export const getAPIUrl = () => {
  let URL = "api.winget.run";
  if (
    serverRuntimeConfig.K8S_ENV === "dev" ||
    publicRuntimeConfig.K8S_ENV === "dev"
  ) {
    URL = "dev-api.winget.run";
  }
  return URL;
};
