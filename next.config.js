const withImages = require("next-images");
module.exports = withImages({
  serverRuntimeConfig: {
    K8S_ENV: process.env.K8S_ENV,
  },
});
