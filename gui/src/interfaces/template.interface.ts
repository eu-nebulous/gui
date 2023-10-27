export interface ITemplate {
  id: string
  type: "int" | "double"
  minValue: number
  maxValue: number
  unit: string
}
