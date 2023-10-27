export interface IUtilityFunction {
  functionName: string
  functionType: "maximize" | "constant"
  functionExpression: string
  functionExpressionVariables: Array<{ nameVariable: string; valueVariable: string }>
}
