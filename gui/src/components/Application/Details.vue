<template>
  <div
      class="flex flex-col flex-grow space-y-6 2xl:space-y-0 2xl:grid 2xl:grid-cols-[minmax(0px,_1fr)_1fr] 2xl:space-x-8"
  >

    <div class="flex flex-col gap-y-3">
      <Button @click="toggleAi"
              :variant="generateAi ? 'primary' : 'secondary'"  >
        <span class="me-3">AI</span>
        <Lucide icon="Sparkles" class="w-5 h-5 mr-2" v-if="!loadingAi"/>
        <LoadingIcon icon="circles"  v-if="loadingAi"/>
      </Button>

      <transition name="expand">
        <div class="flex flex-col gap-y-3" v-if="generateAi">
          <div class="flex flex-row">
            <h3 class="flex-grow font-bold ">Describe you application
            </h3>
            <span class="h-3">

            </span>
          </div>

          <FormTextarea
              rows="10"
              class="mb-10"
              v-model="aiPrompt"
              :class="{
                'input--invalid': aiError
              }"
          />
        </div>
      </transition>
      <MonacoEditor
          id="yaml_editor"
          v-model="state.yamlValue"
          class="min-h-[200px]"
          language="yaml"
          @change="debouncedYamlKeySubstringSearch"
          :class="{
          'input--invalid': v$.yamlValue?.$error || hasBackendError(`content.`)
        }"
      />
    </div>
    <div class="flex flex-col">
      <div class="flex flex-col space-y-6 2xl:h-0 flex-grow overflow-y-auto">
        <div class="box p-5 flex flex-col">
          <div class="flex items-center mb-4">
            <span class="text-xl flex mr-5"> Keys </span>
            <Lucide icon="PlusCircle" @click="addVariable"/>
          </div>

          <Table class="min-w-full max-w-max w-max" bordered hover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th class="border-0 font-bold text-base"> Name</Table.Th>
                <Table.Th class="border-0 font-bold text-base"> Values</Table.Th>
                <Table.Th class="border-0"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <ValidateEach
                  v-for="(variable, index) in state.variables"
                  :key="index"
                  :state="variable"
                  :rules="variablesCollectionRules"
              >
                <template #default="{ v }">
                  <Table.Tr>
                    <Table.Td class="w-1/3">
                      <div class="flex flex-col">
                        <div>
                          <VueSelect
                              v-model="variable.name"
                              class="w-60"
                              :class="{
                              'input--invalid': v.name?.$error || hasBackendError(`variables[${index}].name`)
                            }"
                              :options="autocompleteOptions"

                          />
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td class="w-80">
                      <div class="flex space-x-4">
                        <Input
                            v-model="variable.lowerValue"
                            type="number"
                            :class="{
                            'input--invalid': v.lowerValue?.$error || hasBackendError(`variables[${index}].lowerValue`)
                          }"
                        />
                        <Input
                            v-model="variable.higherValue"
                            type="number"
                            :class="{
                            'input--invalid':
                              v.higherValue?.$error || hasBackendError(`variables[${index}].higherValue`)
                          }"
                        />
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Lucide icon="Trash2" class="basis-20 text-danger" @click="removeVariable(index)"/>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colspan="99" class="py-1 px-5 italic">
                      {{ variable.name }}
                    </Table.Td>
                  </Table.Tr>

                </template>
              </ValidateEach>
            </Table.Tbody>
          </Table>
        </div>
      </div>
      <div class="flex flex-col space-y-6 2xl:h-0 flex-grow overflow-y-auto">
        <div class="box p-5 flex flex-col">
          <div class="flex items-center mb-4">
            <span class="text-xl flex mr-5"> Environment </span>
            <Lucide icon="PlusCircle" @click="addEnvironment"/>
          </div>
          <Table class="min-w-full max-w-max w-max" bordered hover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th class="border-0 font-bold text-base"> Name</Table.Th>
                <Table.Th class="border-0 font-bold text-base"> Values</Table.Th>
                <Table.Th class="border-0 font-bold text-base"> Secret</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <ValidateEach
                  v-for="(env, index) in state.environmentVariables"
                  :key="index"
                  :state="env"
                  :rules="environmentVariablesCollectionRules"
              >
                <template #default="{ v }">
                  <Table.Tr>
                    <Table.Td class="w-2/6">
                      <div class="flex flex-col">
                        <div class="flex space-x-4">
                          <Input
                              v-model="env.name"
                              type="text"
                              :class="{
                              'input--invalid': v.name?.$error || hasBackendError(`environmentVariables[${index}].name`)
                            }"
                          />
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td class="w-2/6">
                      <div class="flex flex-col">
                        <div class="flex space-x-4">
                          <Input
                              v-model="env.value"
                              :type="env.secret ? 'password' : 'text'"
                              :class="{
                              'input--invalid': v.value?.$error || hasBackendError(`environmentVariables[${index}].value`)
                            }"
                          />
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td class="w-1/6">
                      <FormSwitch class="ml-auto w-auto">
                        <FormSwitch.Input id="env-{{String(index)}}-secret" v-model="env.secret" type="checkbox"
                                          :class="{
                              'input--invalid': v.value?.$error || hasBackendError(`environmentVariables[${index}].secret`)
                            }"
                        />
                      </FormSwitch>
                    </Table.Td>
                    <Table.Td class="w-1/6">
                      <Lucide icon="Trash2" class="basis-20 text-danger" @click="removeEnvironment(index)"/>
                    </Table.Td>
                  </Table.Tr>
                </template>
              </ValidateEach>
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, reactive, Ref, ref, watch} from "vue"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import Input from "@/base-components/Form/FormInput.vue"
import {IVariable} from "@/interfaces/variables.interface.ts"
import {IEnvironment} from "@/interfaces/environment.interface.ts";
import {debounce} from "@/utils/helper.ts"
import {useApplicationStore} from "@/store/modules/application.ts"
import {required} from "@vuelidate/validators"
import {ValidateEach} from "@vuelidate/components"
import {useVuelidate} from "@vuelidate/core"
import MonacoEditor from "@/base-components/MonacoEditor/MonacoEditor.vue"
import Table from "@/base-components/Table"
import {FormSwitch, FormTextarea} from "@/base-components/Form";
import VueSelect from "vue3-select-component";
import Button from "@/base-components/Button";
import LoadingIcon from "@/base-components/LoadingIcon";

