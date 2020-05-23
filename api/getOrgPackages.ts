import { IResponse } from "./getPackages";

export default async function getOrgPackages(org: string): Promise<IResponse> {
  return fetch(`https://api.winget.run/api/v1/${org}`).then((e) => e.json());
}
