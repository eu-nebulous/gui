import { defineStore } from "pinia"
import { IResource, INodeCandidate } from "@/interfaces/resources.interface.ts"

import resourceService from "@/store/api-services/resources.service.ts"
import { IResourcePayload } from "@/types/resource.ts"
import { IPlatform } from "@/interfaces/platform.interface.ts"
import applicationService from "@/store/api-services/application.service.ts";

interface PoliciesState {
  rules: string
}

export const usePolicyStore = defineStore("policies", {
  state: (): PoliciesState => ({
    rules: ""
  }),
  actions: {
    async publishPolicies(rules:string): Promise<string> {
      return applicationService.publishPolicies(rules).then((status) => {
        return status.status
      })
    },
  }
})
