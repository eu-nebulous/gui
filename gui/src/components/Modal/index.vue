<template>
  <Dialog static  scrollable size="xl" :open="Boolean(openedModalWindow)" @close="() => null">
    <Dialog.Panel>
      <Snackbar v-if="uiStore.snackbarMessage" />
      <component v-if="openedModalWindow" :is="components[openedModalWindow.name]" :payload="openedModalWindow.payload">
        <template #title>
          <Dialog.Title class="p-8">
            <p v-if="openedModalWindow.title" class="text-2xl text-center" data-test="modal-title">
              {{ openedModalWindow.title }}
            </p>
          </Dialog.Title>
        </template>
      </component>
    </Dialog.Panel>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { Component } from "vue"
import { Dialog } from "@/base-components/Headless"
import { useUIStore } from "@/store/modules/ui.ts"
import { MODAL_WINDOW_NAMES } from "@/constants"
import UserCreation from "@/components/Modal/UserCreation.vue"
import UserEditing from "@/components/Modal/UserEditing.vue"
import ResourceCreation from "@/components/Modal/ResourceCreation.vue"
import ResourceEditing from "@/components/Modal/ResourceEditing.vue"
import DeleteConfirmation from "@/components/Modal/DeleteConfirmation.vue"
import DuplicationConfirmation from "@/components/Modal/DuplicationConfirmation.vue"
import ExitConfirmation from "@/components/Modal/ExitConfirmation.vue"

import Snackbar from "@/components/Snackbar"

const uiStore = useUIStore()

const components: Record<keyof typeof MODAL_WINDOW_NAMES, Component> = {
  [MODAL_WINDOW_NAMES.USER_CREATION]: UserCreation,
  [MODAL_WINDOW_NAMES.USER_EDITING]: UserEditing,
  [MODAL_WINDOW_NAMES.RESOURCE_CREATION]: ResourceCreation,
  [MODAL_WINDOW_NAMES.RESOURCE_EDITING]: ResourceEditing,
  [MODAL_WINDOW_NAMES.CONFIRM_DELETING_MODAL]: DeleteConfirmation,
  [MODAL_WINDOW_NAMES.CONFIRM_DUPLICATION_MODAL]: DuplicationConfirmation,
  [MODAL_WINDOW_NAMES.EXIT_MESSAGE_MODAL]: ExitConfirmation
}

const openedModalWindow = computed(() => uiStore.openedModalWindow)

/* const closeModal = () => {
  uiStore.setModalWindowState()
} */
</script>
