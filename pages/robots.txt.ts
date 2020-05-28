import React from "react";

let mrRoboto = "User-agent: *\nAllow: /";
if (process.env.K8S_ENV === "dev") {
  mrRoboto = "User-agent: *\nDisallow: /";
}

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    res.write(mrRoboto);
    res.end();
  }
}

export default Sitemap;
