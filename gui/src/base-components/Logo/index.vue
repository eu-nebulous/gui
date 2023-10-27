<template>
  <div class="flex justify-center items-center">
    <img alt="Nebulous" class="w-10 h-10" :src="logoUrl" />
    <span
      class="ml-3 text-lg font-thin text-gray-800 dark:text-white"
      :class="{ 'hidden xl:block': isMobileResponsive }"
    >
      NebulOus
    </span>
  </div>
</template>

<script setup lang="ts">
import logoUrl from "@/assets/images/nebulous-logo.png"

interface LogoProps {
  isMobileResponsive?: boolean
}

withDefaults(defineProps<LogoProps>(), { isMobileResponsive: false })
</script>
