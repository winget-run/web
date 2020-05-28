import React from "react";
import fetch from "isomorphic-unfetch";

const sitemapXML = (data) => {
  const packages = data.map((e) => {
    const [org, ...pkg] = e.Id.split(".");
    return `
    <url>
    <loc>https://winget.run/pkg/${org}/${pkg}</loc>
    <lastmod>${e.updatedAt}</lastmod>
    <priority>0.80</priority>
    </url>`;
  });

  const orgsArray = [...new Set(data.map((e) => e.Id.split(".")[0]))];

  const orgs = orgsArray.map((e) => {
    return `
    <url>
    <loc>https://winget.run/pkg/${e}</loc>
    <priority>0.50</priority>
    </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://winget.run/</loc>
        <priority>1.00</priority>
      </url>
      ${packages.join("")}
      ${orgs.join("")}
    </urlset>`;
};

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    const data = await fetch("https://api.winget.run/v1/list").then((e) =>
      e.json()
    );

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemapXML(data.list));
    res.end();
  }
}

export default Sitemap;
