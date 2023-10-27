export interface IResource {
  uuid: string
  title: string
  platform: string
  enabled: boolean
  appId: string
  appSecret: string
}

export interface IAppResource {
  uuid: string
  title: string
  platform: string
  enabled: boolean
}
