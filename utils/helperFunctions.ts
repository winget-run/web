import { ISearchFilters } from "./state/Search";

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
