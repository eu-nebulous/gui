<template>
  <Alert :variant="snackbarStyle.variant" class="flex items-center">
    <Lucide :icon="snackbarStyle.icon" class="w-10 h-10 mr-6"></Lucide>
    <span class="mr-6"> {{ snackbarMessage?.message }}</span>
    <Lucide icon="X" class="ml-auto" @click="closeSnackbar"></Lucide>
  </Alert>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { SNACKBAR_MESSAGE_TYPES } from "@/constants"
import { useUIStore } from "@/store/modules/ui"
import getSnackbarStyle from "./snackBarStyles"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import Alert from "@/base-components/Alert"

export interface ISnackbarMessage {
  message: string
  type?: keyof typeof SNACKBAR_MESSAGE_TYPES
}

const uiStore = useUIStore()

const snackbarMessage = computed<ISnackbarMessage | null>(() => uiStore.snackbarMessage)

const countdown = 5000

onMounted(() => {
  setTimeout(closeSnackbar, countdown)
})

const snackbarStyle = computed(() => {
  return getSnackbarStyle(snackbarMessage.value?.type ?? SNACKBAR_MESSAGE_TYPES.NOTIFICATION)
})

const closeSnackbar = () => {
  uiStore.setSnackbarMessage()
}
</script>
