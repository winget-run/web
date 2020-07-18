export const getIcon = (url: string | null): string => {
  if (url) {
    let newUrl: string;

    // Edge Cases
    if (url.includes("github.com")) {
      newUrl = "https://github.githubassets.com/favicons/favicon-dark.svg";
    }

    if (newUrl) {
      return newUrl;
    }
    return `https://www.google.com/s2/favicons?sz=32&domain_url=${url}`;
  }
  return "/favicon.ico";
};
