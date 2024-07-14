import { defineStore } from "pinia"
import { IResource, INodeCandidate } from "@/interfaces/resources.interface.ts"

import resourceService from "@/store/api-services/resources.service.ts"
import { IResourcePayload } from "@/types/resource.ts"
import { IPlatform } from "@/interfaces/platform.interface.ts"

interface ResourcesState {
  resources: IPagination<IResource>
  candidates: Array<INodeCandidate>
  platforms: Array<IPlatform>
}

export const useResourceStore = defineStore("resource", {
  state: (): ResourcesState => ({
    resources: { pages: 0, currentPage: 0, results: [] },
    candidates: [],
    platforms: []
  }),
  actions: {
    async createResource(payload: IResourcePayload): Promise<IResource> {
      const createdResource = await resourceService.createResource(payload)
      createdResource.platform = {'uuid':createdResource._platform[0].uuid, 'title':createdResource._platform[0].title}
      this.resources.results.unshift(createdResource)
      return createdResource
    },
    async getAllResources(): Promise<IPagination<IResource>> {
      this.platforms = await this.getPlatforms()
      let resources = await resourceService.getAllResources()

      resources.results.forEach((r)=>{
        if(!r.regions){
          r.regions = ''
        }
      })
      this.resources = resources
      return this.resources
    },
    async getAllNodeCandidate(uuid:string): Promise<Array<INodeCandidate>> {
      this.candidates = await resourceService.getCandidates(uuid)
      return this.candidates
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
