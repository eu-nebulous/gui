<template>
  <div :class="computedRootClass">
    <div v-if="props.sloViolation.isComposite" :class="computedCompositeClass">
      <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
        <div class="flex ml-4">
          <FormCheck.Label :htmlFor="`not-condition-${props.sloViolation.nodeKey}`">
            <Button as="div" size="sm" variant="primary">
              <FormCheck>
                <FormCheck.Input
                  class="border"
                  :id="`not-condition-${props.sloViolation.nodeKey}`"
                  type="checkbox"
                  :checked="props.sloViolation.not"
                  @change="
                    emit('notExpressionChange', props.sloViolation.nodeKey, ($event.target as HTMLInputElement).checked)
                  "
                />
                <span class="ml-2">NOT</span>
              </FormCheck>
            </Button>
          </FormCheck.Label>

          <FormCheck>
            <FormCheck.Label :htmlFor="`or-condition-radio-${props.sloViolation.nodeKey}`">
              <Button as="div" size="sm" variant="primary" class="w-16">
                <FormCheck.Input
                  :id="`or-condition-radio-${props.sloViolation.nodeKey}`"
                  type="radio"
                  :name="`radio-condition-${props.sloViolation.nodeKey}`"
                  value="OR"
                  :checked="props.sloViolation.condition === 'OR'"
                  @change="emit('conditionChange', props.sloViolation.nodeKey, 'OR')"
                />
                <span class="ml-2">OR</span>
              </Button>
            </FormCheck.Label>
          </FormCheck>
          <FormCheck>
            <FormCheck.Label :htmlFor="`and-condition-radio-${props.sloViolation.nodeKey}`">
              <Button as="div" size="sm" variant="primary" class="w-16">
                <FormCheck.Input
                  :id="`and-condition-radio-${props.sloViolation.nodeKey}`"
                  type="radio"
                  :name="`radio-condition-${props.sloViolation.nodeKey}`"
                  value="AND"
                  :checked="props.sloViolation.condition === 'AND'"
                  @change="emit('conditionChange', props.sloViolation.nodeKey, 'AND')"
                />
                <span class="ml-2">AND</span>
              </Button>
            </FormCheck.Label>
          </FormCheck>
        </div>

        <div class="flex flex-col space-y-2 p-5 sm:p-0 sm:space-y-0 sm:flex-row sm:space-x-2 sm:ml-auto">
          <Button size="sm" variant="primary" @click="emit('addSLOViolation', props.sloViolation.nodeKey, 'simple')">
            <Lucide icon="Plus" class="w-4 h-4 mr-2" />
            <p class="hidden md:inline-block">Add Simple Expr.</p>
            <p class="inline-block md:hidden">Simple</p>
          </Button>
          <Button size="sm" variant="primary" @click="emit('addSLOViolation', props.sloViolation.nodeKey, 'composite')">
            <Lucide icon="Plus" class="w-4 h-4 mr-2" />
            <p class="hidden md:inline-block">Add Composite Expr.</p>
            <p class="inline-block md:hidden">Composite</p>
          </Button>
          <Button
            size="sm"
            variant="danger"
            :disabled="props.isRootNode"
            @click="emit('removeSLOViolation', props.sloViolation.nodeKey)"
          >
            Remove
          </Button>
        </div>
      </div>

      <draggable handle=".drag-button" :list="props.sloViolation.children">
        <SLOViolations
          v-for="violation in props.sloViolation.children"
          :key="violation.nodeKey"
          :sloViolation="violation"
          :metricsNames="props.metricsNames"
          @addSLOViolation="(nodeKey, type) => emit('addSLOViolation', nodeKey, type)"
          @removeSLOViolation="(nodeKey) => emit('removeSLOViolation', nodeKey)"
          @conditionChange="(nodeKey, condition) => emit('conditionChange', nodeKey, condition)"
          @notExpressionChange="(nodeKey, notExpression) => emit('notExpressionChange', nodeKey, notExpression)"
          @ruleChange="(payload) => emit('ruleChange', payload)"
        />
      </draggable>
    </div>

    <div
      v-else-if="!props.isRootNode"
      class="flex flex-col items-center md:flex-row space-y-4 md:space-y-0 md:space-x-4"
    >
      <Lucide icon="Move" class="drag-button ml-4 w-6 h-6" />
      <Select
        :value="props.sloViolation.metricName"
        @change="
          emit('ruleChange', {
            nodeKey: props.sloViolation?.nodeKey,
            field: 'metricName',
            value: ($event.target as HTMLSelectElement).value
          })
        "
        class="md:w-3/6"
        :class="{
          'input--invalid':
            v$.metricName?.$error || hasBackendError(`sloViolations[${props.sloViolation.nodeKey}].metricName`)
        }"
      >
        <option v-for="(metric, index) in props.metricsNames" :key="index">{{ metric }}</option>
      </Select>
      <Select
        :value="props.sloViolation.operator"
        @change="
          emit('ruleChange', {
            nodeKey: props.sloViolation?.nodeKey,
            field: 'operator',
            value: ($event.target as HTMLSelectElement).value
          })
        "
        class="md:w-1/6"
        :class="{
          'input--invalid':
            v$.operator?.$error || hasBackendError(`sloViolations[${props.sloViolation.nodeKey}].operator`)
        }"
      >
        <option v-for="(operator, index) in OPERATORS" :key="index">{{ operator }}</option>
      </Select>
      <Input
        type="number"
        :value="props.sloViolation.value"
        @change="
          emit('ruleChange', {
            nodeKey: props.sloViolation?.nodeKey,
            field: 'value',
            value: ($event.target as HTMLInputElement).value
          })
        "
        class="md:w-2/6"
        :class="{
          'input--invalid': v$.value?.$error || hasBackendError(`sloViolations[${props.sloViolation.nodeKey}].value`)
        }"
      />
      <div class="self-end md:self-auto">
        <Lucide icon="Trash2" class="text-danger" @click="emit('removeSLOViolation', props.sloViolation?.nodeKey)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref, inject } from "vue"
