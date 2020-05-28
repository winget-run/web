import React from "react";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

let mrRoboto = "User-agent: *\nAllow: /";
if (serverRuntimeConfig.K8S_ENV === "dev") {
  mrRoboto = "User-agent: *\nDisallow: /";
}

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    res.write(mrRoboto);
    res.end();
  }
}

export default Sitemap;
