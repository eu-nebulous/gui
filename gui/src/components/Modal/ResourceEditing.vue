<template>
  <div class="flex flex-col text-start">
    <slot name="title"></slot>
    <ResourceForm :resource-data="resourceData" :rules="rules"/>
    <Dialog.Footer>
      <Button type="button" variant="outline-secondary" @click="closeModal(false)" class="w-20 mr-4"> Cancel </Button>
      <Button variant="primary" type="button" class="w-20" @click="editResource"> Save </Button>
    </Dialog.Footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { useUIStore } from "@/store/modules/ui.ts"
import { useResourceStore } from "@/store/modules/resources.ts"
import { useVuelidate } from "@vuelidate/core"
import { required } from "@vuelidate/validators"
import { extractExternalResults } from "@/utils/helper.ts"
import { Dialog } from "@/base-components/Headless"
import Button from "@/base-components/Button"
import Label from "@/base-components/Form/FormLabel.vue"
import Input from "@/base-components/Form/FormInput.vue"
import Select from "@/base-components/Form/FormSelect.vue"
import { SNACKBAR_MESSAGE_TYPES } from "@/constants"
import { IResourcePayload } from "@/types/resource.ts"
import { IPlatform } from "@/interfaces/platform.interface.ts"
import ResourceForm from "@/components/Modal/ResourceForm.vue";

interface ResourceEditingProps {
  payload: IResourcePayload & { uuid: string }
}

const props = defineProps<ResourceEditingProps>()

const resourceStore = useResourceStore()
const uiStore = useUIStore()

const resourceData = reactive<IResourcePayload>(props.payload)

// HACK: https://github.com/vuelidate/vuelidate/issues/1147
const externalServerValidation = () => true

const rules = {
  title: { required, externalServerValidation },
  platform: { required, externalServerValidation }
}

const $externalResults = reactive({})
const v$ = useVuelidate(rules, resourceData, { $externalResults })

const closeModal = (skipConfirmation: boolean = false) => {
  uiStore.setModalWindowState(null, skipConfirmation)
}

const editResource = async () => {
  const validate = await  v$.value.$validate()
  if (!validate){
    return
  }

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
      Object.assign($externalResults, errors)
    })
}


</script>
