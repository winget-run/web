import React from "react";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

const sitemapXML = (data) => {
  let URL = "winget.run";
  if (serverRuntimeConfig.K8S_ENV === "dev") {
    URL = "dev-web.winget.run";
  }

  const packages = data.map((e) => {
    const [org, ...pkg] = e.Id.split(".");
    return `
    <url>
    <loc>https://${URL}/pkg/${org}/${pkg.join(".")}</loc>
    <lastmod>${e.updatedAt}</lastmod>
    <priority>0.80</priority>
    </url>`;
  });

  const orgsArray = [...new Set(data.map((e) => e.Id.split(".")[0]))];

  const orgs = orgsArray.map((e) => {
    return `
    <url>
    <loc>https://${URL}/pkg/${e}</loc>
    <priority>0.50</priority>
    </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://${URL}/</loc>
        <priority>1.00</priority>
      </url>
      ${packages.join("")}
      ${orgs.join("")}
    </urlset>`;
};

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    let URL = "api.winget.run";
    if (serverRuntimeConfig.K8S_ENV === "dev") {
      URL = "dev-api.winget.run";
    }

    try {
      const data = await fetch(`https://${URL}/v1/list`).then((e) => e.json());
      res.setHeader("Content-Type", "text/xml");
      res.write(sitemapXML(data.list));
      res.end();
    } catch (error) {
      res.write(`<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://${URL}/</loc>
          <priority>1.00</priority>
        </url>
      </urlset>`);
      res.end();
    }
  }
}

export default Sitemap;
