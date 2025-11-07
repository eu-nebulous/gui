import axios, {AxiosResponse} from "axios"
import {INodeCandidate, IResource} from "@/interfaces/resources.interface.ts"
import { IResourcePayload } from "@/types/resource.ts"
import { DeleteResponseType } from "@/types/responses.ts"
import { IPlatform } from "@/interfaces/platform.interface.ts"

export default {
  async getAllResources(): Promise<IPagination<IResource>> {
    return axios.get("/api/v1/resources/all").then(({ data }) => data)
  },
  async getCandidates(uuid:string): Promise<Array<INodeCandidate>> {
    return axios.get(`/api/v1/resources/${uuid}/candidates`).then(({ data }) => data)
  },

  async createResource(payload: IResourcePayload): Promise<IResource> {
    return axios.post("/api/v1/resources", payload).then(({ data }) => data)
  },
  async editResource(uuid: string, payload: IResourcePayload): Promise<IResource> {
    return axios.patch(`/api/v1/resources/${uuid}/uuid`, payload).then(({ data }) => data)
  },
  async deleteResource(uuid: string): Promise<DeleteResponseType> {
    return axios.delete(`/api/v1/resources/${uuid}/uuid`).then(({ data }) => data)
  },
  async getPlatforms(): Promise<AxiosResponse> {
    return axios.get("/api/v1/platforms/all")
  }
}
