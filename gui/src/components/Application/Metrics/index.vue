<template>
  <div class="flex flex-col flex-grow space-y-8">
    <Templates :templates="templates" />
    <Parameters :parameters="parameters" :templateNames="templateNames" />

    <Metrics :metrics="metrics" :componentList="props.payload.componentList"
      :templateNames="templateNames"/>

    <div class="flex flex-col space-y-5">
      <p class="text-2xl">SLO</p>
      <SLOViolations
        :isRootNode="true"
        :sloViolation="sloViolations"
        :metricsNames="metricsNames"
        @addSLOViolation="addSLOViolation"
        @removeSLOViolation="removeSLOViolation"
        @conditionChange="conditionChangeHandler"
        @notExpressionChange="notExpressionChangeHandler"
        @ruleChange="ruleChangeHandler"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import _ from "lodash"
import Templates from "./Templates.vue"
import Parameters from "./Parameters.vue"
import Metrics from "./Metrics.vue"
import SLOViolations from "./SLOViolations.vue"
import { IMetricRaw, IMetricComposite } from "@/interfaces/metrics.interface.js"
import { ITemplate } from "@/interfaces/template.interface.ts"
import { IParameter } from "@/interfaces/parameter.interface.ts"
import { ISLOCompositeExpression, ISLOViolationRule } from "@/interfaces/sloviolation.interface.ts"
import { v4 as uuid } from "uuid"
import { IRulePayload } from "@/components/Application/Metrics/SLOViolations.vue"
import { OperatorType } from "@/types/metrics.ts"
import { useVuelidate } from "@vuelidate/core"

interface MetricsProps {
  payload: {
    componentList: Array<{ label: string; value: string }>
    templates: Array<ITemplate>
    parameters: Array<IParameter>
    metrics: Array<IMetricComposite | IMetricRaw>
    sloViolations: ISLOCompositeExpression
  }
}

const props = withDefaults(defineProps<MetricsProps>(), {
  payload: () => ({
    templates: [{ id: "", type: "int", minValue: 0, maxValue: 0, unit: "ms" }],
    parameters: [{ name: "", template: "" }],
    metrics: [
      {
        type: "composite",
        name: "",
        template: "",
        formula: "",
        isWindowInput: true,
        isWindowOutput: true,
        level: "global",
        components: [],
        input: {
          type: "all",
          interval: 30,
          unit: "sec"
        },
        output: {
          type: "all",
          interval: 30,
          unit: "sec"
        }
      }
    ],
    sloViolations: {
      nodeKey: uuid(),
      isComposite: true,
      condition: "AND",
      not: false,
      children: []
    },
    componentList: []
  })
})

/* templates */
const templates = ref<Array<ITemplate>>(_.cloneDeep(props.payload.templates))
const templateNames = computed(() => templates.value.map((template) => template.id))

/* parameters */
const parameters = ref<Array<IParameter>>(_.cloneDeep(props.payload.parameters))

/* METRICS */
const metrics = ref<Array<IMetricRaw | IMetricComposite>>(_.cloneDeep(props.payload.metrics))
const metricsNames = computed(() => metrics.value.map((metric) => metric.name))

/* SLO */
const sloViolations = reactive<ISLOCompositeExpression>(_.cloneDeep(props.payload.sloViolations))

const preOrderTraversal = function* (
  node: ISLOCompositeExpression | ISLOViolationRule = sloViolations
): IterableIterator<ISLOCompositeExpression | ISLOViolationRule> {
  yield node
  if (node.isComposite && Array.isArray(node.children) && node.children.length) {
    for (const child of node.children) {
      yield* preOrderTraversal(child)
    }
  }
}

const addSLOViolation = (nodeKey: string, type: "composite" | "simple") => {
  const simpleRuleNode: ISLOViolationRule = {
    nodeKey: uuid(),
    isComposite: false,
    metricName: "",
    operator: "<",
    value: 0
  }

  for (const node of preOrderTraversal()) {
    if (node.nodeKey === nodeKey && node.isComposite) {
      if (type === "composite") {
        node.children.unshift({
          nodeKey: uuid(),
          isComposite: true,
          not: false,
          condition: "AND",
          children: [simpleRuleNode as ISLOViolationRule]
        })
      } else {
        node.children.unshift(simpleRuleNode as ISLOViolationRule)
      }
    }
  }
}

const removeSLOViolation = (nodeKey: string) => {
  for (const node of preOrderTraversal()) {
    if (!node.isComposite) continue
    const filtered = node.children.filter((violation) => violation.nodeKey !== nodeKey)
    if (filtered.length !== node.children.length) {
      node.children = filtered
    }
  }
}

const conditionChangeHandler = (nodeKey: string, condition: "OR" | "AND") => {
  for (const node of preOrderTraversal()) {
    if (!node.isComposite) continue
    if (node.nodeKey === nodeKey) {
      node.condition = condition
    }
  }
}

const notExpressionChangeHandler = (nodeKey: string, not: boolean) => {
  for (const node of preOrderTraversal()) {
    if (!node.isComposite) continue
    if (node.nodeKey === nodeKey) {
      node.not = not
    }
  }
}

const ruleChangeHandler = ({ nodeKey, field, value }: IRulePayload) => {
  for (const node of preOrderTraversal()) {
    if (node.isComposite) continue
    if (node.nodeKey === nodeKey && Object.prototype.hasOwnProperty.call(node, field)) {
      if (field === "value") node[field] = Number(value)
      else if (field === "operator") {
        node[field] = value as OperatorType
      } else {
        node[field] = value
      }
    }
  }
}

const v$ = useVuelidate({ $stopPropagation: true })

defineExpose({ componentV$: computed(() => v$), metrics, sloViolations, templates, parameters })
</script>
