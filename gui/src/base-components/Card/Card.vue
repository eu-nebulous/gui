<template>
  <component :is="as" :class="computedClass" v-bind="_.omit(attrs, 'class')">
    <slot></slot>
  </component>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import _ from "lodash"
import { computed, useAttrs } from "vue"
import { twMerge } from "tailwind-merge"
interface CardProps {
  animate?: boolean
  as?: string
}

const { animate } = withDefaults(defineProps<CardProps>(), {
  as: "div"
})
const attrs = useAttrs()

const computedClass = computed(() =>
  twMerge([
    animate && "zoom-in",
    "relative p-5 box z-0",
    "before:-mt-2.5 before:absolute before:-z-10 before:content-[''] before:w-[90%] before:shadow-[0px_3px_5px_#0000000b] before:h-full before:rounded-md before:mx-auto before:inset-x-0 before:bg-card-color/70",
    typeof attrs.class === "string" && attrs.class
  ])
)
</script>
