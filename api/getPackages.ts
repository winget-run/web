import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

export interface IManifestInfo {
  Description?: string;
  Name: string;
  AppMoniker?: string;
  Publisher: string;
  Channel?: string;
  Author?: string;
  License?: string;
  LicenseUrl?: string;
  MinOSVersion?: string;
  Homepage?: string;
  Tags?: string[];
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
  Latest: IManifestInfo;
  Featured: boolean;
  IconUrl?: string;
  Banner?: string;
  Logo?: string;
  Versions: string[];
  UpdatedAt: Date;
}

export interface IResponse {
  Packages: IPackage[];
  Total: number;
}

export interface IResponseSingle {
  Package: IPackage;
}

let URL = "api.winget.run";
if (
  serverRuntimeConfig.K8S_ENV === "dev" ||
  process.env.NEXT_PUBLIC_K8S_ENV === "dev"
) {
  URL = "dev-api.winget.run";
}

export default async function getPackages(route = ""): Promise<IResponse> {
  return fetch(`https://${URL}/v2/${route}`).then((e) => e.json());
}
