<template>
  <div class="flex flex-col text-start">
    <slot name="title"></slot>
    <ResourceForm :resource-data="resourceData"
                  :externalResults="externalResults"
                  :is-editing="true"
                  @on-confirm="editResource"
                  @on-close="closeModal"/>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue"
import {useUIStore} from "@/store/modules/ui.ts"
import {useResourceStore} from "@/store/modules/resources.ts"
import {extractExternalResults} from "@/utils/helper.ts"
import {SNACKBAR_MESSAGE_TYPES} from "@/constants"
import {IResourcePayload} from "@/types/resource.ts"
import ResourceForm from "@/components/Modal/ResourceForm.vue";

interface ResourceEditingProps {
  payload: IResourcePayload & { uuid: string }
}

const props = defineProps<ResourceEditingProps>()

const resourceStore = useResourceStore()
const uiStore = useUIStore()


const resourceData = reactive<IResourcePayload>(props.payload)
const closeModal = (skipConfirmation: boolean = false) => {
  uiStore.setModalWindowState(null, skipConfirmation)
}

const externalResults = reactive({})

const editResource = async () => {
  resourceStore
      .editResource(props.payload.uuid, resourceData)
      .then((editedResource) => {
        closeModal(true)
        uiStore.setSnackbarMessage({
          message: `Successfully edited resource ${editedResource.title}`,
          type: SNACKBAR_MESSAGE_TYPES.SUCCESS
        })
      })
      .catch((error) => {
        const errors = extractExternalResults(error)
        Object.assign(externalResults, errors)
      })
}

</script>