<template>
  <div class="flex flex-col space-y-5">
    <div class="flex items-center space-x-4">
      <p class="text-2xl">Metrics</p>
      <Lucide icon="PlusCircle" @click="addMetric" />
    </div>

    <MetricsTemplateDesktop
      :metrics="localMetrics"
      :componentList="props.componentList"
      @levelChangeHandler="onLevelChangeHandler"
      class="hidden md:table"
    />
    <MetricsTemplateMobile
      :metrics="localMetrics"
      :componentList="props.componentList"
      @levelChangeHandler="onLevelChangeHandler"
      class="md:hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import { IMetricComposite, IMetricRaw } from "@/interfaces/metrics.interface.ts"
import MetricsTemplateDesktop from "@/components/Application/Metrics/MetricsTemplateDesktop.vue"
import MetricsTemplateMobile from "@/components/Application/Metrics/MetricsTemplateMobile.vue"

interface MetricsProps {
  componentList: Array<{ label: string; value: string }>
  metrics: Array<IMetricRaw | IMetricComposite>
}
const props = defineProps<MetricsProps>()

const localMetrics = computed(() => props.metrics)

const addMetric = () => {
  localMetrics.value.push({
    type: "raw",
    name: "",
    sensor: "",
    config: [],
    isWindowOutputRaw: true,
    isWindowInputRaw: true,
    outputRaw: {
      type: "all",
      interval: 0,
      unit: "ms"
    },
    inputRaw: {
      type: "all",
      interval: 0,
      unit: "ms"
    }
  })
}

const onLevelChangeHandler = (index: number, event: HTMLElementEvent<HTMLSelectElement>) => {
  if (event.target.value === "global") {
    delete (localMetrics.value[index] as IMetricComposite).components
  } else {
    ;(localMetrics.value[index] as IMetricComposite).components = []
  }
}
</script>
