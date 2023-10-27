<template>
  <Lucide icon="Moon" class="w-5 h-5 text-color-secondary intro-x cursor-pointer" @click="switchMode" />
</template>

<script setup lang="ts">
import { useDarkModeStore } from "@/store/modules/dark-mode.ts"
import { computed } from "vue"
import Lucide from "@/base-components/Lucide/Lucide.vue"

const darkMode = computed(() => useDarkModeStore().darkMode)

const setDarkModeClass = () => {
  const el = document.querySelectorAll("html")[0]
  darkMode.value ? el.classList.add("dark") : el.classList.remove("dark")
}

const switchMode = () => {
  useDarkModeStore().setDarkMode(!darkMode.value)
  setDarkModeClass()
}

setDarkModeClass()
</script>
