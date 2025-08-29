<template>
  <Application
    v-if="!isObjectEmpty(applicationData)"
    :applicationApiCall="updateApplication"
    :incomingApplicationData="applicationData"
  />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useApplicationStore } from "@/store/modules/application.ts"
import { useUIStore } from "@/store/modules/ui.ts"
import { isObjectEmpty } from "@/utils/helper.ts"
import { IApplication } from "@/interfaces/application.interface.ts"
import { SNACKBAR_MESSAGE_TYPES } from "@/constants"
import Application from "@/components/Application"

const applicationStore = useApplicationStore()
const uiStore = useUIStore()
const router = useRouter()

const props = defineProps<{
  appUuid: string
}>()

const applicationData = ref({})

const updateApplication = async (applicationData: Partial<IApplication>): Promise<IApplication> => {

  return await applicationStore.validateApplication(applicationData).then(async () => {
    return await applicationStore.editApplication(props.appUuid, applicationData).then((application) => {
      uiStore.setSnackbarMessage({
        message: `Successfully edited application ${application.title}`,
        type: SNACKBAR_MESSAGE_TYPES.SUCCESS
      })
      router.push({ name: "applications-overview" })
      return application
    })
  })
}

const getApplicationData = async () => {
  applicationStore.getApplication(props.appUuid).then((application) => {
    applicationData.value = application
  })
}

getApplicationData()
</script>
