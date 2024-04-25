<template>
  <Modal />
  <div class="py-5 md:py-0">
    <MobileMenu v-if="!isMenuHidden" />
    <Header v-if="!isMenuHidden" layout="side-menu" />

    <div class="flex overflow-hidden">
      <SideMenu v-if="!isMenuHidden" />
      <!-- BEGIN: Content -->
      <div
        :class="[
          'flex flex-col',
          'max-w-full md:max-w-none rounded-[30px] md:rounded-none px-4 md:px-[22px] min-w-0 min-h-screen bg-slate-100',
          'flex-1 md:pt-20 pb-10 mt-5 md:mt-1 relative dark:bg-darkmode-700'
        ]"
      >
        <Snackbar v-if="uiStore.snackbarMessage && !uiStore.isModalOpened" class="mt-4" />
        <RouterView />
      </div>
      <!-- END: Content -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, Ref } from "vue"
import { RouteLocationNormalizedLoaded, useRoute } from "vue-router"
import { useUIStore } from "@/store/modules/ui.ts"
import Header from "@/components/Header"
import SideMenu from "@/components/SideMenu"
import MobileMenu from "@/components/MobileMenu"
import Modal from "@/components/Modal"
import Snackbar from "@/components/Snackbar"
import Footer from "@/base-components/Headless/Menu/Footer.vue";

const route: RouteLocationNormalizedLoaded = useRoute()

const uiStore = useUIStore()

const isMenuHidden: Ref<boolean> = ref(true)

watch(
  route,
  () => {
    isMenuHidden.value = Boolean(route.meta.hideMenu)
  },
  { deep: true }
)


</script>