import { twMerge } from "tailwind-merge"
import { required } from "@vuelidate/validators"
import { VueDraggableNext as draggable } from "vue-draggable-next"
import { FormCheck } from "@/base-components/Form"
import Button from "@/base-components/Button/Button.vue"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import { OPERATORS } from "@/constants"
import Select from "@/base-components/Form/FormSelect.vue"
import Input from "@/base-components/Form/FormInput.vue"
import { ISLOCompositeExpression, ISLOViolationRule } from "@/interfaces/sloviolation.interface.ts"
import { useVuelidate } from "@vuelidate/core"
import { OperatorType } from "@/types/metrics.ts"

interface SLOViolationProps {
  sloViolation: ISLOViolationRule | ISLOCompositeExpression
  metricsNames: Array<string>
  isRootNode?: boolean
}

export interface IRulePayload {
  nodeKey: string
  field: "operator" | "metricName" | "value"
  value: string
}

const emit = defineEmits<{
  (e: "addSLOViolation", nodeKey: string, type: "composite" | "simple"): void
  (e: "removeSLOViolation", nodeKey: string): void
  (e: "conditionChange", nodeKey: string, condition: "OR" | "AND"): void
  (e: "notExpressionChange", nodeKey: string, not: boolean): void
  (e: "ruleChange", payload: IRulePayload): void
}>()

const pathsWithError = inject<Ref<Array<string>>>("pathsWithError")

const props = defineProps<SLOViolationProps>()

const sloRules = !props.sloViolation.isComposite
  ? {
      metricName: { required },
      operator: { required },
      value: { required }
    }
  : {}

const v$ = useVuelidate(sloRules, props.sloViolation)

const computedRootClass = computed(() =>
  twMerge([
    "relative p-2 md:p-5",
    "before:w-2 md:before:w-5 before:-mt-5 md:before:mt-0 before:h-px before:block before:absolute before:bg-danger before:top-1/2 before:-ml-2 md:before:-ml-5",
    props.isRootNode && "before:content-none"
  ])
)

const computedCompositeClass = computed(() =>
  twMerge([
    "flex flex-col before:mt-4 before:w-5 before:absolute before:border-l before:border-dashed before:!border-danger before:!rounded-tl-3xl before:h-[calc(100%-151px)] md:before:h-[calc(100%-95px)]"
  ])
)

const hasBackendError = (path: string) => {
  if (!pathsWithError?.value) return false
  return pathsWithError.value.includes(path)
}
</script>
