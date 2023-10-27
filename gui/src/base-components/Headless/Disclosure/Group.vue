<script lang="ts">
type Variant = "default" | "boxed"
</script>

<script setup lang="ts">
import { ref, provide, useSlots, ComputedRef, computed } from "vue"

export type ProvideGroup = ComputedRef<{
  selectedIndex?: number | null
  setSelectedIndex: (value: number) => void
  variant?: Variant
}>

interface GroupProps {
  as?: string | object
  selectedIndex?: number
  variant?: Variant
}

const slots = useSlots()

const { as, selectedIndex, variant } = withDefaults(defineProps<GroupProps>(), {
  as: "div",
  selectedIndex: 0,
  variant: "default"
})

const active = ref<number | null>(selectedIndex)
const setActive = (value: number) => {
  if (value === active.value) active.value = null
  else active.value = value
}

provide<ProvideGroup>(
  "group",
  computed(() => {
    return {
      selectedIndex: active.value,
      setSelectedIndex: setActive,
      variant
    }
  })
)

defineExpose({ selectedIndex: active })
</script>

<template>
  <component :is="as">
    <component v-for="(item, key) in slots.default && slots.default()" :key="key" :index="key" :is="item" />
  </component>
</template>
