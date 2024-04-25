import { BehaviorType, UnitTimeType, RawMetricConfigType } from "@/types/metrics.ts"

export interface IWindowController {
  unit: UnitTimeType
  type: BehaviorType
  interval: number
}

export interface IMetric {
  name: string,
  level: "global" | "components"
  components?: Array<string>
}

export interface IMetricComposite extends IMetric {
  type: "composite"
  formula: string
  template: string
  isWindowInput: boolean
  isWindowOutput: boolean
  input: IWindowController | null
  output: IWindowController | null
}

export interface IMetricRaw extends IMetric {
  type: "raw"
  sensor: string
  isWindowOutputRaw: boolean
  outputRaw: IWindowController | null
  config: Array<RawMetricConfigType>
}
