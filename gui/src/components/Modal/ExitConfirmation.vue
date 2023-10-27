<template>
  <div class="flex flex-col space-y-5 text-start">
    <div class="pt-5 px-5 flex flex-col items-center">
      <Lucide icon="AlertTriangle" class="text-warning" />
      <div class="text-center mt-4">
        <p class="text-sm" data-test="item-type">
          <span>{{ props.payload.message }}</span>
        </p>
      </div>
    </div>
    <div class="pb-5 flex justify-center space-x-2">
      <Button @click="cancelAction" data-test="close-btn">
        {{ props.payload.closeButtonName || "Cancel" }}
      </Button>
      <Button v-if="props.payload.isConfirmPresent" variant="danger" @click="confirmAction">
        {{ props.payload.confirmButtonName || "Confirm" }}
      </Button>
    </div>
  </div>
</template>

<script setup>
import { useUIStore } from "@/store/modules/ui"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import Button from "@/base-components/Button/Button.vue"

const uiStore = useUIStore()

const props = defineProps({
  payload: {
    type: Object,
    default: () => ({
      message: "",
      isConfirmPresent: false,
      closeButtonName: "Close",
      confirmButtonName: "Confirm",
      controlledWindowClosure: false,
      confirmAction: () => {},
      cancelAction: () => {}
    })
  }
})

const closeModal = () => {
  uiStore.setModalWindowState()
}

const cancelAction = () => {
  props.payload.cancelAction?.()
  if (!props.payload.controlledWindowClosure) closeModal()
}

const confirmAction = () => {
  props.payload.confirmAction?.()
  if (!props.payload.controlledWindowClosure) closeModal()
}
</script>
