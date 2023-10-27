import { defineStore } from "pinia"
import { IResource } from "@/interfaces/resources.interface.ts"
import resourceService from "@/store/api-services/resources.service.ts"
import { IResourcePayload } from "@/types/resource.ts"
import { IPlatform } from "@/interfaces/platform.interface.ts"

interface ResourcesState {
  resources: IPagination<IResource>
  platforms: Array<IPlatform>
}

export const useResourceStore = defineStore("resource", {
  state: (): ResourcesState => ({
    resources: { pages: 0, currentPage: 0, results: [] },
    platforms: []
  }),
  actions: {
    async createResource(payload: IResourcePayload): Promise<IResource> {
      const createdResource = await resourceService.createResource(payload)
      this.resources.results.unshift(createdResource)
      return createdResource
    },
    async getAllResources(): Promise<IPagination<IResource>> {
      this.resources = await resourceService.getAllResources()
      return this.resources
    },
    async deleteResource(uuid: string): Promise<IPagination<IResource>> {
      return await resourceService.deleteResource(uuid).then(() => {
        const removedResourceIndex = this.resources.results.findIndex((res) => res.uuid === uuid)
        this.resources.results.splice(removedResourceIndex, 1)
        return this.resources
      })
    },
    async editResource(uuid: string, payload: IResourcePayload): Promise<IResource> {
      return resourceService.editResource(uuid, payload).then((editedResource: IResource) => {
        const editedResourceIndex: number = this.resources.results.findIndex((resource) => resource.uuid === uuid)
        this.resources.results[editedResourceIndex] = editedResource
        return editedResource
      })
    },
    async getPlatforms(): Promise<Array<IPlatform>> {
      this.platforms = await resourceService.getPlatforms()
      return this.platforms
    }
  }
})
