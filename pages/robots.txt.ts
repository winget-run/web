import React from "react";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

let mrRoboto =
  "User-agent: *\nAllow: /\n\nSitemap: https://winget.run/sitemap.xml";
if (serverRuntimeConfig.K8S_ENV === "dev") {
  mrRoboto = "User-agent: *\nDisallow: /";
}

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-PoweredBy", "https://www.youtube.com/watch?v=6n3pFFPSlW4");
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    res.setHeader("Content-Type", "text/plain");

    res.write(mrRoboto);
    res.end();
  }
}

export default Sitemap;
