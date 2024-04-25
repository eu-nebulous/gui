import { computed } from 'vue';
import { IMetricComposite, IMetricRaw } from "@/interfaces/metrics.interface.ts"
import _ from "lodash"
import { required } from "@vuelidate/validators"
import { ValidationRule } from "@vuelidate/core"

export function useMetrics(metrics: Array<IMetricComposite | IMetricRaw>) {
  const localMetrics = computed(() => metrics)
  const previouslyEditedMetricsData: Record<number, IMetricComposite | IMetricRaw> = {}


  const metricsRawRules = computed(() => ({
    name: { required }
  }));

  const metricsCompositeRules = computed(() => ({
    name: { required },
    formula: { required }
  }));
  
    const getValidationRules = (type:string) => {
    if (type === 'composite') {
      return metricsCompositeRules.value;
    } else if (type === 'raw') {
      return metricsRawRules.value;
    }
    return { name: { required } };
  };


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
        template:"",
        level:"global",
        components:[],
        isWindowInput: true,
        isWindowOutput: true,
        input: {
          type: "batch",
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
        level:"global",
        components:[],
        outputRaw: {
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
