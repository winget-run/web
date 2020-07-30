import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export interface IStat {
  Period: string;
  Value: string;
}

export interface IStatsResponse {
  Stats: {
    Id: string;
    Data: IStat[];
  };
}

let URL = "api.winget.run";
if (
  serverRuntimeConfig.K8S_ENV === "dev" ||
  publicRuntimeConfig.K8S_ENV === "dev"
) {
  URL = "dev-api.winget.run";
}

export default async function getStats(
  packageId: string,
  resolution: string,
  beforeDate: string,
  afterDate: string
): Promise<IStatsResponse> {
  return fetch(
    `https://${URL}/v2/stats?packageId=${packageId}&resolution=${resolution}&before=${beforeDate}&after=${afterDate}`
  ).then((e) => e.json());
}
