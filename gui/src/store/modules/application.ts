import { defineStore } from "pinia"
import applicationService from "@/store/api-services/application.service.ts"
import { IApplication, IApplicationOverview } from "@/interfaces/application.interface.ts"

interface ApplicationState {
  applications: IPagination<IApplicationOverview>
}

export const useApplicationStore = defineStore("application", {
  state: (): ApplicationState => ({
    applications: { pages: 0, currentPage: 0, results: [] }
  }),
  actions: {
    async validateApplication(payload: Partial<IApplication>): Promise<boolean> {
      return await applicationService.validateApplication(payload)
    },
    async getApplication(uuid: string): Promise<IApplication> {
      const application = await applicationService.getApplication(uuid)
      console.log("This application ", application)

      return application
    },
    async getAllApplications(): Promise<IPagination<IApplicationOverview>> {
      this.applications.results = await applicationService.getAllApplications()
      console.log("This application results", this.applications.results)
      return this.applications
    },
    async createApplication(payload: IApplication): Promise<IApplicationOverview> {
      const createdApplication: IApplicationOverview = await applicationService.createApplication(payload)
      this.applications.results.unshift(createdApplication)
      return createdApplication
    },
    async editApplication(uuid: string, payload: Partial<IApplication>): Promise<IApplicationOverview> {
      const editedApplication: IApplicationOverview = await applicationService.editApplication(uuid, payload)
      const editedApplicationIndex: number = this.applications.results.findIndex((app) => app.uuid === uuid)
      this.applications.results[editedApplicationIndex] = editedApplication
      return editedApplication
    },
    async removeApplication(uuid: string): Promise<IPagination<IApplicationOverview>> {
      return await applicationService.deleteApplication(uuid).then(() => {
        const removedApplicationIndex: number = this.applications.results.findIndex((app) => app.uuid === uuid)
        this.applications.results.splice(removedApplicationIndex, 1)
        return this.applications
      })
    },
    async deployApplication(uuid: string): Promise<string> {
      return applicationService.deployApplication(uuid).then((status) => {
        const app: any = this.applications.results.find((app) => app.uuid === uuid)
        app.status= status.status
        return status.status
      })
    },
    async invokeMathParsing(equation: string): Promise<{ variables: Array<string> }> {
      return await applicationService.getMathParsedVariables({ equation })
    },
    async invokeYamlParsing(content: string, key: string): Promise<Array<{ label: string; value: string }>> {
      return await applicationService.getYamlParsedKeys({ content }, key)
    },
    async invokeYamlComponents(content: string): Promise<Array<string>> {
      return await applicationService.getYamlComponents({ content })
    }
  }
})
