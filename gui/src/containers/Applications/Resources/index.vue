<template>
  <div class="flex flex-col mt-8 intro-y">
    <div class="flex flex-row justify-between items-center mb-4">
      <h2 class="text-base uppercase">Resources</h2>
      <Button variant="primary" class="uppercase" @click="openResourceCreationModal">Add resource </Button>
    </div>

    <div class="md:box flex-grow overflow-x-auto md:p-5">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 min-w-full max-w-max w-max">
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="border-b-0 whitespace-nowrap"> Name </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Platform </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> AppId </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> App Secret </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap w-24"> Action </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-for="(resource, index) in paginatedArray" :key="index">
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div>{{ resource.title }}</div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div
                v-if="resource.platform"
                class="px-4 rounded-2xl w-20 text-center uppercase"
                :class="generateColor(resource.platform)"
              >
                {{ resource.platform }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div>{{ resource.appId }}</div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div>{{ resource.appSecret }}</div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div class="flex space-x-3">
                <Lucide icon="Trash2" class="text-danger" @click="removeResource(resource.uuid)" />
                <Lucide icon="Eye" @click="loadNodeCandidates(resource.uuid)" />
                <Lucide icon="MoreVertical" :data-tooltip="`user-tooltip-${index}`" />
                <TippyContent :to="`user-tooltip-${index}`" class="p-2">
                  <Button variant="outline-warning" @click="openResourceEditingModal(resource)">Edit Resource</Button>
                </TippyContent>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <div class="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap mt-8">
        <Pagination
          class="w-full sm:w-auto sm:mr-auto"
          v-model="currentPage"
          :numberOfPages="numberOfPages"
          :rowsPerPage="rowsPerPage"
          @rowsPerPageChange="rowsPerPageChange"
        />
      </div>
    </div>

    <div class="box p-5 mt-3">
      <NodeCandidatesTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useResourceStore } from "@/store/modules/resources.ts"
import { useUIStore } from "@/store/modules/ui.ts"
import NodeCandidatesTable from "./NodeCandidatesTable.vue"
import { IResource } from "@/interfaces/resources.interface.ts"
import { MODAL_WINDOW_NAMES, SNACKBAR_MESSAGE_TYPES } from "@/constants"
import Button from "@/base-components/Button/Button.vue"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import Pagination from "@/base-components/Pagination"
import Table from "@/base-components/Table"
import TippyContent from "@/base-components/TippyContent/TippyContent.vue"
import { usePagination } from "@/composables/usePagination.ts"
import { generateColor } from "@/utils/colors.ts"

const resourceStore = useResourceStore()
const uiStore = useUIStore()

const resources = computed<Array<IResource>>(() => resourceStore.resources.results)

const currentPage = ref(1)
const rowsPerPage = ref(10)

const rowsPerPageChange = (rows: number) => {
  rowsPerPage.value = rows
}

const { paginatedArray, numberOfPages } = usePagination<IResource>({
  rowsPerPage: rowsPerPage,
  arrayToPaginate: resources,
  currentPage: currentPage
})

const retrieveAllResources = async () => {
  await resourceStore.getAllResources()
}

const removeResource = (uuid: string) => {
  uiStore.setModalWindowState({
    name: MODAL_WINDOW_NAMES.CONFIRM_DELETING_MODAL,
    payload: {
      confirmAction: () => {
        resourceStore.deleteResource(uuid).then(() => {
          uiStore.setSnackbarMessage({
            message: "Successfully removed resource",
            type: SNACKBAR_MESSAGE_TYPES.SUCCESS
          })
        })
      },
      cancelAction: () => {}
    }
  })
}

const loadNodeCandidates = (uuid: string) => {}

const openResourceEditingModal = (resource: IResource) => {
  uiStore.setModalWindowState({
    name: MODAL_WINDOW_NAMES.RESOURCE_EDITING,
    title: "Resource editing",
    payload: resource
  })
}

const openResourceCreationModal = () => {
  uiStore.setModalWindowState({
    name: MODAL_WINDOW_NAMES.RESOURCE_CREATION,
    title: "Resource creation"
  })
}

retrieveAllResources()
</script>
