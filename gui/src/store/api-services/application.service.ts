import axios from "axios"
import {IApplication, IApplicationOverview} from "@/interfaces/application.interface.ts"
import {DeleteResponseType, DeployResponseType, PolicyResponseType, UndeployResponseType} from "@/types/responses.ts"
import {IVariable} from "@/interfaces/variables.interface.ts"
import {IResource} from "@/interfaces/resources.interface.ts"
import {ITemplate} from "@/interfaces/template.interface.ts"
import {IParameter} from "@/interfaces/parameter.interface.ts"
import {IMetricComposite, IMetricRaw} from "@/interfaces/metrics.interface.ts"
import {IUtilityFunction} from "@/interfaces/utilityFunctions.interface.ts"
import {IEnvironment} from "@/interfaces/environment.interface.ts";
import {v4 as v4uuid} from "uuid"
import {ISLOCompositeExpression} from "@/interfaces/sloviolation.interface.ts";

export default {
    async validateApplication(payload: Partial<IApplication>): Promise<boolean> {
        return axios.post("/api/v1/application/validate", payload).then(({data}) => data)
    },
    async getMathParsedVariables(payload: { equation: string }): Promise<{ variables: Array<string> }> {
        return axios.post("/api/v1/mathparser/expression", payload).then(({data}) => data)
    },
    async generateKubevela(payload): Promise<{ success: boolean, answer: string }> {
        return axios.post("/api/v1/application/generate", {prompt: payload}).then(({data}) => data)
    },

    async getYamlParsedKeys(payload: { content: string }, key: string): Promise<Array<{
        label: string;
        value: string
    }>> {
        return axios.post(`/api/v1/kubevela/keys?q=${key}`, payload).then(({data}) => data)
    },
    async getYamlComponents(payload: { content: string }): Promise<Array<string>> {
        return axios.post("/api/v1/kubevela/components", payload).then(({data}) => data)
    },
    // TODO: App object normalization to separate function. Reuse everywhere
    async getApplication(uuid: string): Promise<IApplication> {
        return axios.get(`/api/v1/application/${uuid}/uuid`).then(response => {
            const application: any = response.data

            console.log("Go Application from Service", application)
            return {
                title: application.title,
                content: application.content,
                status: application.status,
                uuid: application.uuid,
                policy: application.policy,
                variables: application.variables.map(({name, lowerValue, higherValue}: IVariable) => ({
                    name,
                    lowerValue,
                    higherValue
                })),
                environmentVariables: application.environmentVariables ? application.environmentVariables.map(({
                                                                                                                   name,
                                                                                                                   value,
                                                                                                                   secret
                                                                                                               }: IEnvironment) => ({
                    name,
                    value,
                    secret
                })) : [],
                resources: application.resources.map(({uuid, title, platform, enabled}: IResource) => ({
                    uuid,
                    title,
                    platform,
                    enabled
                })),
                templates: application.templates.map(({id, type, minValue, maxValue, unit}: ITemplate) => ({
                    id,
                    type,
                    minValue,
                    maxValue,
                    unit
                })),
                parameters: application.parameters.map(({name, template}: IParameter) => ({name, template})),
                metrics: application.metrics.map((metric: IMetricRaw | IMetricComposite) => {
                    if (metric.type === "composite")
                        return {
                            type: metric.type,
                            level: metric.level,
                            components: metric.components,
                            name: metric.name,
                            template: metric.template,
                            formula: metric.formula,
                            isWindowInput: metric.isWindowInput,
                            input: {
                                type: metric.input?.type ?? "all",
                                interval: metric.input?.interval ?? 30,
                                unit: metric.input?.unit ?? "sec"
                            },
                            isWindowOutput: metric.isWindowOutput,
                            output: {
                                type: metric.output?.type ?? "all",
                                interval: metric.output?.interval ?? 30,
                                unit: metric.output?.unit ?? "sec"
                            }
                        }
                    else
                        return {
                            type: metric.type,
                            name: metric.name,
                            level: metric.level,
                            components: metric.components,
                            sensor: metric.sensor,
                            config: metric.config,
                            isWindowOutputRaw: metric.isWindowOutputRaw,
                            outputRaw: {
                                type: metric.outputRaw?.type ?? "all",
                                interval: metric.outputRaw?.interval ?? 30,
                                unit: metric.outputRaw?.unit ?? "sec"
                            }
                        }
                }),
                sloViolations:
                    !application.sloViolations ?
                        {
                            nodeKey: v4uuid(),
                            isComposite: true,
                            condition: "AND",
                            not: false,
                            children: [],
                            violationThreshold: 0,
                            evaluationPeriod: 0

                        } :
                        typeof application.sloViolations === "string"
                            ? JSON.parse(application.sloViolations)
                            : application.sloViolations,
                slCreations:
                    !application.slCreations ?
                        [{
                            nodeKey: v4uuid(),
                            isComposite: true,
                            condition: "AND",
                            not: false,
                            children: []
                        }] :
                        typeof application.slCreations === "string"
                            ? JSON.parse(application.slCreations)
                            : application.slCreations,
                slMetaConstraints:
                    !application.slMetaConstraints ?
                        {
                            nodeKey: v4uuid(),
                            isComposite: true,
                            condition: "AND",
                            not: false,
                            children: []
                        } :
                        typeof application.slMetaConstraints === "string"
                            ? JSON.parse(application.slMetaConstraints)
                            : application.slMetaConstraints,
                utilityFunctions: application.utilityFunctions.map(
                    ({
                         functionName,
                         functionType,
                         functionExpression,
                         functionExpressionVariables,
                         functionConstraintOperator,
                         selected
                     }: IUtilityFunction) => ({
                        functionName,
                        functionType,
                        functionExpression,
                        functionExpressionVariables,
                        functionConstraintOperator,
                        selected
                    })
                )
            }
        })
    },
    async getApplicationJson(uuid: string): Promise<IApplication> {
        return axios.get(`/api/v1/application/${uuid}/uuid/json`)
    },
    async getAllApplications(): Promise<Array<IApplicationOverview>> {
        return axios.get("/api/v1/application/all").then(({data}) => data)
    },
    async createApplication(payload: Partial<IApplication>): Promise<IApplicationOverview> {
        console.log("Saving application", payload)
        return axios.post("/api/v1/application", payload).then(({data}) => data)
    },
    async editApplication(uuid: string, payload: Partial<IApplication>): Promise<IApplicationOverview> {
        console.log("Patching application", payload)
        return axios.patch(`/api/v1/application/${uuid}/uuid`, payload).then(({data}) => data.updatedResource)
    },
    async deleteApplication(uuid: string): Promise<DeleteResponseType> {
        return axios.delete(`/api/v1/application/${uuid}/uuid`).then(({data}) => data)
    },
    async deployApplication(uuid: string): Promise<DeployResponseType> {
        return axios.post(`/api/v1/application/${uuid}/uuid/deploy`).then(({data}) => data)
    },
    async publishPolicies(policies: string): Promise<PolicyResponseType> {
        console.log("Publishing policies", policies)
        return axios.post(`/api/v1/policies/publish`, {policies: policies}).then(({data}) => data)
    },
    async duplicateApplication(uuid: string): Promise<IApplicationOverview> {
        return axios.post(`/api/v1/application/${uuid}/uuid/duplicate`).then(({data}) => data)
    },
    async undeployApplication(uuid: string): Promise<UndeployResponseType> {
        return axios.post(`/api/v1/application/${uuid}/uuid/undeploy`).then(({data}) => data)
    },
    async checkApplicationStatus(uuids: string[]): Promise<Array<{ uuid: string; status: string }>> {
        return axios.post("/api/v1/application/status", {uuids}).then(({data}) => data)
    },
    async getMonitoringData(uuid: string): Promise<Array<any>> {
        return axios.get(`/api/v1/application/${uuid}/monitor/data`).then(({data}) => data)
    },
    async getVRToken(uuid: string): Promise<String> {
        return axios.post(`/api/v1/application/${uuid}/vr/token`).then(({data}) => data)
    },

}