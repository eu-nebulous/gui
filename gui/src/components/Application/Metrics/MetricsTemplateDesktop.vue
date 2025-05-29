<template>
  <Table class="flex-grow p-5 overflow-x-auto">
    <Table.Thead>
      <Table.Tr>
        <Table.Th class="font-bold text-base w-1/4">Type</Table.Th>
        <Table.Th class="text-center text-base font-bold w-1/4">Name</Table.Th>
        <Table.Th class="text-center text-base font-bold w-1/4">Window</Table.Th>
        <Table.Th class="text-center text-base font-bold w-1/4">Output</Table.Th>
        <Table.Th></Table.Th>
      </Table.Tr>
    </Table.Thead>

    <Disclosure.Group :as="Table.Tbody" ref="metricsGroupRef">
      <ValidateEach
        v-for="(metric, index) in localMetrics"
        :key="index"
        :state="metric"
        :rules="getValidationRules(metric.type)"
      >
        <template #default="{ v }">
          <Disclosure as="template" :index="index">
            <Table.Tr>
              <!-- BEGIN: METRIC ITEM HEADER -->
              <Table.Td>
                <div class="h-auto text-left flex items-center justify-start">
                  <Select
                    class="capitalize"
                    :value="metric.type"
                    @change="metricTypeChangeHandler(index, $event as HTMLElementEvent<HTMLSelectElement>)"
                  >
                    <option>composite</option>
                    <option>raw</option>
                  </Select>
                </div>
              </Table.Td>
              <Table.Td>
                <div class="h-auto break-all text-ellipsis flex items-center justify-center">
                  <p class="break-all">{{ metric.name }}</p>
                </div>
              </Table.Td>
              <Table.Td>
                <div class="h-auto break-all text-ellipsis flex items-center justify-center">
                  <p>
                    {{ getInputValue(metric) }}
                  </p>
                </div>
              </Table.Td>
              <Table.Td>
                <div class="h-auto flex items-center justify-center">
                  <p>
                    {{ getOutputValue(metric) }}
                  </p>
                </div>
              </Table.Td>
              <Table.Td>
                <div class="space-x-2 min-w-[100px] items-center h-full flex justify-center">
                  <Disclosure.Button class="w-auto">
                    <ArrowDown
                      class="w-8 h-8 transition-transform duration-1000"
                      :class="selectedAccordionIndex === index ? 'rotate-180' : 'rotate-0'"
                    />
                  </Disclosure.Button>
                  <Lucide icon="Trash2" class="text-danger w-8 h-8" @click="removeMetric(index)" />
                </div>
              </Table.Td>
            </Table.Tr>
            <!-- END: METRIC ITEM HEADER -->

            <!-- BEGIN: ACCORDION -->
            <Table.Tr>
              <Table.Td colspan="6" class="p-0 border-0">
                <Disclosure.Panel class="border-b border-slate-600 dark:border-darkmode-300">
                  <!-- BEGIN: METRIC COMPOSITE -->
                  <div v-if="isCompositeMetric(metric)" class="grid grid-cols-[minmax(0px,_1fr)_1fr] gap-5 px-10 py-6">
                    <div class="flex flex-col space-y-2">
                      <div class="flex flex-col">
                        <Label>Name</Label>
                        <Input
                          type="text"
                          v-model="metric.name"
                          :class="{ 'input--invalid': v.name?.$error || hasBackendError(`metrics[${index}].name`) }"
                        />
                      </div>

                      <div class="flex flex-col">
                        <Label>Level</Label>
                        <Select
                          v-model="metric.level"
                          @change="emit('levelChangeHandler', index, $event as HTMLElementEvent<HTMLSelectElement>)"
                          :class="{
                            'input--invalid': v.level?.$error || hasBackendError(`metrics[${index}].level`)
                          }"
                        >
                          <option value="global">Global</option>
                          <option value="components">Components</option>
                        </Select>
                      </div>
                      <div class="flex flex-col flex-grow">
                        <Label>Template</Label>
                        <Select
                            v-model="metric.template"
                            :class="{
                              'input--invalid': v.template?.$error || hasBackendError(`metrics[${index}].template`)
                            }"
                        >
                          <option v-for="(template, templateOptionIndex) in templateNames" :key="templateOptionIndex">
                            {{ template }}
                          </option>
                        </Select>
                      </div>

                      <div v-if="metric.level === 'components' && metric.components" class="flex flex-col">
                        <Label>Components</Label>

                        <VueSelect
                            v-model="metric.components"
                            class="w-full"
                            :is-multi="true"
                            :class="{
                            'input--invalid': v.components?.$error || hasBackendError(`metrics[${index}].components`)
                            }"
                            :options="componentList"
                        />

                      </div>

                    </div>

                    <div class="flex flex-col">
                      <Label>Formula</Label>
                      <MonacoEditor
                        v-model="metric.formula"
                        class="h-40"
                        language="math"
                        :destroyDelay="1000"
                        :class="{ 'input--invalid': v.formula?.$error || hasBackendError(`metrics[${index}].formula`) }"
                      />
                    </div>

                    <div class="flex flex-col">
                      <FormCheck class="mb-2">
                        <FormCheck.Input
                          class="border"
                          type="checkbox"
                          id="windowInput"
                          v-model="metric.isWindowInput"
                        />
                        <FormCheck.Label class="font-bold" for="windowInput">Input Intervals</FormCheck.Label>
                      </FormCheck>
                      <div v-if="metric.isWindowInput && metric.input" class="flex space-x-3">
                        <div class="flex flex-col flex-grow">
                          <Label>Type</Label>
                          <Select
                            class="w-auto capitalize"
                            v-model="metric.input.type"
                            :class="{ 'input--invalid': hasBackendError(`metrics[${index}].input.type`) }"
                          >
                            <option v-for="(option, behaviorIndex) in BEHAVIOR_OPTIONS_INPUT" :key="behaviorIndex">
                              {{ option }}
                            </option>
                          </Select>
                        </div>
                        <div class="flex flex-col flex-grow">
                          <Label>Interval</Label>
                          <Input
                            type="number"
                            v-model="metric.input.interval"
                            :class="{ 'input--invalid': hasBackendError(`metrics[${index}].input.interval`) }"
                          />
                        </div>
                        <div class="flex flex-col flex-grow">
                          <Label>Unit</Label>
                          <Select
                            class="w-auto capitalize"
                            v-model="metric.input.unit"
                            :class="{ 'input--invalid': hasBackendError(`metrics[${index}].input.unit`) }"
                          >
                            <option v-for="(option, timeUnitIndex) in UNIT_TIME_OPTIONS" :key="timeUnitIndex">
                              {{ option }}
                            </option>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col">
                      <FormCheck class="mb-2">
                        <FormCheck.Input
                          class="border"
                          type="checkbox"
                          id="windowOutput"
                          v-model="metric.isWindowOutput"
                        />
                        <FormCheck.Label class="font-bold" for="windowOutput">Output Intervals</FormCheck.Label>
                      </FormCheck>
                      <div v-if="metric.isWindowOutput && metric.output" class="flex flex-col">
                        <div class="flex space-x-3">
                          <div class="flex flex-col flex-grow">
                            <Label>Type</Label>
                            <Select
                              class="w-auto capitalize"
                              v-model="metric.output.type"
                              :class="{ 'input--invalid': hasBackendError(`metrics[${index}].output.type`) }"
                            >
                              <option v-for="(option, behaviorIndex) in BEHAVIOR_OPTIONS_OUTPUT" :key="behaviorIndex">
                                {{ option }}
                              </option>
                            </Select>
                          </div>
                          <div class="flex flex-col flex-grow">
                            <Label>Interval</Label>
                            <Input
                              type="number"
                              v-model="metric.output.interval"
                              :class="{ 'input--invalid': hasBackendError(`metrics[${index}].output.interval`) }"
                            />
                          </div>
                          <div class="flex flex-col flex-grow">
                            <Label>Unit</Label>
                            <Select
                              class="w-auto capitalize"
                              v-model="metric.output.unit"
                              :class="{ 'input--invalid': hasBackendError(`metrics[${index}].output.unit`) }"
                            >
                              <option v-for="(option, timeUnitIndex) in UNIT_TIME_OPTIONS" :key="timeUnitIndex">
                                {{ option }}
                              </option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- END: METRIC COMPOSITE -->
                  <!-- BEGIN: METRIC RAW -->
                  <div v-else-if="isRawMetric(metric)" class="px-10 py-6 space-y-5">
                    <div class="flex space-x-3">
                      <div class="flex flex-col flex-grow">
                        <Label>Name</Label>
                        <Input
                          type="text"
                          v-model="metric.name"
                          :class="{ 'input--invalid': v.name?.$error || hasBackendError(`metrics[${index}].name`) }"
                        />
                      </div>

                      <div class="flex flex-col flex-grow">
                        <Label>Sensor</Label>
                        <Input
                          type="text"
                          v-model="metric.sensor"
                          :class="{ 'input--invalid': hasBackendError(`metrics[${index}].sensor`) }"
                        />
                      </div>
                    </div>

                    <div class="flex items-center">
                      <span class="text-xl flex mr-5"> Config </span>
                      <Lucide icon="PlusCircle" @click="addSetting(metric)" />
                    </div>
                    <div v-for="(setting, settingIndex) in metric.config" :key="settingIndex" class="flex items-center">
                      <div class="flex flex-row flex-grow border border-slate-200/60 dark:border-darkmode-400">
                        <div class="basis-1/2 border-r p-1">
                          <Input
                            v-model="setting.name"
                            type="text"
                            :class="{
                              'input--invalid': hasBackendError(`metrics[${index}].config[${settingIndex}].name`)
                            }"
                          />
                        </div>
                        <div class="basis-1/2 p-1">
                          <Input
                            v-model="setting.value"
                            type="text"
                            :class="{
                              'input--invalid': hasBackendError(`metrics[${index}].config[${settingIndex}].value`)
                            }"
                          />
                        </div>
                      </div>
                      <Lucide icon="Trash2" class="ml-3 text-danger" @click="removeSetting(metric, settingIndex)" />
                    </div>

                    <div class="flex flex-col">
                      <div class="flex flex-col">
                        <Label>Level</Label>
                        <Select
                            v-model="metric.level"
                            @change="emit('levelChangeHandler', index, $event as HTMLElementEvent<HTMLSelectElement>)"
                            :class="{
                            'input--invalid': v.level?.$error || hasBackendError(`metrics[${index}].level`)
                          }"
                        >
                          <option value="global">Global</option>
                          <option value="components">Components</option>
                        </Select>
                      </div>

                      <div v-if="metric.level === 'components' && metric.components" class="flex flex-col">
                        <Label>Components</Label>
                        <VueSelect
                            v-model="metric.components"
                            :is-multi="true"
                            class="w-full"
                            :class="{
                            'input--invalid': v.components?.$error || hasBackendError(`metrics[${index}].components`)
                            }"
                            :options="componentList"
                        />

                      </div>
                    </div>

                    <div class="flex flex-col">
                      <FormCheck class="mb-2">
                        <FormCheck.Input
                          class="border"
                          type="checkbox"
                          id="windowOutputRaw"
                          v-model="metric.isWindowOutputRaw"
                        />
                        <FormCheck.Label class="font-bold" for="windowOutputRaw">Output Intervals</FormCheck.Label>
                      </FormCheck>
                      <div v-if="metric.isWindowOutputRaw && metric.outputRaw" class="flex flex-col">
                        <div class="flex space-x-3">
                          <div class="flex flex-col flex-grow">
                            <Label>Type</Label>
                            <Select
                              class="w-auto capitalize"
                              v-model="metric.outputRaw.type"
                              :class="{ 'input--invalid': hasBackendError(`metrics[${index}].output.type`) }"
                            >
                              <option v-for="(option, behaviorIndex) in BEHAVIOR_RAW_OPTIONS" :key="behaviorIndex">
                                {{ option }}
                              </option>
                            </Select>
                          </div>
                          <div class="flex flex-col flex-grow">
                            <Label>Interval</Label>
                            <Input
                              type="number"
                              v-model="metric.outputRaw.interval"
                              :class="{ 'input--invalid': hasBackendError(`metrics[${index}].output.interval`) }"
                            />
                          </div>
                          <div class="flex flex-col flex-grow">
                            <Label>Unit</Label>
                            <Select
                              class="w-auto capitalize"
                              v-model="metric.outputRaw.unit"
                              :class="{ 'input--invalid': hasBackendError(`metrics[${index}].output.unit`) }"
                            >
                              <option v-for="(option, timeUnitIndex) in UNIT_TIME_OPTIONS" :key="timeUnitIndex">
                                {{ option }}
                              </option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- END: METRIC RAW -->
                </Disclosure.Panel>
              </Table.Td>
            </Table.Tr>
            <!-- END: ACCORDION -->
          </Disclosure>
        </template>
      </ValidateEach>
    </Disclosure.Group>
  </Table>
