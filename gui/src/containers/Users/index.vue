<template>
  <div class="flex flex-col mt-8 intro-y">
    <div class="flex flex-row items-center justify-between mb-4">
      <h2 class="text-base uppercase">Users</h2>
      <Button variant="primary" class="uppercase" @click="openUserCreationDialogue">Add user</Button>
<!--      <Button v-if="isAdmin" variant="primary" class="uppercase" @click="openUserCreationDialogue">Add user</Button>-->
    </div>

    <div class="md:box flex-grow overflow-x-auto md:p-5">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 min-w-full max-w-max w-max">
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="border-b-0 whitespace-nowrap"> Status </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> User </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Username </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap w-24"> Action </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-for="(user, index) in paginatedArray" :key="index">
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <Lucide icon="CheckCircle2" />
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <p>{{ user.firstname + " " + user.lastname }}</p>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div class="flex items-center">
                <div class="flex flex-col mr-4">
                  <p>{{ user.email }}</p>
                </div>
                <p class="ml-auto">{{ user.date }}</p>
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div class="flex space-x-3">
                <Lucide icon="Trash2" class="text-danger" @click="removeUser(user.uuid)" />
                <Lucide icon="Eye" />
                <Lucide icon="MoreVertical" :data-tooltip="`user-tooltip-${index}`" />
                <TippyContent :to="`user-tooltip-${index}`" class="p-2">
                  <Button variant="outline-warning" @click="openUserEditingModal(user)">Edit User</Button>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useUserStore } from "@/store/modules/user.ts"
import { useUIStore } from "@/store/modules/ui.ts"
import { MODAL_WINDOW_NAMES, SNACKBAR_MESSAGE_TYPES } from "@/constants"
import Table from "@/base-components/Table"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import Pagination from "@/base-components/Pagination"
import Button from "@/base-components/Button"
import TippyContent from "@/base-components/TippyContent/TippyContent.vue"
import { IUser } from "@/interfaces/user.interface.ts"
import { usePagination } from "@/composables/usePagination.ts"

const userStore = useUserStore()
const uiStore = useUIStore()
const isAdmin = ref(false)
const users = computed<Array<IUser>>(() => userStore.users)

// const retrieveMe = async () => {
//   const currentUser = await userStore.retrieveUserInfo()
//   console.log("Current User:", currentUser)
//
//   isAdmin.value = currentUser?.role === 'admin'
//   console.log("Is Admin:", isAdmin.value)
// }
//
// retrieveMe()

// Pagination settings
const currentPage = ref(1)
const rowsPerPage = ref(10)

const rowsPerPageChange = (rows: number) => {
  rowsPerPage.value = rows
}

const { paginatedArray, numberOfPages } = usePagination<IUser>({
  rowsPerPage: rowsPerPage,
  arrayToPaginate: users,
  currentPage: currentPage
})

const retrieveAllUsers = async () => {
  await userStore.getAllUsers()
}

retrieveAllUsers()

const openUserCreationDialogue = () => {
  uiStore.setModalWindowState({
    name: MODAL_WINDOW_NAMES.USER_CREATION,
    title: "User Creation"
  })
}

const removeUser = (uuid: string) => {
  uiStore.setModalWindowState({
    name: MODAL_WINDOW_NAMES.CONFIRM_DELETING_MODAL,
    payload: {
      confirmAction: () => {
        userStore.deleteUser(uuid).then(() => {
          uiStore.setSnackbarMessage({
            message: "Successfully removed user",
            type: SNACKBAR_MESSAGE_TYPES.SUCCESS
          })
        })
      }
    }
  })
}

const openUserEditingModal = (user: IUser) => {
  uiStore.setModalWindowState({
    name: MODAL_WINDOW_NAMES.USER_EDITING,
    title: "User editing",
    payload: user
  })
}
</script>
