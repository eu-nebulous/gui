import { IMetricComposite, IMetricRaw } from "@/interfaces/metrics.interface.ts"
import { IVariable } from "@/interfaces/variables.interface.ts"
import { IAppResource } from "@/interfaces/resources.interface.ts"
import {ISLExpression, ISLOCompositeExpression} from "@/interfaces/sloviolation.interface.ts"
import { IUtilityFunction } from "@/interfaces/utilityFunctions.interface.ts"
import { ITemplate } from "@/interfaces/template.interface.ts"
import { IParameter } from "@/interfaces/parameter.interface.ts"
import {IEnvironment} from "@/interfaces/environment.interface.ts";

export interface IApplication {
  title: string
  content: string
  policy: string
  status: string
  uuid: string
  templates: Array<ITemplate>
  parameters: Array<IParameter>
  metrics: Array<IMetricComposite | IMetricRaw>
  variables: Array<IVariable>
  environmentVariables: Array<IEnvironment>
  resources: Array<IAppResource>
  sloViolations: string | Array<ISLExpression>
  slCreations: string | Array<ISLExpression>
  slMetaConstraints: string | ISLOCompositeExpression
  utilityFunctions: Array<IUtilityFunction>
}

export interface IApplicationOverview extends IApplication {
  uuid: string
  latency?: Array<number>
  reconfigurations?: Array<number>
  deployments?: Array<object>
  violations?: Array<number>
  strain?: number
}
