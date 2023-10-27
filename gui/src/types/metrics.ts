export type MetricType = "raw" | "composite"
export type BehaviorType = "all" | "sliding"
export type UnitTimeType = "ms" | "sec" | "min" | "hour" | "day"
export type RawMetricConfigType = { name: string; value: string }
export type OperatorType = ">" | "<" | "<=" | ">=" | "==" | "!=="
export type ConditionType = "AND" | "OR"
