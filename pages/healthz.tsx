import React from "react";

class Healthz extends React.Component {
  static async getInitialProps({ res }) {
    res.statusCode = 204;
    res.end();
  }
}

export default Healthz;
