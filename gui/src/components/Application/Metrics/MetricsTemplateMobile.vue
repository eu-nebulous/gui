<template>
  <Disclosure.Group class="flex-grow flex flex-col space-y-6">
    <ValidateEach
      v-for="(metric, index) in localMetrics"
      :key="index"
      :state="metric"
      :rules="getValidationRules(metric.type)"
    >
      <template #default="{ v }">
        <div
          v-for="(metric, index) in localMetrics"
          :key="index"
          class="grid-area box p-5 overflow-x-auto overflow-y-hidden gap-6"
        >
          <div class="header-area flex flex-col space-y-6">
            <div class="flex items-center text-base font-bold">Type</div>
            <div class="flex items-center text-base font-bold">Name</div>
            <div class="flex items-center text-base font-bold">Window</div>
            <div class="flex items-center text-base font-bold">Output</div>
            <div></div>
          </div>

          <Disclosure as="template" :index="index">
            <!-- BEGIN: METRIC ITEM HEADER -->
            <div class="disclosure-area flex flex-col space-y-6">
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
              <div class="h-auto break-all text-ellipsis flex items-center">
                <p class="break-all">{{ metric.name }}</p>
              </div>
              <div class="h-auto break-all text-ellipsis flex items-center">
                <p>
                  {{ getInputValue(metric) }}
                </p>
              </div>
              <div class="h-auto flex items-center">
                <p>
                  {{ getOutputValue(metric) }}
                </p>
              </div>
              <div class="space-x-2 min-w-[100px] items-center h-full flex justify-center">
                <div>
                  <Lucide icon="Trash2" class="w-10 h-10 text-danger" @click="removeMetric(index)" />
                </div>
                <Disclosure.Button class="w-auto">
                  <ArrowDown class="w-10 h-10" />
                </Disclosure.Button>
              </div>
            </div>
            <!-- END: METRIC ITEM HEADER -->

            <!-- BEGIN: ACCORDION -->
            <Disclosure.Panel class="panel-area leading-relaxed">
              <!-- BEGIN: METRIC COMPOSITE -->
              <div v-if="isCompositeMetric(metric)" class="py-3 space-y-5">
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

                <div v-if="metric.level === 'components' && metric.components" class="flex flex-col">
                  <Label>Components</Label>
                  <TomSelect
                    v-model="metric.components"
                    class="w-full"
                    multiple
                    :class="{
                      'input--invalid': v.components?.$error || hasBackendError(`metrics[${index}].components`)
                    }"
                  >
                    <template v-if="componentList.length">
                      <option
                        v-for="(option, componentOptionIndex) in componentList"
                        :key="componentOptionIndex"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </template>
                    <template v-else> <option>No keys available</option> </template>
                  </TomSelect>
                </div>

                <div class="flex flex-col">
                  <Label>Formula</Label>
                  <Textarea
                    v-model="metric.formula"
                    class="resize-none"
                    :class="{ 'input--invalid': v.formula?.$error || hasBackendError(`metrics[${index}].formula`) }"
                  />
                </div>

                <FormCheck>
                  <FormCheck.Input class="border" type="checkbox" v-model="metric.isWindowInput" id="windowInput" />
                  <FormCheck.Label class="font-bold" for="windowInput">Window Input</FormCheck.Label>
                </FormCheck>

                <div v-if="metric.isWindowInput" class="flex flex-col">
                  <div v-if="metric.input" class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div class="flex flex-col flex-grow">
                      <Label>Type</Label>
                      <Select
                        class="w-auto capitalize"
                        v-model="metric.input.type"
                        :class="{ 'input--invalid': hasBackendError(`metrics[${index}].input.type`) }"
                      >
                        <option v-for="(option, behaviorIndex) in BEHAVIOR_OPTIONS" :key="behaviorIndex">
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

                <FormCheck>
                  <FormCheck.Input class="border" type="checkbox" id="windowOutput" v-model="metric.isWindowOutput" />
                  <FormCheck.Label class="font-bold" for="windowOutput">Window Output </FormCheck.Label>
                </FormCheck>

                <div v-if="metric.isWindowOutput" class="flex flex-col">
                  <div v-if="metric.output" class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div class="flex flex-col flex-grow">
                      <Label>Type</Label>
                      <Select
                        class="w-auto capitalize"
                        v-model="metric.output.type"
                        :class="{ 'input--invalid': hasBackendError(`metrics[${index}].output.type`) }"
                      >
                        <option v-for="(option, behaviorIndex) in BEHAVIOR_OPTIONS" :key="behaviorIndex">
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
              <!-- END: METRIC COMPOSITE -->
              <!-- BEGIN: METRIC RAW -->
              <div v-else-if="isRawMetric(metric)" class="py-3 space-y-5">
                <div class="flex flex-col">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    v-model="metric.name"
                    :class="{
                      'input--invalid': hasBackendError(`metrics[${index}].name`)
                    }"
                  />
                </div>

                <div class="flex flex-col">
                  <Label>Sensor</Label>
                  <Input
                    type="text"
                    v-model="metric.sensor"
                    :class="{
                      'input--invalid': hasBackendError(`metrics[${index}].sensor`)
                    }"
                  />
                </div>

                <div class="flex items-center">
                  <span class="text-xl flex mr-5"> Config </span>
                  <Lucide icon="PlusCircle" @click="addSetting(metric)" />
                </div>

                <div v-for="(setting, settingIndex) in metric.config" :key="settingIndex" class="flex items-center">
                  <div class="flex flex-col flex-grow border border-slate-200/60 dark:border-darkmode-400">
                    <div class="basis-1/2 border-r p-1">
                      <Input
                        v-model="setting.name"
                        type="text"
                        :class="{
                          'input--invalid': hasBackendError(`metrics[${index}].config[${settingIndex}.name`)
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
                  <FormCheck class="mb-2">
                    <FormCheck.Input
                      class="border"
                      type="checkbox"
                      id="windowOutputRaw"
                      v-model="metric.isWindowOutputRaw"
                    />
                    <FormCheck.Label class="font-bold" for="windowOutputRaw">Window Output</FormCheck.Label>
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
                          <option v-for="(option, behaviorIndex) in BEHAVIOR_OPTIONS" :key="behaviorIndex">
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
            <!-- END: ACCORDION -->
          </Disclosure>
        </div>
      </template>
    </ValidateEach>
  </Disclosure.Group>
