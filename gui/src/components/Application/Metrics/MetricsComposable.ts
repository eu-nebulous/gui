import { computed, reactive, ref } from "vue"
import { IMetricComposite, IMetricRaw } from "@/interfaces/metrics.interface.ts"
import _ from "lodash"
import { required } from "@vuelidate/validators"
import { ValidationRule } from "@vuelidate/core"

export function useMetrics(metrics: Array<IMetricComposite | IMetricRaw>) {
  const localMetrics = computed(() => metrics)
  const previouslyEditedMetricsData: Record<number, IMetricComposite | IMetricRaw> = {}

  const metricsRawRules = {
    name: { required }
  }

  const metricsCompositeRules = {
    name: { required },
    formula: { required }
  }

  const metricRules = reactive({
    name: { required },
    formula: { required }
  })

  // Could not make it work better. Only "reactive" can keep validation rules dynamic
  const getValidationRules = (type: string) => {
    if (type === "composite") {
      Object.assign(metricRules, { formula: { required } })
    } else {
      // @ts-ignore
      delete metricRules.formula
    }
    return metricRules
  }

  const metricTypeChangeHandler = (index: number, event: HTMLElementEvent<HTMLSelectElement>) => {
    const { target } = event
    const previouslyEdited: IMetricRaw | IMetricComposite = previouslyEditedMetricsData?.[index]
    previouslyEditedMetricsData[index] = _.cloneDeep(localMetrics.value[index])

    if (previouslyEdited) {
      localMetrics.value[index] = previouslyEdited
    } else if (target.value === "composite") {
      localMetrics.value[index] = {
        type: "composite",
        name: "",
        formula: "",
        isWindowInput: true,
        isWindowOutput: true,
        level: "global",
        input: {
          type: "all",
          interval: 0,
          unit: "ms"
        },
        output: {
          type: "all",
          interval: 0,
          unit: "ms"
        }
      }
    } else {
      localMetrics.value[index] = {
        type: "raw",
        isWindowOutputRaw: true,
        isWindowInputRaw: true,
        outputRaw: {
          type: "all",
          interval: 0,
          unit: "ms"
        },
        inputRaw: {
          type: "all",
          interval: 0,
          unit: "ms"
        },
        name: "",
        sensor: "",
        config: []
      }
    }
  }

  const removeMetric = (index: number) => {
    localMetrics.value.splice(index, 1)
    delete previouslyEditedMetricsData[index]
  }

  const addSetting = (metric: IMetricRaw) => {
    metric.config.push({ name: "", value: "" })
  }

  const removeSetting = (metric: IMetricRaw, index: number) => {
    metric.config.splice(index, 1)
  }

  const isCompositeMetric = (metric: IMetricRaw | IMetricComposite): metric is IMetricComposite => {
    return (metric as IMetricComposite).type === "composite"
  }

  const isRawMetric = (metric: IMetricRaw | IMetricComposite): metric is IMetricRaw => {
    return (metric as IMetricRaw).type === "raw"
  }

  const getInputValue = (metric: IMetricRaw | IMetricComposite) => {
    if (isRawMetric(metric)) return "-"
    return metric.isWindowInput && metric.input
      ? `${metric.input.type} ${metric.input.interval} ${metric.input.unit}`
      : "-"
  }

  const getOutputValue = (metric: IMetricRaw | IMetricComposite) => {
    if (isRawMetric(metric)) return "-"
    return metric.isWindowOutput && metric.output
      ? `${metric.output.type} ${metric.output.interval} ${metric.output.unit}`
      : "-"
  }

  return {
    localMetrics,
    getValidationRules,
    metricsRawRules,
    metricsCompositeRules,
    metricTypeChangeHandler,
    removeMetric,
    addSetting,
    removeSetting,
    isCompositeMetric,
    isRawMetric,
    getInputValue,
    getOutputValue
  }
}
