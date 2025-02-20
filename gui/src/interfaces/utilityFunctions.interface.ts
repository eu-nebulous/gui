export interface IUtilityFunction {
  functionName: string
  functionType: "maximize" | "constant" | "minimize" | "constraint"
  functionExpression: string
  functionConstraintOperator: ">" | "<" | "<=" | ">=" | "==" | "!=="
  functionExpressionVariables: Array<{ nameVariable: string; valueVariable: string }>
  selected: boolean
}
