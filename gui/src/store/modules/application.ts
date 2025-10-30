import {defineStore} from "pinia"
import applicationService from "@/store/api-services/application.service.ts"
import {IApplication, IApplicationOverview} from "@/interfaces/application.interface.ts"
import {useUIStore} from "@/store/modules/ui.ts"; // Import the UI store
import {SNACKBAR_MESSAGE_TYPES} from "@/constants";

interface ApplicationState {
    applications: IPagination<IApplicationOverview>
    pollingTimerId?: number;
    pollingAttempts: number;
    pollingStartTime?: number;
    monitorData: any;
    monitorUuid?: string;
    monitoringTimerId?: number;
}

export const useApplicationStore = defineStore("application", {
    state: (): ApplicationState => ({
        applications: {pages: 0, currentPage: 0, results: []},
        pollingTimerId: undefined,
        monitorUuid: undefined,
        monitoringTimerId: -1,
        monitorData:[],
        pollingAttempts: 0,
        pollingStartTime: undefined,

    }),
    actions: {
        async validateApplication(payload: Partial<IApplication>): Promise<boolean> {
            return await applicationService.validateApplication(payload)
        },
        async getApplication(uuid: string): Promise<IApplication> {
            return await applicationService.getApplication(uuid)
        },
        async getAllApplications(): Promise<IPagination<IApplicationOverview>> {
            this.applications.results = await applicationService.getAllApplications()
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
                app.status = status.status
                return status.status
            })
        },
        async invokeMathParsing(equation: string): Promise<{ variables: Array<string> }> {
            return await applicationService.getMathParsedVariables({equation})
        },
        async invoiceGenerateKubevela(promp: string): Promise<{ success: boolean, answer: string }> {
            return await applicationService.generateKubevela(promp)
        },

        async invokeYamlParsing(content: string, key: string): Promise<Array<{ label: string; value: string }>> {
            return await applicationService.getYamlParsedKeys({content}, key)
        },
        async invokeYamlComponents(content: string): Promise<Array<string>> {
            return await applicationService.getYamlComponents({content})
        },
        async duplicateApplication(uuid: string): Promise<IApplicationOverview> {
            const duplicatedApplication: IApplicationOverview = await applicationService.duplicateApplication(uuid)
            this.applications.results.unshift(duplicatedApplication)
            return duplicatedApplication
        },
        async getVRToken(uuid: string): Promise<String> {

            return await applicationService.getVRToken(uuid)
        },
        async undeployApplication(uuid: string): Promise<void> {
            return applicationService.undeployApplication(uuid).then((data) => {
                debugger
                const app: any = this.applications.results.find((app) => app.uuid === uuid);
                app.status = data.status;
                app.uuid = data.updateResource.uuid;
            });
        },

        async checkApplicationStatus(uuids: string[]): Promise<void> {

            const response = await applicationService.checkApplicationStatus(uuids);

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
                }
            });
        },
        startMonitoring(uuid: string) {
            const interval = 2000; // 10 seconds
            this.monitorUuid = uuid;
            const monitoringStatus = async () => {
            clearTimeout(this.monitoringTimerId)
                console.log(`Monitoring deploying/undeploying applications. ${this.monitorUuid}`);
                try {
                    this.monitorData = await applicationService.getMonitoringData(this.monitorUuid);
                    console.log(`Monitoring deploying/undeploying applications. ${this.monitorData}`);
                    } catch (err) {
                    console.log(err);
                }
                this.monitoringTimerId = window.setTimeout(monitoringStatus, interval);
            };
            return monitoringStatus();

        },
        stopMonitoring() {
            console.log("stopMonitoring:"+this.monitorUuid)
            clearTimeout(this.monitorUuid);
        },

        startPolling() {
            const batchSize = 100;
            const interval = 2000; // 10 seconds

            const pollStatus = async () => {
                clearTimeout(this.pollingTimerId)
                console.log(`Polling for ${batchSize} deploying/undeploying applications.`);
                if (!this.applications.results || this.applications.results.length <= 0) {
                    this.pollingTimerId = window.setTimeout(pollStatus, interval * 3);//wait a little bit longer
                    return
                }
                const pages = Math.ceil(this.applications.results.length / batchSize);
                for (let i = 0; i < pages; i++) {
                    try {
                        const batch = this.applications.results.slice(i + (i * batchSize), i + (i * batchSize) + batchSize);
                        await this.checkApplicationStatus(batch.map((app) => app.uuid));
                    } catch (err) {
                        console.log(err);
                    }
                }
                this.pollingTimerId = window.setTimeout(pollStatus, interval);
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