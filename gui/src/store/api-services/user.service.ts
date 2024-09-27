import axios from "axios"
import { ICredentials, IUser, IUserPayload } from "@/interfaces/user.interface.ts"
import { DeleteResponseType } from "@/types/responses.ts"

export default {
  async login(payload: ICredentials): Promise<{ token: string }> {
    return axios.post("/api/v1/@apostrophecms/login/login", payload).then(({ data }) => data)
  },
  async getUserProfileData(): Promise<IUser> {
    return axios.get("/api/v1/@apostrophecms/settings").then(({ data }) => data)
  },
  async editUserProfileData(payload: Omit<IUserPayload, "confirmPassword">): Promise<IUser> {
    return axios.patch("/api/v1/userapi/profile-update", payload).then(({ data }) => data)
  },
  async getAllUsers(): Promise<Array<IUser>> {
    return axios.get("/api/v1/userapi/all").then(({ data }) => data)
  },
  async createUser(payload: Omit<IUserPayload, "confirmPassword">): Promise<IUser> {
    return axios.post("/api/v1/userapi/create-user", payload).then(({ data }) => data)
  },
  async editUser(uuid: string, payload: Omit<IUserPayload, "confirmPassword">): Promise<IUser> {
    return axios.patch(`/api/v1/userapi/${uuid}/uuid`, payload).then(({ data }) => data)
  },
  async deleteUser(uuid: string): Promise<DeleteResponseType> {
    return axios.delete(`/api/v1/userapi/${uuid}/uuid`).then(({ data }) => data)
  }
}
