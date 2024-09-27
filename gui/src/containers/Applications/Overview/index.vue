<template>
  <div class="flex flex-col mt-8 space-y-10 intro-y">
    <div class="flex justify-end">
      <Button variant="primary" type="button" @click="redirectToAppCreation"> Add Application</Button>
    </div>
    <div v-for="application in applications" :key="application.uuid" class="flex flex-col">
      <div class="flex items-center justify-between">
        <div class="block">
          <p
            class="text-3xl capitalize hover:underline hover:cursor-pointer inline-block  align-middle"
            @click="toApplicationEditing(application)"
          >
            {{ application.title }}
          </p>
          <p class="cursor-pointer rounded-full px-2 py-2 mx-2 text-xs font-medium text-white inline-block"
               :class="application.status == 'draft' ? 'bg-gray-700' :
                          application.status == 'deploying' ? 'bg-primary' :
                            application.status == 'ready' ? 'bg-success' :
                              application.status =='deployed' ? 'bg-purple-900' : ''"
               v-if="application.status">
            {{application.status}}
          </p>
          <p class="cursor-pointer rounded-full px-2 py-2 mx-2 text-xs  dark:bg-darkmode-800 font-medium text-white inline-block"
               v-if="!application.status">
            unknown
          </p>

        </div>
        <div class="flex space-x-2">

          <Lucide  icon="PlayCircle" class="w-10 text-white" @click="deployApplication(application)" />
          <Lucide v-if="application.status=='draft' || application.status=='ready' || !application.status" icon="Pencil" class="w-10 text-warning" @click="toApplicationEditing(application)" />
          <Lucide v-if="application.status=='draft' || application.status=='ready' || !application.status" icon="Copy" class="w-10 text-info" @click="duplicateApplication(application)" />
          <Lucide v-if="application.status=='draft' || application.status=='ready' || !application.status" icon="Trash2" class="w-10 text-danger" @click="removeApplication(application.uuid)" />
        </div>
      </div>

      <div class="grid xl:grid-cols-5 md:grid-cols-2 sm:grid-cols-1 gap-10 mt-6 hidden">
        <!-- BEGIN: LATENCY -->
        <Card class="flex flex-col flex-grow items-center justify-between h-60" animate>
          <div class="mr-auto">
            <h2 class="text-base">Latency</h2>
            <h2 class="text-2xl">{{ application.latency || 0 }} MS</h2>
          </div>
          <BaseChart
            v-if="application.latency"
            type="line"
            :height="120"
            :width="180"
            :data="latencyLineChartConfig(application.latency)"
          />
        </Card>
        <!-- END: LATENCY -->
        <!-- BEGIN: RECONFIGURATION -->
        <Card class="flex flex-col flex-grow items-center justify-between h-60" animate>
          <div class="mr-auto">
            <h2 class="text-base">Reconfiguration</h2>
            <h2 class="text-2xl">{{ application.reconfigurations || 0 }}</h2>
          </div>
          <BaseChart
            v-if="application.reconfigurations"
            type="bar"
            :height="120"
            :width="180"
            :data="reconfigDiagramConfig(application.reconfigurations)"
          />
        </Card>
        <!-- END: RECONFIGURATION -->
        <!-- BEGIN: DEPLOYMENTS -->
        <Card class="flex flex-col flex-grow items-center justify-between h-60" animate>
          <div class="mr-auto">
            <h2 class="text-base">Deployments</h2>
            <h2 class="text-2xl">{{ application.deployments || 0 }}</h2>
          </div>

          <BaseChart
            v-if="application.deployments"
            type="bar"
            :height="120"
            :width="180"
            :data="deploymentsDiagramConfig(application.deployments)"
          />
        </Card>
        <!-- END: DEPLOYMENTS -->
        <!-- BEGIN: SLO VIOLATIONS -->
        <Card class="flex flex-col flex-grow items-center justify-between h-60" animate>
          <div class="mr-auto">
            <h2 class="text-base">SLO violations</h2>
            <h2 class="text-2xl">{{ application.violations || 0 }}</h2>
          </div>

          <BaseChart
            v-if="application.violations"
            type="line"
            :height="120"
            :width="180"
            :data="violationsLineChartConfig(application.violations)"
          />
        </Card>
        <!-- END: SLO VIOLATIONS  -->
        <!-- BEGIN: STRAIN -->
        <Card class="flex flex-col flex-grow items-center justify-between h-60" animate>
          <div class="mr-auto">
            <h2 class="text-base">Strain</h2>
            <h2 v-if="!application.strain" class="text-2xl">0</h2>
          </div>
          <ProgressBar v-if="application.strain" :height="120" :width="180" :progressPercentage="application.strain" />
        </Card>
      </div>
      <!-- END: STRAIN  -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useApplicationStore } from "@/store/modules/application.ts"
import { useUIStore } from "@/store/modules/ui.ts"
import BaseChart from "@/base-components/Chart"
import {IApplication, IApplicationOverview} from "@/interfaces/application.interface.ts"
import { ProgressBar } from "@/base-components/Chart"
import Card from "@/base-components/Card/Card.vue"
import Button from "@/base-components/Button"
import {
  violationsLineChartConfig,
  deploymentsDiagramConfig,
  reconfigDiagramConfig,
  latencyLineChartConfig
} from "./applicationChartsConfigs.ts"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import { MODAL_WINDOW_NAMES, SNACKBAR_MESSAGE_TYPES } from "@/constants"

const router = useRouter()
const applicationStore = useApplicationStore()
const uiStore = useUIStore()

const applications = computed<Array<IApplicationOverview>>(() => applicationStore.applications.results)

const retrieveApplications = () => {
  applicationStore.getAllApplications()
}

retrieveApplications()

const redirectToAppCreation = () => {
  router.push({ name: "application-creation" })
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
      cancelAction: () => {}
    }
  })
}

const toApplicationEditing = (application: IApplication) => {
  router.push({ name: "application", params: { appUuid: application.uuid } })
}
const deployApplication = (application: IApplication) =>{

  applicationStore.deployApplication(application.uuid)


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
      cancelAction: () => {}
    }
  })
}
</script>
