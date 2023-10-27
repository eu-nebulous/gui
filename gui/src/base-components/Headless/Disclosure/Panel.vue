<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import _ from "lodash"
import { twMerge } from "tailwind-merge"
import { DisclosurePanel as HeadlessDisclosurePanel } from "@headlessui/vue"
import ExpandTransition from "@/base-components/ExpandTransition/index.vue"
import { useAttrs, computed } from "vue"

interface PanelProps extends /* @vue-ignore */ ExtractProps<typeof HeadlessDisclosurePanel> {
  as?: string | object
}

const { as } = withDefaults(defineProps<PanelProps>(), {
  as: "div"
})

const attrs = useAttrs()
const computedClass = computed(() => twMerge(["leading-relaxed", typeof attrs.class === "string" && attrs.class]))
</script>

<template>
  <ExpandTransition>
    <HeadlessDisclosurePanel as="template">
      <component :is="as" :class="computedClass" v-bind="_.omit(attrs, 'class')">
        <slot></slot>
      </component>
    </HeadlessDisclosurePanel>
  </ExpandTransition>
</template>
