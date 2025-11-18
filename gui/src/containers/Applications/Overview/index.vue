<template>
  <div class="flex flex-col mt-8 space-y-10 intro-y">
    <div class="flex">
      <div class="flex  grow me-5">
        <Input
            v-model="applicationQuery"
            type="text"
            placeholder="Search Application"
        />
      </div>
      <div class="flex  justify-end">
        <Button variant="primary" type="button" @click="redirectToAppCreation"> Add Application</Button>
      </div>
    </div>

    <div v-for="application in applications" :key="application.uuid" class="flex flex-col">
      <div class="flex items-center justify-between">
        <div class="grow block">
          <p
              class="text-3xl capitalize hover:underline hover:cursor-pointer inline-block pe-3"
              @click="toApplicationEditing(application)"
          >
            {{
              application.title.length > 70 ?
                  application.title.substring(0, 67) + " ..." : application.title
            }}
          </p>
        </div>
        <div class="flex space-x-2">
          <p class="cursor-pointer rounded-full px-2 py-2 mx-2 text-xs font-medium text-white inline-block"
             :class="application.status == 'draft' ? 'bg-gray-700' :
                          application.status == 'deploying' ? 'bg-primary' :
                            application.status == 'ready' ? 'bg-success' :
                                application.status == 'running' ? 'bg-amber-300 text-black' :
                                  application.status =='failed' ? 'bg-danger' :
                                    application.status =='undeploying' ? 'bg-red-400' : ''"
             v-if="application.status">
            {{ application.status }}
          </p>
          <p class="cursor-pointer rounded-full px-2 py-2 mx-2 text-xs  dark:bg-darkmode-800 font-medium text-white inline-block"
             v-if="!application.status">
            unknown
          </p>
        </div>
        <div class="flex space-x-2">
          <Lucide
              v-if="application.status=='draft' || application.status=='failed'  || application.status=='ready' || !application.status"
              icon="PlayCircle" class="w-10 text-white" @click="deployApplication(application)"/>
          <Tippy content="Copy VR Token">
            <Lucide v-if="application.status=='running' && !loadingToken" icon="Rotate3d" class="w-10 text-white"
                    @click="showApplicationGraph(application)"/>
            <LoadingIcon icon="circles" v-if="application.status=='running' && loadingToken"/>
          </Tippy>
          <Lucide
              v-if="application.status=='draft' || application.status=='failed' || application.status=='ready' || !application.status"
              icon="Pencil" class="w-10 text-warning" @click="toApplicationEditing(application)"/>
          <Lucide v-if="application.status == 'running' || !application.status" icon="Unlock" class="w-10 text-alert"
                  @click="undeployApplication(application)"/>
          <Lucide icon="Copy" class="w-10 text-info" @click="duplicateApplication(application)"/>
          <Lucide
              v-if="application.status=='draft' || application.status=='failed' || application.status=='ready' || !application.status"
              icon="Trash2" class="w-10 text-danger" @click="removeApplication(application.uuid)"/>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useRouter} from "vue-router"
import {useApplicationStore} from "@/store/modules/application.ts"
import {useUIStore} from "@/store/modules/ui.ts"
import {IApplication, IApplicationOverview} from "@/interfaces/application.interface.ts"
import Button from "@/base-components/Button"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import {MODAL_WINDOW_NAMES, SNACKBAR_MESSAGE_TYPES} from "@/constants"
import Input from "@/base-components/Form/FormInput.vue";
import Tippy from "@/base-components/Tippy";
import LoadingIcon from "@/base-components/LoadingIcon";
import useClipboard from 'vue-clipboard3';

const router = useRouter()
const applicationStore = useApplicationStore()
const uiStore = useUIStore()
const {toClipboard} = useClipboard()

const applicationQuery = ref<String>('')
const loadingToken = ref<boolean>(false)
const applications = computed<Array<IApplicationOverview>>(() => {

  const q = applicationQuery.value.trim()
  if (!q) applicationStore.applications.results

  const matches = applicationStore.applications.results.filter((a) => a.title.indexOf(q) >= 0)

  console.log("Matches", matches)
  return matches


})


const redirectToAppCreation = () => {
  router.push({name: "application-creation"})
}

const removeApplication = (uuid: string) => {
  uiStore.setModalWindowState({
    name: MODAL_WINDOW_NAMES.CONFIRM_DELETING_MODAL,
    payload: {
      confirmAction: () => {
        applicationStore.removeApplication(uuid).then(() => {
          uiStore.setSnackbarMessage({
            message: "Successfully removed application",
            type: SNACKBAR_MESSAGE_TYPES.SUCCESS
          })
        })
      },
      cancelAction: () => {
      }
    }
  })
}

const toApplicationEditing = (application: IApplication) => {
  router.push({name: "application", params: {appUuid: application.uuid}})
}
const deployApplication = (application: IApplication) => {

  applicationStore.deployApplication(application.uuid)
}
const showApplicationGraph = (application: IApplication) => {
  console.log(application)
  if (loadingToken.value) {
    console.log("Already fetching token")
  }
  loadingToken.value = true
  applicationStore.getVRToken(application.uuid).then(async (token:string) => {
    await toClipboard(token)

    loadingToken.value = false
  })

}

const duplicateApplication = (application: IApplication) => {
  uiStore.setModalWindowState({
    name: MODAL_WINDOW_NAMES.CONFIRM_DUPLICATION_MODAL,
    payload: {
      confirmAction: () => {
        applicationStore.duplicateApplication(application.uuid).then((newApp: IApplicationOverview) => {
          const newAppUuid = newApp.uuid;
          uiStore.setSnackbarMessage({
            message: "Successfully duplicated application",
            type: SNACKBAR_MESSAGE_TYPES.SUCCESS
          })
        }).catch(() => {
          uiStore.setSnackbarMessage({
            message: "Failed to duplicate application",
            type: SNACKBAR_MESSAGE_TYPES.ERROR
          })
        })
      },
      cancelAction: () => {
      }
    }
  })
}

const undeployApplication = (application: IApplication) => {
  applicationStore.undeployApplication(application.uuid).then(() => {
    uiStore.setSnackbarMessage({
      message: `You need to manually undeploy resources.`,
      type: SNACKBAR_MESSAGE_TYPES.INFO
    });
  }).catch(() => {
    uiStore.setSnackbarMessage({
      message: `Failed to undeploy application ${application.title}`,
      type: SNACKBAR_MESSAGE_TYPES.ERROR
    });
  });
};

onMounted(() => {
  // Retrieve applications and then start polling
  applicationStore.getAllApplications().then(() => {
    applicationStore.startPolling();
  });
});

onBeforeUnmount(() => {
  applicationStore.stopPolling();
});


</script>