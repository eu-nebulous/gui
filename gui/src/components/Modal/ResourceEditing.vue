<template>
  <div class="flex flex-col text-start">
    <slot name="title"></slot>
    <Dialog.Description class="flex-col space-y-4 p-8">
      <div class="flex flex-col">
        <Label>Name</Label>
        <Input
          type="email"
          v-model="resourceData.title"
          :class="{
            'input--invalid': v$.title?.$error
          }"
        />
      </div>
      <div class="flex flex-col">
        <Label>Type</Label>
        <Select
          v-model="resourceData.platform"
          :class="{
            'input--invalid': v$.platform?.$error
          }"
        >
          <option v-for="(platform, index) in platformsOptions" :key="index" :value="platform.uuid">
            {{ platform.title }}
          </option>
        </Select>
      </div>
      <div class="flex flex-col">
        <Label>App ID</Label>
        <Input
          type="text"
          v-model="resourceData.appId"
          :class="{
            'input--invalid': v$.appId?.$error
          }"
        />
      </div>
      <div class="flex flex-col">
        <Label>App Secret</Label>
        <Input
          type="text"
          v-model="resourceData.appSecret"
          :class="{
            'input--invalid': v$.appSecret?.$error
          }"
        />
      </div>
    </Dialog.Description>
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

interface ResourceEditingProps {
  payload: IResourcePayload & { uuid: string }
}

const props = defineProps<ResourceEditingProps>()

const resourceStore = useResourceStore()
const uiStore = useUIStore()

const resourceData = reactive<IResourcePayload>({
  title: props.payload.title ?? "",
  platform: props.payload.platform ?? "",
  appId: props.payload.appId ?? "",
  appSecret: props.payload.appSecret ?? ""
})

// HACK: https://github.com/vuelidate/vuelidate/issues/1147
const externalServerValidation = () => true

const rules = {
  title: { required, externalServerValidation },
  platform: { required, externalServerValidation },
  appId: { required, externalServerValidation },
  appSecret: { required, externalServerValidation }
}

const $externalResults = reactive({})
const v$ = useVuelidate(rules, resourceData, { $externalResults })

const closeModal = (skipConfirmation: boolean = false) => {
  uiStore.setModalWindowState(null, skipConfirmation)
}

const editResource = async () => {
  if (!(await v$.value.$validate())) return
  if (!(await v$.value.$validate())) return
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

const platformsOptions = ref<Array<IPlatform>>([])

const getPlatforms = async () => {
  platformsOptions.value = await resourceStore.getPlatforms()
}

getPlatforms()
</script>
