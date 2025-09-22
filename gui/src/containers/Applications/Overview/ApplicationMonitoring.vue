<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    <template v-for="metric in metrics" :key="metric.metric">
      <!-- Count Type Metrics -->
      <Card
          v-if="metric.type === 'count'"
          class="flex flex-col flex-grow items-center justify-between h-60"
      >
        <div class="mr-auto">
          <h1 class="text-base">{{ metric.title }}</h1>
          <h2 class="text-2xl">
            {{ formatValue(metric.data.value, metric.config.suffix) }}
          </h2>
        </div>

        <!-- Use BaseChart for chart types -->
        <BaseChart
            :type="metric.type"
            :height="120"
            :width="metric.type === 'doughnut' ? 120 : 180"
            :data="metric.data"
        />
      </Card>
      <Card
          v-if="metric.type === 'progress'"
          class="flex flex-col flex-grow items-center justify-between h-60"
      >
        <div class="mr-auto">
          <h1 class="text-base">{{ metric.title }}</h1>
          <h2 class="text-2xl">
            {{ formatValue(metric.data.value, metric.config.suffix) }}
          </h2>
        </div>
        <ProgressBar :height="120"
                     :width="metric.type === 'doughnut' ? 120 : 180"
                     :progressPercentage="metric.data.value"/>

      </Card>
      <!-- Chart Type Metrics -->
      <Card
          v-else
          class="flex flex-col flex-grow items-center justify-between h-60"
          :class="getCardSize(metric.type)"
      >
        <div class="mr-auto w-full">
          <h2 class="text-base">{{ metric.title }}</h2>
          <!-- Show summary value for line charts if available -->
          <h2 v-if="metric.summary" class="text-2xl">
            {{ metric.summary }}
          </h2>
        </div>

        <!-- Use BaseChart for chart types -->
        <BaseChart
            :type="metric.type"
            :height="120"
            :width="metric.type === 'doughnut' ? 120 : 180"
            :data="metric.config"
        />
      </Card>
    </template>
  </div>
</template>


<script setup lang="ts">


import {computed, onMounted, onUnmounted} from "vue";
import {useApplicationStore} from "@/store/modules/application.ts";

import BaseChart, {ProgressBar} from "@/base-components/Chart"
import Card from "@/base-components/Card/Card.vue"
import {
  violationsLineChartConfig,
  deploymentsDiagramConfig,
  reconfigDiagramConfig,
  latencyLineChartConfig
} from "./applicationChartsConfigs.ts"

interface AppMonitoringProps {
  uuid: string,
}

const props = defineProps<AppMonitoringProps>()
const applicationStore = useApplicationStore()

interface MetricData {
  title: string
  metric: string
  type: 'count' | 'line' | 'bar' | 'doughnut' | 'progress'
  config: any
  data: any
}

const metrics = computed(() => applicationStore.monitorData?.metrics || [])

const getCardSize = (type: string) => {
  // Doughnut charts can stay single width, others might need more space
  if (type === 'doughnut') {
    return 'col-span-1'
  }
  // Line and bar charts that need more horizontal space
  if (type === 'line' || (type === 'bar' && metrics.value.some(m => m.config?.indexAxis === 'y'))) {
    return 'col-span-1 sm:col-span-2'
  }
  return 'col-span-1'
}

const getChartType = (type: string): string => {
  // BaseChart might use different naming convention

  const typeMap: Record<string, string> = {
    'line': 'line',
    'bar': 'bar',
    'doughnut': 'doughnut'
  }
  return typeMap[type] || type
}

const formatValue = (value: string | number, suffix?: string) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value
  return suffix ? `${formattedValue}${suffix}` : formattedValue
}

onMounted(() => {
  console.log('Component mounted.')
  applicationStore.startMonitoring(props.uuid)
})
onUnmounted(() => {
  console.log('Component un- mounted.')
  applicationStore.stopMonitoring()
})

</script>