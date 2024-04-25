<template>
  <div class="flex flex-col flex-grow space-y-6">
    <p class="text-2xl">Expression Editor</p>
    <div class="flex flex-col sm:flex-row flex-grow mt-4 sm:space-x-14 space-y-6 sm:space-y-0">
      <!-- BEGIN: SIDE INFO -->
      <div class="flex flex-col basis-1/4 space-y-6">
        <div class="flex flex-col">
          <p class="text-lg mb-6">Metrics</p>
          <div class="box p-5">
            <Table bordered hover>
              <Table.Tbody>
                <Table.Tr v-for="(metric, index) in props.payload.metrics" :key="index">
                  <Table.Td class="break-all">{{ metric }}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </div>
        <div class="flex flex-col">
          <p class="text-lg mb-6">Variables</p>
          <div class="box p-5">
            <Table bordered hover>
              <Table.Tbody>
                <Table.Tr v-for="(variable, index) in props.payload.variables" :key="index">
                  <Table.Td class="break-all">{{ variable }}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
      <!-- END: SIDE INFO -->

      <!-- BEGIN: EDITOR -->
      <div class="flex flex-col basis-3/4 space-y-6 flex-grow">
        <div class="flex items-center space-x-4">
          <p class="text-lg">Utility Functions</p>
          <Lucide icon="PlusCircle" @click="addFunction" />
        </div>

        <div class="space-y-6 flex-grow">
          <ValidateEach
            v-for="(utilityFunction, index) in utilityFunctions"
            :key="index"
            :state="utilityFunction"
            :rules="utilitiesCollectionRules"
          >
            <template #default="{ v }">
              <div class="box p-5">
                <div class="flex space-x-4 items-center">
                  <FormInput
                    type="text"
                    class="basis-1/2"
                    v-model="utilityFunction.functionName"
                    :class="{
                      'input--invalid':
                        v.functionName.$error || hasBackendError(`utilityFunctions[${index}].functionName`)
                    }"
                  />
                  <FormSelect
                    class="capitalize basis-1/2"
                    v-model="utilityFunction.functionType"
                    :class="{
                      'input--invalid':
                        v.functionType.$error || hasBackendError(`utilityFunctions[${index}].functionType`)
                    }"
                  >
                    <option value="maximize">Maximize Utility</option>
                    <option value="minimize">Minimize Utility</option>
                    <option value="constant">Constant</option>
                  </FormSelect>
                  <Lucide icon="Trash2" class="w-10 text-danger" @click="removeFunction(index)" />
                </div>
                <MonacoEditor
                  v-model="utilityFunction.functionExpression"
                  id="expression_editor"
                  class="h-56 mt-5"
                  language="math"
                  @change="debouncedMathExpressionParser(index)"
                  :class="{
                    'input--invalid':
                      v.functionExpression.$error || hasBackendError(`utilityFunctions[${index}].functionExpression`)
                  }"
                />
                <!-- TODO: BIND LOGIC WITH TEXT AREA, PROVIDE DYNAMIC OPTIONS -->
                <div class="mt-5">
                  <FormInline
                    class="flex-col items-center pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0"
                    v-for="(expVariable, expVariableIndex) in utilityFunction.functionExpressionVariables"
                    :key="expVariableIndex"
                  >
                    <FormLabel class="xl:!mr-10">
                      <p class="text-left font-medium text-md">
                        {{ expVariable.nameVariable }}
                      </p>
                    </FormLabel>
                    <div class="flex-1 w-full mt-3 xl:mt-0">
                      <FormSelect
                        v-model="expVariable.valueVariable"
                        :class="{
                          'input--invalid': hasBackendError(
                            `utilityFunctions[${index}].functionExpressionVariables.${expVariableIndex}.valueVariable`
                          )
                        }"
                      >
                        <option v-for="(variableOption, optionIndex) in composedVariables" :key="optionIndex">
                          {{ variableOption }}
                        </option>
                      </FormSelect>
                    </div>
                  </FormInline>
                </div>
              </div>
            </template>
          </ValidateEach>
        </div>

        <!-- END: EDITOR -->
      </div>
      <!-- END: EDITOR -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject, Ref, onDeactivated, reactive, onActivated } from "vue"
import _ from "lodash"
import { debounce } from "@/utils/helper.ts"
import { useApplicationStore } from "@/store/modules/application.ts"
import { ValidateEach } from "@vuelidate/components"
import { required } from "@vuelidate/validators"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import Table from "@/base-components/Table"
import { FormInline, FormInput, FormSelect, FormLabel } from "@/base-components/Form"
import { IUtilityFunction } from "@/interfaces/utilityFunctions.interface.ts"
import MonacoEditor from "@/base-components/MonacoEditor/MonacoEditor.vue"
import STAGES from "@/components/Application/stages.ts"
import { useVuelidate, Validation } from "@vuelidate/core"

interface ExpressionEditorProps {
  payload: {
    metrics: Array<string>
    variables: Array<string>
    utilityFunctions: Array<IUtilityFunction>
  }
}

const pathsWithError = inject<Ref<Array<string>>>("pathsWithError")

const props = withDefaults(defineProps<ExpressionEditorProps>(), {
  payload: () => ({
    metrics: [],
    variables: [],
    utilityFunctions: [
      {
        functionName: "",
        functionType: "maximize",
        functionExpression: "",
        functionExpressionVariables: []
      }
    ]
  })
})

const applicationStore = useApplicationStore()

const utilityFunctions = ref<Array<IUtilityFunction>>(_.cloneDeep(props.payload.utilityFunctions))

const utilitiesCollectionRules = {
  functionName: { required },
  functionType: { required },
  functionExpression: { required }
}

const composedVariables = computed(() =>
  Array.prototype.concat(
    props.payload.metrics,
    props.payload.variables,
    utilityFunctions.value.map((utility) => utility.functionName)
  )
)
const addFunction = () => {
  utilityFunctions.value.push({
    functionName: "",
    functionType: "constant",
    functionExpression: "",
    functionExpressionVariables: []
  })
}

const removeFunction = (index: number) => {
  utilityFunctions.value.splice(index, 1)
}

const debouncedMathExpressionParser = debounce<number>(async (utilityIndex: number) => {
  const data = await applicationStore.invokeMathParsing(utilityFunctions.value[utilityIndex].functionExpression)
  if (data && Array.isArray(data.variables))
    utilityFunctions.value[utilityIndex].functionExpressionVariables =
      data.variables.map((variable) => ({ nameVariable: variable, valueVariable: "" })) || []
}, 500)

const hasBackendError = (path: string) => {
  if (!pathsWithError?.value) return false
  return pathsWithError.value.includes(path)
}

const v$ = useVuelidate({ $stopPropagation: true })

defineExpose({ componentV$: computed(() => v$), utilityFunctions })
</script>
