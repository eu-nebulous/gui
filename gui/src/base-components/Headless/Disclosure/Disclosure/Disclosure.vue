<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { twMerge } from "tailwind-merge"
import { Disclosure as HeadlessDisclosure } from "@headlessui/vue"
import { useAttrs, computed, inject, ref } from "vue"
import { ProvideGroup } from "../Group.vue"
import Provider from "./Provider.vue"

interface DisclosureProps extends /* @vue-ignore */ ExtractProps<typeof HeadlessDisclosure> {
  index?: number
  as?: string
}

const { index, as } = withDefaults(defineProps<DisclosureProps>(), {
  index: 0,
  as: "div"
})

const group = inject<ProvideGroup>("group")

const attrs = useAttrs()

const computedClass = computed(() => {
  // https://stackoverflow.com/questions/42874314/vuejs-conditionally-add-an-attribute-for-an-element
  // NOTE: even when class is null it does throw warning that class is present (can't inherit cause of template)
  if (as === "template") return null
  return twMerge([
    "py-4 first:-mt-4 last:-mb-4",
    "[&:not(:last-child)]:border-b [&:not(:last-child)]:border-slate-200/60 [&:not(:last-child)]:dark:border-darkmode-400",
    group?.value.variant === "boxed" &&
      "p-4 first:mt-0 last:mb-0 border border-slate-200/60 mt-3 dark:border-darkmode-400",
    typeof attrs.class === "string" && attrs.class
  ])
})
</script>

<template>
  <HeadlessDisclosure
    :as="as"
    :defaultOpen="group?.selectedIndex === index"
    :class="computedClass"
    v-slot="{ open, close }"
  >
    <Provider :open="open" :close="close" :index="index">
      <slot :open="open" :close="close"></slot>
    </Provider>
  </HeadlessDisclosure>
</template>
