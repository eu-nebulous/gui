import { OperatorType } from "@/types/metrics.ts"

export interface ISLOCompositeExpression {
  nodeKey: string
  isComposite: true
  not: boolean
  condition: "AND" | "OR"
  children: Array<ISLOViolationRule | ISLOCompositeExpression>
}

export interface ISLOViolationRule {
  nodeKey: string
  isComposite: false
  metricName: string
  operator: OperatorType
  value: number
}
