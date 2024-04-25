<template>
  <div
    :class="[
      'h-[70px] md:h-[65px] z-[51] border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700',
      props.layout == 'top-menu' && 'dark:md:from-darkmode-800',
      'before:content-[\'\'] before:absolute before:h-[65px] before:inset-0 before:top-0 before:mx-7 before:bg-primary/30 before:mt-3 before:rounded-xl before:hidden before:md:block before:dark:bg-darkmode-600/30',
      'after:content-[\'\'] after:absolute after:inset-0 after:h-[65px] after:mx-3 after:bg-primary after:mt-5 after:rounded-xl after:shadow-md after:hidden after:md:block after:dark:bg-darkmode-600'
    ]"
  >
    <div class="flex items-center h-full">
      <!-- BEGIN: Logo -->
      <RouterLink
        :to="{ name: 'applications-overview' }"
        :class="[
          '-intro-x hidden md:flex',
          props.layout == 'side-menu' && 'xl:w-[180px]',
          props.layout == 'simple-menu' && 'xl:w-auto',
          props.layout == 'top-menu' && 'w-auto'
        ]"
      >
        <Logo :isMobileResponsive="true" />
      </RouterLink>
      <!-- END: Logo -->
      <!-- BEGIN: Breadcrumb -->
      <Breadcrumb
        light
        :class="[
          'h-[45px] md:ml-10 md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x',
          props.layout != 'top-menu' && 'md:pl-6',
          props.layout == 'top-menu' && 'md:pl-10'
        ]"
      >
        <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
        <Breadcrumb.Link to="/" :active="true"> Dashboard </Breadcrumb.Link>
      </Breadcrumb>
      <!-- END: Breadcrumb -->
      <!-- BEGIN: DARK -->
      <DebugInfo class="mr-4" />
      <DarkModeSwitcher class="mr-4" />
      <!-- END: DARK -->
      <!-- BEGIN: Account Menu -->
      <Menu>
        <Menu.Button
          class="flex items-center justify-center bg-blue-400 w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x uppercase"
        >
          <p>{{ firstNameLetter }}</p>
        </Menu.Button>
        <Menu.Items
          class="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white"
        >
          <Menu.Header class="font-normal">
            <div class="font-medium">{{ userFullName }}</div>
          </Menu.Header>
          <Menu.Divider class="bg-white/[0.08]" />
          <Menu.Item class="hover:bg-white/5" @click="redirectToAccountSettings">
            <Lucide icon="User" class="w-4 h-4 mr-2" /> Profile
          </Menu.Item>
          <Menu.Item class="hover:bg-white/5"> <Lucide icon="Lock" class="w-4 h-4 mr-2" /> Reset Password </Menu.Item>
          <Menu.Divider class="bg-white/[0.08]" />
          <Menu.Item class="hover:bg-white/5" @click="logOut">
            <Lucide icon="ToggleRight" class="w-4 h-4 mr-2" /> Logout
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <!-- END: Account Menu -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user.ts"
import { TransitionRoot } from "@headlessui/vue"
import _ from "lodash"
import fakerData from "@/utils/faker.ts"
import { IUser } from "@/interfaces/user.interface.ts"
import Lucide from "@/base-components/Lucide"
import DarkModeSwitcher from "@/components/DarkModeSwitcher"
import Breadcrumb from "@/base-components/Breadcrumb"
import Logo from "@/base-components/Logo"
import { FormInput } from "@/base-components/Form"
import { Menu } from "@/base-components/Headless"
import DebugInfo from "@/components/DebugInfo/DebugInfo.vue";

const router = useRouter()
const props = defineProps<{
  layout?: "side-menu" | "simple-menu" | "top-menu"
}>()

const userStore = useUserStore()

const user = computed(() => userStore.user) as ComputedRef<IUser>

const userFullName = computed(() => (user.value?.firstname || " ") + " " + (user.value?.lastname || " "))
const firstNameLetter = computed(() => user.value?.firstname?.charAt(0))

const searchDropdown = ref(false)
const showSearchDropdown = () => {
  searchDropdown.value = true
}
const hideSearchDropdown = () => {
  searchDropdown.value = false
}

const logOut = () => {
  localStorage.removeItem("access-token")
  router.push({ name: "login" })
}

const redirectToAccountSettings = () => {
  router.push({ name: "account-settings" })
}
</script>
