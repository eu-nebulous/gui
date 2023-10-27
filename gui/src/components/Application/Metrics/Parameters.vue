<template>
  <div class="flex flex-col space-y-5">
    <div class="flex items-center space-x-4">
      <p class="text-2xl">Parameters</p>
      <Lucide icon="PlusCircle" @click="addParameter" />
    </div>
    <ValidateEach
      v-for="(parameter, index) in parameters"
      :key="index"
      :state="parameter"
      :rules="parameterCollectionRules"
    >
      <template #default="{ v }">
        <div class="flex items-center">
          <div class="flex flex-row flex-grow border border-slate-200/60 dark:border-darkmode-400">
            <div class="basis-1/2 border-r p-1">
              <Input
                v-model="parameter.name"
                type="text"
                :class="{ 'input--invalid': v.name?.$error || hasBackendError(`parameter[${index}].name`) }"
              />
            </div>
            <div class="basis-1/2 p-1">
              <Select
                v-model="parameter.template"
                :class="{
                  'input--invalid': v.template?.$error || hasBackendError(`parameter[${index}].template`)
                }"
              >
                <option v-for="(template, templateOptionIndex) in templateNames" :key="templateOptionIndex">
                  {{ template }}
                </option>
              </Select>
            </div>
          </div>
          <div>
            <Lucide icon="Trash2" class="ml-3 text-danger w-8 h-8" @click="removeTemplate(index)" />
          </div>
        </div>
      </template>
    </ValidateEach>
  </div>
</template>
<script setup lang="ts">
import { computed, Ref, inject } from "vue"
import { ValidateEach } from "@vuelidate/components"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import { IParameter } from "@/interfaces/parameter.interface.ts"
import Input from "@/base-components/Form/FormInput.vue"
import Select from "@/base-components/Form/FormSelect.vue"
import { required } from "@vuelidate/validators"

interface TemplatesProps {
  parameters: Array<IParameter>
  templateNames: Array<string>
}

const pathsWithError = inject<Ref<Array<string>>>("pathsWithError")

const props = defineProps<TemplatesProps>()

const localParameters = computed(() => props.parameters)

const parameterCollectionRules = {
  name: { required },
  template: { required }
}

const addParameter = () => {
  localParameters.value.push({
    name: "",
    template: ""
  })
}

const removeTemplate = (index: number) => {
  localParameters.value.splice(index, 1)
}

const hasBackendError = (path: string) => {
  if (!pathsWithError?.value) return false
  return pathsWithError.value.includes(path)
}
</script>
