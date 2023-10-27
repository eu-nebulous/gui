<template>
  <div
    class="flex flex-col flex-grow space-y-6 2xl:space-y-0 2xl:grid 2xl:grid-cols-[minmax(0px,_1fr)_1fr] 2xl:space-x-8"
  >
    <MonacoEditor
      v-model="state.yamlValue"
      class="min-h-[400px]"
      language="yaml"
      id="yaml_editor"
      @change="debouncedYamlKeySubstringSearch"
      :class="{
        'input--invalid': v$.yamlValue?.$error || hasBackendError(`content.`)
      }"
    />
    <div class="flex flex-col">
      <div class="flex flex-col space-y-6 2xl:h-0 flex-grow overflow-y-auto">
        <div class="box p-5 flex flex-col">
          <div class="flex items-center mb-4">
            <span class="text-xl flex mr-5"> Keys </span>
            <Lucide icon="PlusCircle" @click="addVariable" />
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
                          <TomSelect
                            v-model="variable.name"
                            class="w-60"
                            :class="{
                              'input--invalid': v.name?.$error || hasBackendError(`variables[${index}].name`)
                            }"
                          >
                            <template v-if="autocompleteOptions.length">
                              <option v-if="!variable.name" value="">Please select key</option>
                              <option
                                v-for="(option, variableOptionIndex) in autocompleteOptions"
                                :key="variableOptionIndex"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </option>
                            </template>
                            <template v-else>
                              <option>No keys available</option>
                            </template>
                          </TomSelect>
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
                      <Lucide icon="Trash2" class="basis-20 text-danger" @click="removeVariable(index)" />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colspan="99" class="py-1 px-5 italic">
                      {{variable.name}}
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
            <Lucide icon="PlusCircle" @click="addEnvironment" />
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
                              'input--invalid': v.name?.$error || hasBackendError(`env[${index}].name`)
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
                            :type="env.secret ==true ? 'password' : 'text' "
                            :class="{
                              'input--invalid': v.value?.$error || hasBackendError(`env[${index}].value`)
                            }"
                          />
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td class="w-1/6">
                      <FormSwitch class="ml-auto w-auto">
                        <FormSwitch.Input id="env-{{index}}-secret" v-model="env.secret" type="checkbox" />
                      </FormSwitch>
                    </Table.Td>
                    <Table.Td class="w-1/6">
                      <Lucide icon="Trash2" class="basis-20 text-danger" @click="removeEnvironment(index)" />
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
import { computed, Ref, inject, reactive, ref } from "vue"
import STAGES from "@/components/Application/stages.ts"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import Input from "@/base-components/Form/FormInput.vue"
import { IVariable } from "@/interfaces/variables.interface.ts"
import {IEnvironment} from "@/interfaces/environment.interface.ts";
import { debounce } from "@/utils/helper.ts"
import { useApplicationStore } from "@/store/modules/application.ts"
import { helpers, required } from "@vuelidate/validators"
import { ValidateEach } from "@vuelidate/components"
import { useVuelidate } from "@vuelidate/core"
import MonacoEditor from "@/base-components/MonacoEditor/MonacoEditor.vue"
import Table from "@/base-components/Table"
import TomSelect from "@/base-components/TomSelect/TomSelect.vue"
import FormCheck from "@/base-components/Form/FormCheck/FormCheck.vue";
import {FormSwitch} from "@/base-components/Form";

interface DetailsProps {
  payload: {
    content: string
    variables: Array<IVariable>
    environmentVariables:Array<IEnvironment>
  }
}

const pathsWithError = inject<Ref<Array<string>>>("pathsWithError")
const props = withDefaults(defineProps<DetailsProps>(), {
  payload: () => ({
    content: "",
    variables: [{ name: "", lowerValue: 0, higherValue: 0 }],
    environmentVariables:[{name:"",value:"",secret:false}]
  })
})

const applicationStore = useApplicationStore()

const rules = computed(() => ({
  yamlValue: { required }
}))

const variablesCollectionRules = {
  name: { required },
  lowerValue: { required },
  higherValue: { required }
}

const environmentVariablesCollectionRules = {
  name: { required },
  value: { required }
}

const state = reactive({
  yamlValue: ref<string>(props.payload.content),
  variables: ref<Array<IVariable>>(props.payload.variables),
  environmentVariables: ref<Array<IEnvironment>>(props.payload.environmentVariables)
})

const autocompleteOptions = ref<Array<{ label: string; value: string }>>([])

const v$ = useVuelidate(rules, state, { $stopPropagation: true })

const hasBackendError = (path: string) => {
  if (!pathsWithError?.value) return false
  return pathsWithError.value.includes(path)
}

const addVariable = () => {
  state.variables.push({ name: "", lowerValue: 0, higherValue: 0 })
}

const removeVariable = (index: number) => {
  state.variables.splice(index, 1)
}

const addEnvironment = () => {
  console.log("Adding environment",state)
  state.environmentVariables.push({ name: "", value:"", secret:true })
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
  content: computed(() => state.yamlValue),
  componentV$: computed(() => v$)
})


</script>
