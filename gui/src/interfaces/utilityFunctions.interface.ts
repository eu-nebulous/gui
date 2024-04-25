export interface IUtilityFunction {
  functionName: string
  functionType: "maximize" | "constant" | "minimize"
  functionExpression: string
  functionExpressionVariables: Array<{ nameVariable: string; valueVariable: string }>
}
