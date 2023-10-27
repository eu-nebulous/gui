import { defineStore } from "pinia"
import router from "@/router"
import { ICredentials, IUser, IUserPayload } from "@/interfaces/user.interface.ts"
import userApiService from "@/store/api-services/user.service.ts"

interface AuthState {
  user: IUser | null
  users: Array<IUser>
}

export const useUserStore = defineStore("user", {
  state: (): AuthState => ({
    user: null,
    users: []
  }),
  actions: {
    async login(credentials: ICredentials) {
      return await userApiService.login(credentials).then((response: { token: string }) => {
        if (response.token) {
          localStorage.setItem("access-token", response.token)
          router.push("/")
        }
      })
    },
    async retrieveUserInfo() {
      this.user = await userApiService.getUserProfileData()
      return this.user
    },
    async editUserProfile(payload: Omit<IUserPayload, "confirmPassword">): Promise<IUser> {
      this.user = await userApiService.editUserProfileData(payload)
      return this.user
    },
    async getAllUsers(): Promise<Array<IUser>> {
      this.users = await userApiService.getAllUsers()
      return this.users
    },
    async createUser(payload: Omit<IUserPayload, "confirmPassword">): Promise<IUser> {
      return userApiService.createUser(payload).then((newUser: IUser) => {
        this.users.push(newUser)
        return newUser
      })
    },
    async editUser(uuid: string, payload: Omit<IUserPayload, "confirmPassword">): Promise<IUser> {
      return userApiService.editUser(uuid, payload).then((editedUser: IUser) => {
        const editedUserIndex: number = this.users.findIndex((user) => user.uuid === uuid)
        this.users[editedUserIndex] = editedUser
        return editedUser
      })
    },
    async deleteUser(uuid: string): Promise<Array<IUser>> {
      return await userApiService.deleteUser(uuid).then(() => {
        const removedUserIndex = this.users.findIndex((user) => user.uuid === uuid)
        this.users.splice(removedUserIndex, 1)
        return this.users
      })
    }
  }
})
