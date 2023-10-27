import axios from "axios"
import {IApplication, IApplicationOverview} from "@/interfaces/application.interface.ts"
import {DeleteResponseType, DeployResponseType} from "@/types/responses.ts"
import {IVariable} from "@/interfaces/variables.interface.ts"
import {IResource} from "@/interfaces/resources.interface.ts"
import {ITemplate} from "@/interfaces/template.interface.ts"
import {IParameter} from "@/interfaces/parameter.interface.ts"
import {IMetricComposite, IMetricRaw} from "@/interfaces/metrics.interface.ts"
import {IUtilityFunction} from "@/interfaces/utilityFunctions.interface.ts"
import {IEnvironment} from "@/interfaces/environment.interface.ts";

export default {
    async validateApplication(payload: Partial<IApplication>): Promise<boolean> {
        return axios.post("/api/v1/application/validate", payload).then(({data}) => data)
    },
    async getMathParsedVariables(payload: { equation: string }): Promise<{ variables: Array<string> }> {
        return axios.post("/api/v1/mathparser/expression", payload).then(({data}) => data)
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
            const application: any= response.data
            console.log("getApplication " , application)
            return {
                title: application.title,
                content: application.content,
                status: application.status,
                uuid: application.uuid,
                variables: application.variables.map(({name, lowerValue, higherValue}: IVariable) => ({
                    name,
                    lowerValue,
                    higherValue
                })),
                environmentVariables: application.environmentVariables ? application.environmentVariables.map(({name, value, secret}: IEnvironment) => ({
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
                            sensor: metric.sensor,
                            config: metric.config,
                            isWindowInputRaw: metric.isWindowInputRaw,
                            inputRaw: {
                                type: metric.inputRaw?.type ?? "all",
                                interval: metric.inputRaw?.interval ?? 30,
                                unit: metric.inputRaw?.unit ?? "sec"
                            },
                            isWindowOutputRaw: metric.isWindowOutputRaw,
                            outputRaw: {
                                type: metric.outputRaw?.type ?? "all",
                                interval: metric.outputRaw?.interval ?? 30,
                                unit: metric.outputRaw?.unit ?? "sec"
                            }
                        }
                }),
                sloViolations:
                    typeof application.sloViolations === "string"
                        ? JSON.parse(application.sloViolations)
                        : application.sloViolations,
                utilityFunctions: application.utilityFunctions.map(
                    ({
                         functionName,
                         functionType,
                         functionExpression,
                         functionExpressionVariables
                     }: IUtilityFunction) => ({
                        functionName,
                        functionType,
                        functionExpression,
                        functionExpressionVariables
                    })
                )
            }
        })
    },
    async getAllApplications(): Promise<Array<IApplicationOverview>> {
        return axios.get("/api/v1/application/all").then(({data}) => data)
    },
    async createApplication(payload: Partial<IApplication>): Promise<IApplicationOverview> {
        console.log("Saving application", payload)
        return axios.post("/api/v1/application", payload).then(({data}) => data)
    },
    async editApplication(uuid: string, payload: Partial<IApplication>): Promise<IApplicationOverview> {
        // TODO: remove updatedResource when BE has fixed it.
        console.log("Patching application", payload)
        return axios.patch(`/api/v1/application/${uuid}/uuid`, payload).then(({data}) => data.updatedResource[0])
    },
    async deleteApplication(uuid: string): Promise<DeleteResponseType> {
        return axios.delete(`/api/v1/application/${uuid}/uuid`).then(({data}) => data)
    },
    async deployApplication(uuid: string): Promise<DeployResponseType> {
        return axios.post(`/api/v1/application/${uuid}/uuid/deploy`).then(({data}) => data)
    }

}
