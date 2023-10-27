type ExtractProps<T> = InstanceType<T>["$props"]
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`

type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

type LabelValuePair = { value: string; label: string }
