<template>
  <Application :applicationApiCall="createApplication" />
</template>

<script setup lang="ts">
import { useApplicationStore } from "@/store/modules/application.ts"
import { useRouter } from "vue-router"
import { useUIStore } from "@/store/modules/ui.ts"
import { SNACKBAR_MESSAGE_TYPES } from "@/constants"
import { IApplication } from "@/interfaces/application.interface.ts"
import Application from "@/components/Application"

const applicationStore = useApplicationStore()
const uiStore = useUIStore()
const router = useRouter()

const createApplication = async (applicationData: IApplication): Promise<IApplication> => {
  return await applicationStore.validateApplication(applicationData).then(async () => {
    return await applicationStore.createApplication(applicationData).then((application) => {
      uiStore.setSnackbarMessage({
        message: `Successfully created application ${application.title}`,
        type: SNACKBAR_MESSAGE_TYPES.SUCCESS
      })
      router.push({ name: "applications-overview" })
      return application
    })
  })
}
</script>
