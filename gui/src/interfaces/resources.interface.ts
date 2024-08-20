import {IPlatform} from "@/interfaces/platform.interface.ts";

export interface ISSHCredentials{
  username: string
  keyPairName: string
  privateKey: string

}

export interface ICredentials{
  user: string
  secret: string
  domain: string

}


export interface IResource {
  uuid: string
  title: string
  regions: string
  securityGroup: string
  subnet: string
  endpoint: string
  identityVersion: string
  defaultNetwork: string
  enabled: boolean
  credentials: ICredentials
  sshCredentials: ISSHCredentials
  platform: IPlatform,
  _platform: Array<IPlatform>
}


export interface IAppResource {
  uuid: string
  title: string
  platform: string
  regions: string
  enabled: boolean
}



export interface IRegion {
  region_name: string
  region: string
  endpoints: any
  protocol: any
}


export interface IRegions {
  [key: string]: Array<IRegion>
}





export interface INodeCandidate {
  id: number
  region: string
  instanceType: string
  virtualCores: number
  memory: number
}