interface DetailsProps {
  payload: {
    content: string
    variables: Array<IVariable>
    environmentVariables: Array<IEnvironment>
  }
}
const pathsWithError = inject<Ref<Array<string>>>("pathsWithError")
const props = withDefaults(defineProps<DetailsProps>(), {
  payload: () => ({
    content: "",
    variables: [{name: "", lowerValue: 0, higherValue: 0}],
    environmentVariables: [{name: "", value: "", secret: false}]
  })
})

const applicationStore = useApplicationStore()

const rules = computed(() => ({
  yamlValue: {required}
}))

const variablesCollectionRules = {
  name: {required},
  lowerValue: {required},
  higherValue: {required}
}

const environmentVariablesCollectionRules = {
  name: {required},
  value: {required}
}

const state = reactive({
  yamlValue: props.payload.content,
  variables: props.payload.variables,
  environmentVariables: props.payload.environmentVariables
})

const autocompleteOptions = ref<Array<{ label: string; value: string }>>([])

const v$ = useVuelidate(rules, state, {$stopPropagation: true})



const generateAi = ref(false)
const loadingAi = ref(false)
const aiError = ref(false)
const aiPrompt = ref('')
const toggleAi = () => {
  generateAi.value = !generateAi.value
}
const generateKubevela = async () => {
  loadingAi.value = true
  if (aiPrompt.value.length > 0) {
    const response  = await applicationStore.invoiceGenerateKubevela(aiPrompt.value)
    aiError.value = !response.success
    state.yamlValue = response.answer
  } else {
    aiError.value = true
    state.yamlValue = ''
  }
  console.log("Generate Kubevela ",aiPrompt.value,aiPrompt.value.length, state.yamlValue)
  loadingAi.value = false
}

watch(aiPrompt,debounce(generateKubevela,300))


const hasBackendError = (path: string) => {
  if (!pathsWithError?.value) return false
  return pathsWithError.value.includes(path)
}

const addVariable = () => {
  state.variables.push({name: "", lowerValue: 0, higherValue: 0})
}

const removeVariable = (index: number) => {
  state.variables.splice(index, 1)
}

const addEnvironment = () => {
  console.log("Adding environment", state)
  state.environmentVariables.push({name: "", value: "", secret: false})
}

const removeEnvironment = (index: number) => {
  state.environmentVariables.splice(index, 1)
}

const queryParsedOptionsList = async () => {
  autocompleteOptions.value = await applicationStore.invokeYamlParsing(state.yamlValue, "")
}

const debouncedYamlKeySubstringSearch = debounce(queryParsedOptionsList, 1000)
queryParsedOptionsList()

defineExpose({
  variables: computed(() => state.variables),
  environmentVariables: computed(() => state.environmentVariables),
  content: computed(() => state.yamlValue),
  componentV$: computed(() => v$)
})


</script>
<style>

:root {
  --vs-input-bg: theme("colors.slate.800");
  --vs-input-outline: theme("colors.slate.800");
  --vs-input-placeholder-color: theme("colors.darkmode.600");

  --vs-padding: 0.25rem 0.5rem;
  --vs-border: theme("colors.darkmode.800");
  --vs-border-radius: theme("borderRadius.DEFAULT");
  --vs-font-size: inherit;
  --vs-font-weight: theme("fontWeight.medium");
  --vs-font-family: inherit;
  --vs-text-color: inherit;
  --vs-line-height: 1.5;

  --vs-menu-offset-top: 8px;
  --vs-menu-height: 200px;
  --vs-menu-padding: 0;
  --vs-menu-border: theme("colors.darkmode.800");
  --vs-menu-bg: theme("colors.darkmode.700");
  --vs-menu-box-shadow: none;
  --vs-menu-z-index: 2;

  --vs-option-padding: 8px 12px;
  --vs-option-font-size: var(--vs-font-size);
  --vs-option-font-weight: var(--vs-font-weight);
  --vs-option-text-color: var(--vs-text-color);
  --vs-option-bg: var(--vs-menu-bg);
  --vs-option-hover-color: theme("colors.darkmode.400");
  --vs-option-focused-color: var(--vs-option-hover-color);
  --vs-option-selected-color: theme("colors.darkmode.600");
  --vs-option-disabled-color: theme("colors.darkmode.600");
  --vs-option-disabled-text-color: theme("colors.slate.100");

  --vs-multi-value-gap: 4px;
  --vs-multi-value-padding: 4px;
  --vs-multi-value-font-size: 14px;
  --vs-multi-value-font-weight: 400;
  --vs-multi-value-line-height: 1;
  --vs-multi-value-text-color: inherit;
  --vs-multi-value-bg: theme("colors.darkmode.800");
  --vs-multi-value-xmark-size: 16px;
  --vs-multi-value-xmark-color: theme("colors.slate.100");

  --vs-indicators-gap: 4px;
  --vs-icon-size: 20px;
  --vs-icon-color: var(--vs-text-color);

  --vs-dropdown-transition: transform 0.25s ease-out;
}

</style>
