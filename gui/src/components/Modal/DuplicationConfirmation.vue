<template>
  <div class="flex flex-col text-start">
    <div class="p-5 text-center">
      <Lucide icon="Copy" class="w-16 h-16 mx-auto mt-3 text-primary" />
      <div class="mt-5 text-3xl">Confirm Duplication</div>
      <div class="mt-2 text-slate-500">
        Do you want to duplicate the selected application? <br />
        This action will create a new application based on the original.
      </div>
    </div>
    <div class="px-5 pb-8 text-center">
      <Button type="button" variant="outline-secondary" @click="cancelAction" class="w-24 mr-1"> Cancel </Button>
      <Button type="button" variant="primary" class="w-24" @click="confirmAction"> Duplicate </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/base-components/Button"
import Lucide from "@/base-components/Lucide"
import { useUIStore } from "@/store/modules/ui.ts"

const props = defineProps({
  payload: {
    type: Object,
    default: () => ({
      itemType: "",
      itemName: "",
      cancelAction: () => {},
      confirmAction: () => {
        console.log("No action performed")
      }
    })
  }
})

const uiStore = useUIStore()

const closeModal = () => {
  uiStore.setModalWindowState()
}

const cancelAction = () => {
  props.payload?.cancelAction()
  closeModal()
}

const confirmAction = () => {
  props.payload.confirmAction()
  closeModal()
}
</script>
