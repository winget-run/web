import fetch from "isomorphic-unfetch";
import { getAPIUrl } from "../utils/helperFunctions";

export interface IStat {
  Period: string;
  Value: number;
}

export interface IStatsResponse {
  Stats: {
    Id: string;
    Data: IStat[];
  };
}

export default async function getStats(
  packageId: string,
  resolution: string,
  beforeDate: string,
  afterDate: string
): Promise<IStatsResponse> {
  return fetch(
    `https://${getAPIUrl()}/v2/stats?packageId=${packageId}&resolution=${resolution}&before=${beforeDate}&after=${afterDate}`
  ).then((e) => e.json());
}
