<template>
  <div class="flex flex-col space-y-5">
    <div class="flex items-center space-x-4">
      <p class="text-2xl">Templates</p>
      <Lucide icon="PlusCircle" @click="addTemplate" />
    </div>
    <div class="flex-grow overflow-x-auto">
      <Table class="min-w-full max-w-max w-max">
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="font-bold text-base w-1/5">ID</Table.Th>
            <Table.Th class="text-center text-base font-bold w-1/5">Type</Table.Th>
            <Table.Th class="text-center text-base font-bold w-1/5">Min</Table.Th>
            <Table.Th class="text-center text-base font-bold w-1/5">Max</Table.Th>
            <Table.Th class="text-center text-base font-bold w-1/5">Unit</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <ValidateEach
            v-for="(template, index) in localTemplates"
            :key="index"
            :state="template"
            :rules="templateCollectionRules"
          >
            <template #default="{ v }">
              <Table.Tr>
                <Table.Td>
                  <div>
                    <Input
                      v-model="template.id"
                      type="text"
                      :class="{ 'input--invalid': v.id?.$error || hasBackendError(`templates[${index}].id`) }"
                    />
                  </div>
                </Table.Td>
                <Table.Td>
                  <div>
                    <Select v-model="template.type">
                      <option value="int">Int</option>
                      <option value="double">Double</option>
                    </Select>
                  </div>
                </Table.Td>
                <Table.Td>
                  <div>
                    <Input
                      v-model="template.minValue"
                      type="number"
                      :class="{
                        'input--invalid': v.minValue?.$error || hasBackendError(`templates[${index}].minValue`)
                      }"
                    />
                  </div>
                </Table.Td>
                <Table.Td>
                  <div>
                    <Input
                      v-model="template.maxValue"
                      type="number"
                      :class="{
                        'input--invalid': v.maxValue?.$error || hasBackendError(`templates[${index}].maxValue`)
                      }"
                    />
                  </div>
                </Table.Td>
                <Table.Td>
                  <div>
                    <Input
                      v-model="template.unit"
                      type="text"
                      :class="{ 'input--invalid': v.unit?.$error || hasBackendError(`templates[${index}].unit`) }"
                    />
                  </div>
                </Table.Td>
                <Table.Td>
                  <Lucide icon="Trash2" class="text-danger w-8 h-8" @click="removeTemplate(index)" />
                </Table.Td>
              </Table.Tr>
            </template>
          </ValidateEach>
        </Table.Tbody>
      </Table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, Ref, inject } from "vue"
import { ValidateEach } from "@vuelidate/components"
import { required } from "@vuelidate/validators"
import { ITemplate } from "@/interfaces/template.interface.ts"
import Table from "@/base-components/Table"
import Input from "@/base-components/Form/FormInput.vue"
import Select from "@/base-components/Form/FormSelect.vue"
import Lucide from "@/base-components/Lucide/Lucide.vue"

interface TemplatesProps {
  templates: Array<ITemplate>
}

const pathsWithError = inject<Ref<Array<string>>>("pathsWithError")

const templateCollectionRules = {
  id: { required },
  type: { required },
  minValue: { required },
  maxValue: { required },
  unit: { required }
}

const props = defineProps<TemplatesProps>()

const localTemplates = computed(() => props.templates)

const hasBackendError = (path: string) => {
  if (!pathsWithError?.value) return false
  return pathsWithError.value.includes(path)
}

const addTemplate = () => {
  localTemplates.value.push({
    id: "",
    type: "int",
    minValue: 0,
    maxValue: 100,
    unit: "ms"
  })
}

const removeTemplate = (index: number) => {
  localTemplates.value.splice(index, 1)
}
</script>
