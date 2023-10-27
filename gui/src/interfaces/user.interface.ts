export interface IUser {
  uuid: string
  avatarUrl?: string
  firstname: string
  lastname: string
  username: string
  email: string
  org: string
  phone: string
  address: string
  state: string
  zip: number
  country: string
  language: string
  date: Date | string
  status: string
}

export interface IUserPayload {
  firstname: string
  lastname: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface ICredentials {
  username: string
  password: string
}
