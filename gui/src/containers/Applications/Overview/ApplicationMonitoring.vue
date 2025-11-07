<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    <div v-if="!metrics || metrics.length <= 0" class="col-span-full flex items-center justify-center min-h-96">
      <p class="text-3xl font-semibold text-gray-100">No Metrics Recorded</p>
    </div>
    <template v-for="metric in metrics" :key="metric.title">
      <!-- Chart Type Metrics (line, bar) -->
      <Card
          class="flex flex-col h-60 overflow-hidden"
          :class="getCardSize(metric.type)"
      >
        <div class="mb-2">
          <h2 class="text-base font-semibold">{{ metric.title }}</h2>
          <h3 v-if="metric.summary" class="text-sm text-gray-600">
            {{ metric.summary }}
          </h3>
        </div>

        <div class="flex-1 min-h-0">
          <BaseChart
              :type="metric.type"
              :height="160"
              :width="getChartWidth(metric.type)"
              :data="metric.config"
          />
        </div>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useApplicationStore } from "@/store/modules/application.ts";
import BaseChart from "@/base-components/Chart"
import Card from "@/base-components/Card/Card.vue"

interface AppMonitoringProps {
  uuid: string
}

const props = defineProps<AppMonitoringProps>()
const applicationStore = useApplicationStore()

const metrics = computed(() => applicationStore.monitorData || [])

const getCardSize = (type: string) => {
  if (type === 'line' || type === 'bar') {
    return 'col-span-1 sm:col-span-2 lg:col-span-2'
  }
  return 'col-span-1'
}

const getChartWidth = (type: string): number => {
  // For wider card spans, use larger width
  if (type === 'line' || type === 'bar') {
    return 500
  }
  return 180
}

onMounted(() => {
  applicationStore.startMonitoring(props.uuid)
})

onUnmounted(() => {
  applicationStore.stopMonitoring()
})
</script>