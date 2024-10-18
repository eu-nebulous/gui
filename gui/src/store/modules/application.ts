import { defineStore } from "pinia"
import applicationService from "@/store/api-services/application.service.ts"
import { IApplication, IApplicationOverview } from "@/interfaces/application.interface.ts"
import { useUIStore } from "@/store/modules/ui.ts"; // Import the UI store
import { SNACKBAR_MESSAGE_TYPES } from "@/constants";

interface ApplicationState {
  applications: IPagination<IApplicationOverview>
  pollingTimerId?: number;
  pollingAttempts: number; 
  pollingStartTime?: number; 
}

export const useApplicationStore = defineStore("application", {
  state: (): ApplicationState => ({
    applications: { pages: 0, currentPage: 0, results: [] },
    pollingTimerId: undefined,
    pollingAttempts: 0,
    pollingStartTime: undefined,
    
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
    },
    async duplicateApplication(uuid: string): Promise<IApplicationOverview> {
      const duplicatedApplication: IApplicationOverview = await applicationService.duplicateApplication(uuid)
      this.applications.results.unshift(duplicatedApplication)
      return duplicatedApplication
    },
    async undeployApplication(uuid: string): Promise<string> {
      return applicationService.undeployApplication(uuid).then((status) => {
        const app: any = this.applications.results.find((app) => app.uuid === uuid);
        app.status = status.status;
        return status.status;
      });
    },

    async checkApplicationStatus(uuids: string[]): Promise<void> {
      console.log("Checking status for applications:", uuids);

      const response = await applicationService.checkApplicationStatus(uuids);
      console.log("Received status updates:", response);

      response.forEach((updatedApp) => {
        const appIndex = this.applications.results.findIndex((app) => app.uuid === updatedApp.uuid);
        if (appIndex !== -1) {
          const app = this.applications.results[appIndex];
          const previousStatus = app.status;
          app.status = updatedApp.status;

          if (previousStatus !== "draft" && updatedApp.status === "draft") {
            const uiStore = useUIStore();
            uiStore.setSnackbarMessage({
              message: `Application ${app.title} has been unlocked successfully`,
              type: SNACKBAR_MESSAGE_TYPES.SUCCESS,
            });
          }

          console.log(`Updated application ${updatedApp.uuid} to status ${updatedApp.status}`);
        }
      });
    },

    startPolling() {
      console.log("Polling started...");

      const batchSize = 100;
      const interval = 10000; // 10 seconds
      const maxPollingTime = 20000; // 20 seconds
      const maxPollingAttempts = 4;
      
      const pollStatus = async () => {
        const deployingApps = this.applications.results.filter(
            (app) => app.status === "deploying" || app.status === "undeploying"
        );

        if (deployingApps.length === 0) {
          console.log("No applications to poll for.");
          return;
        }

        console.log(`Polling for ${deployingApps.length} deploying/undeploying applications.`);
        
        if (this.pollingAttempts >= maxPollingAttempts) {
          console.log("Max polling attempts reached. Stopping polling.");
          this.stopPolling();
          return;
        }

        if (Date.now() - (this.pollingStartTime || 0) > maxPollingTime) {
          console.log("Max polling time reached. Stopping polling.");
          this.stopPolling();
          return;
        }
        
        for (let i = 0; i < deployingApps.length; i += batchSize) {
          const batch = deployingApps.slice(i, i + batchSize);
          await this.checkApplicationStatus(batch.map((app) => app.uuid));
        }

        const stillDeploying = this.applications.results.some(
            (app) => app.status === "deploying" || app.status === "undeploying"
        );

        if (stillDeploying) {
          console.log(`Some applications are still deploying. Polling again.`);

          this.pollingAttempts++;

          this.pollingTimerId = window.setTimeout(pollStatus, interval);
        } else {
          console.log("All applications have completed. Stopping polling.");
          this.stopPolling();
        }
      };

      this.pollingStartTime = Date.now(); // Set the polling start time
      this.pollingAttempts = 0; // Reset the polling attempts

      pollStatus();
    },

    stopPolling() {
      if (this.pollingTimerId) {
        clearTimeout(this.pollingTimerId);
        this.pollingTimerId = undefined;
        this.pollingStartTime = undefined; // Reset polling start time
        this.pollingAttempts = 0;

        console.log("Polling stopped.");
      }
    },
  },
});