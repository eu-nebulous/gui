
<script setup lang="ts">
import {computed, reactive, ref} from "vue"
import _ from "lodash"
import Templates from "./Templates.vue"
import Parameters from "./Parameters.vue"
import Metrics from "./Metrics.vue"
import SLOViolations from "./SLOViolations.vue"
import {IMetricComposite, IMetricRaw} from "@/interfaces/metrics.interface.js"
import {ITemplate} from "@/interfaces/template.interface.ts"
import {IParameter} from "@/interfaces/parameter.interface.ts"
import {ISLOCompositeExpression, ISLOViolationRule} from "@/interfaces/sloviolation.interface.ts"
import {v4 as uuid} from "uuid"
import {IRulePayload} from "@/components/Application/Metrics/SLOViolations.vue"
import {OperatorType} from "@/types/metrics.ts"
import {useVuelidate} from "@vuelidate/core"
import Button from "@/base-components/Button";
import applicationService from "@/store/api-services/application.service.ts";
import LoadingIcon from "@/base-components/LoadingIcon";

interface MetricsProps {
  payload: {
    componentList: Array<{ label: string; value: string }>
    templates: Array<ITemplate>
    parameters: Array<IParameter>
    metrics: Array<IMetricComposite | IMetricRaw>
    sloViolations: ISLOCompositeExpression
    slCreations: ISLOCompositeExpression
    slMetaConstraints: ISLOCompositeExpression
  }
}

const props = withDefaults(defineProps<MetricsProps>(), {
  payload: () => ({
    templates: [{id: "", type: "int", minValue: 0, maxValue: 0, unit: "ms"}],
    parameters: [{name: "", template: ""}],
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
    slCreations: {
      nodeKey: uuid(),
      isComposite: true,
      condition: "AND",
      not: false,
      children: []
    },
    slMetaConstraints: {
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
const slCreations = reactive<ISLOCompositeExpression>(_.cloneDeep(props.payload.slCreations))
const slMetaConstraints = reactive<ISLOCompositeExpression>(_.cloneDeep(props.payload.slMetaConstraints))
const slMetaConstraintsValid = ref(true)
const nodeManager = (nodes: ISLOCompositeExpression | ISLOViolationRule) => {
  const preOrderTraversal = function* (
      node: ISLOCompositeExpression | ISLOViolationRule = nodes,
      depth: number = 0
  ): IterableIterator<ISLOCompositeExpression | ISLOViolationRule> {
    yield node;
    // Check if this node has children to traverse
    if (node.isComposite && Array.isArray(node.children) && node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        // Log before delegating to recursive call
        yield* preOrderTraversal(child, depth + 1);
      }
    }
  }
  return {
    add: (nodeKey: string, type: "composite" | "simple") => {
      const simpleRuleNode: ISLOViolationRule = {
        nodeKey: uuid(),
        isComposite: false,
        metricName: "",
        operator: "<",
        value: 0
      }

      for (const node of preOrderTraversal(nodes)) {
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
    },
    remove: (nodeKey: string) => {
      for (const node of preOrderTraversal(nodes)) {
        if (!node.isComposite) continue
        const filtered = node.children.filter((violation) => violation.nodeKey !== nodeKey)
        if (filtered.length !== node.children.length) {
          node.children = filtered
        }
      }
    },
    onChange: (nodeKey: string, condition: "OR" | "AND") => {
      for (const node of preOrderTraversal(nodes)) {
        if (!node.isComposite) continue
        if (node.nodeKey === nodeKey) {
          node.condition = condition
        }
      }
    },
    onExpressionChange: (nodeKey: string, not: boolean) => {
      for (const node of preOrderTraversal(nodes)) {
        if (!node.isComposite) continue
        if (node.nodeKey === nodeKey) {
          node.not = not
        }
      }
    },
    onRuleChange: ({nodeKey, field, value}: IRulePayload) => {

      for (const node of preOrderTraversal(nodes)) {
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
  }

}

const v$ = useVuelidate({$stopPropagation: true})

defineExpose({
  componentV$: computed(() => v$),
  metrics,
  sloViolations,
  slCreations,
  slMetaConstraints,
  templates,
  parameters
})
</script>
<template>
  <div class="flex flex-col flex-grow space-y-8">
    <Templates :templates="templates"/>
    <Parameters :parameters="parameters" :templateNames="templateNames"/>

    <Metrics :metrics="metrics"
             :componentList="props.payload.componentList"
             :templateNames="templateNames"/>

    <div class="flex flex-col space-y-5">
      <p class="text-2xl">SLO</p>
      <SLOViolations
          :isRootNode="true"
          :rules="sloViolations"
          :metricsNames="metricsNames"
          @addSLOViolation="nodeManager(sloViolations).add"
          @removeSLOViolation="nodeManager(sloViolations).remove"
          @conditionChange="nodeManager(sloViolations).onChange"
          @notExpressionChange="nodeManager(sloViolations).onExpressionChange"
          @ruleChange="nodeManager(sloViolations).onRuleChange"
      />
    </div>

    <div class="flex flex-col space-y-5">
      <p class="text-2xl">SL Creation</p>
      <SLOViolations
          :isRootNode="true"
          :rules="slCreations"
          :metricsNames="metricsNames"
          @addSLOViolation="nodeManager(slCreations).add"
          @removeSLOViolation="nodeManager(slCreations).remove"
          @conditionChange="nodeManager(slCreations).onChange"
          @notExpressionChange="nodeManager(slCreations).onExpressionChange"
          @ruleChange="nodeManager(slCreations).onRuleChange"
      />
    </div>
    <div class="flex flex-col space-y-5"
    >
      <p class="text-2xl">Meta-Constraint Creator</p>
      <div :class="{
         'flex flex-col rounded-lg space-y-5': slMetaConstraintsValid,
         'flex flex-col rounded-lg space-y-5 div--invalid': !slMetaConstraintsValid,
      }"
      >

        <SLOViolations
            :isRootNode="true"
            :rules="slMetaConstraints"
            :metricsNames="metricsNames"
            @addSLOViolation="nodeManager(slMetaConstraints).add"
            @removeSLOViolation="nodeManager(slMetaConstraints).remove"
            @conditionChange="nodeManager(slMetaConstraints).onChange"
            @notExpressionChange="nodeManager(slMetaConstraints).onExpressionChange"
            @ruleChange="nodeManager(slMetaConstraints).onRuleChange"
        />
      </div>

    </div>

  </div>


</template>
