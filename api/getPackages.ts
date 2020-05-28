import fetch from "isomorphic-unfetch";

export interface IPackageInfo {
  Description?: string;
  Name: string;
  AppMoniker?: string;
  Version: string;
  Publisher: string;
  Channel?: string;
  Author?: string;
  License?: string;
  LicenseUrl?: string;
  MinOSVersion?: string;
  Homepage?: string;
  Tags?: string;
  FileExtensions?: string;
  Protocols?: string;
  Commands?: string;
  InstallerType?: string;
  Switches?: {
    Custom?: string;
    Silent?: string;
    SilentWithProgress?: string;
    Interactive?: string;
    Language?: string;
  };
  Log?: string;
  InstallLocation?: string;
  Installers: [
    {
      Arch: string;
      Url: string;
      Sha256: string;
      SignatureSha256?: string;
      Language?: string;
      InstallerType: string;
      Scope?: string;
      SystemAppId?: string;
      Switches?: {
        Language?: string;
        Custom?: string;
      };
    }
  ];
  Localization?: [
    {
      Language: string;
      Description?: string;
      Homepage?: string;
      LicenseUrl?: string;
    }
  ];
}

export interface IPackage {
  Id: string;
  latest: IPackageInfo;
  versions: string[];
}

export interface IResponse {
  packages: IPackage[];
  total: number;
}

export interface IResponseSingle {
  package: IPackage;
}

let URL = "api.winget.run";
if (process.env.K8S_ENV === "dev") {
  URL = "dev-api.winget.run";
}

export default async function getPackages(route = ""): Promise<IResponse> {
  return fetch(`https://${URL}/v1/${route}`).then((e) => e.json());
}