</template>

<script setup lang="ts">
import {computed, inject, Ref, ref} from "vue"
import {useMetrics} from "@/components/Application/Metrics/MetricsComposable.ts"
import {Disclosure} from "@/base-components/Headless"
import {ValidateEach} from "@vuelidate/components"
import {FormCheck} from "@/base-components/Form"
import {IMetricComposite, IMetricRaw} from "@/interfaces/metrics.interface.ts"
import {BEHAVIOR_OPTIONS, BEHAVIOR_OPTIONS_INPUT, BEHAVIOR_OPTIONS_OUTPUT, UNIT_TIME_OPTIONS} from "@/constants"
import Select from "@/base-components/Form/FormSelect.vue"
import Label from "@/base-components/Form/FormLabel.vue"
import Input from "@/base-components/Form/FormInput.vue"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import ArrowDown from "@/assets/svg/ArrowDown.svg"
import Table from "@/base-components/Table"
import MonacoEditor from "@/base-components/MonacoEditor/MonacoEditor.vue"
import VueSelect from "vue3-select-component";
import {BEHAVIOR_RAW_OPTIONS} from "../../../constants";

const pathsWithError = inject<Ref<Array<string>>>("pathsWithError")

const emit = defineEmits<{
  (e: "levelChangeHandler", index: number, event: HTMLElementEvent<HTMLSelectElement>): void
}>()
const props = defineProps<{
  metrics: Array<IMetricComposite | IMetricRaw>
  componentList: Array<{ label: string; value: string }>,
  templateNames: Array<string>
}>()


const {
  localMetrics,
  getValidationRules,
  removeMetric,
  addSetting,
  removeSetting,
  isCompositeMetric,
  isRawMetric,
  getInputValue,
  getOutputValue,
  metricTypeChangeHandler
} = useMetrics(props.metrics)

const metricsGroupRef = ref()

const selectedAccordionIndex = computed(() => {
  return metricsGroupRef.value?.selectedIndex
})

// TODO: Move this all func duplicates to helpers
const hasBackendError = (path: string) => {
  if (!pathsWithError?.value) return false
  return pathsWithError.value.includes(path)
}
</script>
