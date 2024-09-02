<template>
  <Application :applicationApiCall="createApplication" />
</template>

<script setup lang="ts">
import {useApplicationStore} from "@/store/modules/application.ts"
import {useRouter} from "vue-router"
import {useUIStore} from "@/store/modules/ui.ts"
import {SNACKBAR_MESSAGE_TYPES} from "@/constants"
import {IApplication} from "@/interfaces/application.interface.ts"
import Application from "@/components/Application"

const applicationStore = useApplicationStore()
const uiStore = useUIStore()
const router = useRouter()

const createApplication = async (applicationData: IApplication): Promise<IApplication> => {
  try {
    if (!applicationData.title) {
      throw new Error("Title is required");
    }
    return await applicationStore.createApplication(applicationData).then((application) => {
      uiStore.setSnackbarMessage({
        message: `Successfully created application ${application.title}`,
        type: SNACKBAR_MESSAGE_TYPES.SUCCESS
      });
      router.push({ name: "applications-overview" });
      return application;
    });
  } catch (error:any) {
    uiStore.setSnackbarMessage({
      message: `Failed to create application: ${error.message}`,
      type: SNACKBAR_MESSAGE_TYPES.ERROR
    });
    throw error; 
  }
};

</script>
