<script setup lang="ts">
import {HTMLAttributes, useSlots, provide, Slot} from "vue"

export type ProvideBeradcrumb = {
  light?: boolean
}

interface BreadcrumbProps extends /* @vue-ignore */ HTMLAttributes {
  light?: boolean
}

const slots = useSlots() as Record<string, Slot | undefined>;

const { light } = defineProps<BreadcrumbProps>()

provide<ProvideBeradcrumb>("breadcrumb", {
  light
})
</script>

<template>
  <nav class="flex" aria-label="breadcrumb">
    <ol :class="['flex items-center text-primary dark:text-slate-300', { 'text-white/90': light }]">
      <component v-for="(item, key) in slots.default && slots.default()" :key="key" :is="item" :index="key" />
    </ol>
  </nav>
</template>