</template>

<script setup lang="ts">
import { Ref, inject } from "vue"
import { BEHAVIOR_OPTIONS, UNIT_TIME_OPTIONS } from "@/constants"
import Select from "@/base-components/Form/FormSelect.vue"
import Label from "@/base-components/Form/FormLabel.vue"
import Input from "@/base-components/Form/FormInput.vue"
import { Disclosure } from "@/base-components/Headless"
import { ValidateEach } from "@vuelidate/components"
import { FormCheck } from "@/base-components/Form"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import ArrowDown from "@/assets/svg/ArrowDown.svg"
import Textarea from "@/base-components/Form/FormTextarea.vue"
import { IMetricComposite, IMetricRaw } from "@/interfaces/metrics.interface.ts"
import { useMetrics } from "@/components/Application/Metrics/MetricsComposable.ts"
import TomSelect from "@/base-components/TomSelect/TomSelect.vue"
import MonacoEditor from "@/base-components/MonacoEditor/MonacoEditor.vue"

const pathsWithError = inject<Ref<Array<string>>>("pathsWithError")

const emit = defineEmits<{
  (e: "levelChangeHandler", index: number, event: HTMLElementEvent<HTMLSelectElement>): void
}>()
const props = defineProps<{
  metrics: Array<IMetricComposite | IMetricRaw>
  componentList: Array<{ label: string; value: string }>
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

const hasBackendError = (path: string) => {
  if (!pathsWithError?.value) return false
  return pathsWithError.value.includes(path)
}
</script>

<style scoped>
.grid-area {
  display: grid;
  grid-template-areas: "header disclosure" "panel panel";
}

.header-area {
  grid-area: header;
}
.disclosure-area {
  grid-area: disclosure;
}
.panel-area {
  grid-area: panel;
}
</style>
