<template>
  <div class="relative">
    <div class="absolute text-3xl mt-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {{ props.title ?? props.progressPercentage + "%" }}
    </div>
    <BaseChart type="doughnut" :height="props.height" :width="props.width" :data="data" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import BaseChart from "./index.vue"
import { getColor } from "@/utils/colors.ts"

const props = withDefaults(
  defineProps<{
    title?: string
    progressPercentage?: number
    width?: number
    height?: number
    bgColor?: string
  }>(),
  { progressPercentage: 0 }
)

const data = computed(() => ({
  datasets: [
    {
      data: [props.progressPercentage, 100 - props.progressPercentage],
      borderWidth: 0,
      backgroundColor: [props.bgColor ?? getColor("warning", 0.8), "transparent"],
      tension: 0.4,
      cutout: "90%",
      rotation: 270,
      weight: 0.01,
      spacing: 1,
      circumference: 180,
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      },
      cutoutPercentage: 95
    }
  ]
}))
</script>
