import { BehaviorType, UnitTimeType, RawMetricConfigType } from "@/types/metrics.ts"

export interface IWindowController {
  unit: UnitTimeType
  type: BehaviorType
  interval: number
}

export interface IMetric {
  name: string
}

export interface IMetricComposite extends IMetric {
  type: "composite"
  level: "global" | "components"
  components?: Array<string>
  formula: string
  isWindowInput: boolean
  isWindowOutput: boolean
  input: IWindowController | null
  output: IWindowController | null
}

export interface IMetricRaw extends IMetric {
  type: "raw"
  sensor: string
  isWindowInputRaw: boolean
  isWindowOutputRaw: boolean
  inputRaw: IWindowController | null
  outputRaw: IWindowController | null
  config: Array<RawMetricConfigType>
}
