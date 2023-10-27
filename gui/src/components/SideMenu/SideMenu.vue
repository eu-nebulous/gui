<template>
  <nav class="side-nav w-[105px] xl:w-[260px] px-5 pb-16 overflow-x-hidden z-50 pt-32 -mt-4 hidden md:block">
    <ul>
      <!-- BEGIN: First Child -->
      <template v-for="(menu, menuKey) in formattedMenu">
        <!-- DIVIDER -->
        <li
          v-if="menu.isDivider"
          :class="[
            'side-nav__divider my-6',
            `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${
              (menuKey + 1) * 10
            }`
          ]"
          :key="'divider-' + menuKey"
        >
          {{ menu.title }}
        </li>
        <!-- MENU ITEM -->
        <li v-else :key="menuKey">
          <!-- prettier-ignore -->
          <Tippy
              as="a"
              :content="menu.title"
              :options="{ placement: 'right' }"
              :disable="windowWidth > 1260"
              :href="menu.subMenu ? '#' : getRouteFullPath(menu.pageName)"
              @click.prevent="
              linkTo(menu, router);
              setFormattedMenu([...formattedMenu])
            "
              :class="[
              { 'side-menu side-menu--active': menu.active },
              {
                [`side-menu opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                  (menuKey + 1) * 10
                }`]: !menu.active
              }
            ]"
          >
            <div v-if="menu.icon" class="side-menu__icon">
              <Lucide :icon="menu.icon"/>
            </div>

            <div class="side-menu__title">
              {{ menu.title }}
              <div
                  v-if="menu.subMenu"
                  :class="['side-menu__sub-icon', { 'transform rotate-180': menu.activeDropdown }]"
              >
                <Lucide icon="ChevronDown"/>
              </div>
            </div>
          </Tippy>

          <!-- SUB MENU ITEMS -->
          <Transition @enter="enter" @leave="leave">
            <ul v-if="menu.subMenu && menu.activeDropdown" :class="{ 'side-menu__sub-open': menu.activeDropdown }">
              <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
                <Tippy
                  as="a"
                  :content="subMenu.title"
                  :options="{
                    placement: 'right'
                  }"
                  :disable="windowWidth > 1260"
                  :href="subMenu.subMenu ? '#' : getRouteFullPath(subMenu.pageName)"
                  :class="[
                    subMenu.active ? 'side-menu side-menu--active' : 'side-menu',
                    {
                      [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                        (subMenuKey + 1) * 10
                      }`]: !subMenu.active
                    }
                  ]"
                  @click="
                    (event: MouseEvent) => {
                      event.preventDefault()
                      linkTo(subMenu, router)
                      setFormattedMenu([...formattedMenu])
                    }
                  "
                >
                  <div v-if="subMenu.icon" class="side-menu__icon">
                    <Lucide :icon="subMenu.icon" />
                  </div>
                  <div v-else class="side-menu__bullet"></div>

                  <div class="side-menu__title">
                    <span> {{ subMenu.title }}</span>
                    <div
                      v-if="subMenu.subMenu"
                      :class="[
                        'side-menu__sub-icon',
                        {
                          'transform rotate-180': subMenu.activeDropdown
                        }
                      ]"
                    >
                      <Lucide icon="ChevronDown" />
                    </div>
                  </div>
                </Tippy>

                <!-- Third level of submenu -->
                <Transition @enter="enter" @leave="leave" v-if="subMenu.subMenu">
                  <ul
                    v-if="subMenu.subMenu && subMenu.activeDropdown"
                    :class="{
                      'side-menu__sub-open': subMenu.activeDropdown
                    }"
                  >
                    <li v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu" :key="lastSubMenuKey">
                      <Tippy
                        as="a"
                        :content="lastSubMenu.title"
                        :options="{ placement: 'right' }"
                        :disable="windowWidth > 1260"
                        :href="lastSubMenu.subMenu ? '#' : getRouteFullPath(lastSubMenu.pageName)"
                        :class="[
                          lastSubMenu.active ? 'side-menu side-menu--active' : 'side-menu',

                          // Animation
                          {
                            [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                              (lastSubMenuKey + 1) * 10
                            }`]: !lastSubMenu.active
                          }
                        ]"
                        @click="
                          (event: MouseEvent) => {
                            event.preventDefault()
                            linkTo(lastSubMenu, router)
                            setFormattedMenu([...formattedMenu])
                          }
                        "
                      >
                        <div v-if="lastSubMenu.icon" class="side-menu__icon">
                          <Lucide :icon="lastSubMenu.icon" />
                        </div>
                        <div v-else class="side-menu__bullet"></div>

                        <div class="side-menu__title">
                          {{ lastSubMenu.title }}
                        </div>
                      </Tippy>
                    </li>
                  </ul>
                </Transition>
              </li>
            </ul>
          </Transition>
        </li>
      </template>
      <!-- END: First Child -->
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import Tippy from "@/base-components/Tippy"
import Lucide from "@/base-components/Lucide"
import { useSideMenuStore } from "@/store/modules/navigation.ts"
import {
  ProvideForceActiveMenu,
  forceActiveMenu,
  Route,
  FormattedMenu,
  nestedMenu,
  linkTo,
  enter,
  leave
} from "./index.ts"
import { watch, reactive, ref, computed, onMounted, provide } from "vue"

const route: Route = useRoute()
const router = useRouter()
const formattedMenu = reactive<Array<FormattedMenu>>([])
const setFormattedMenu = (computedFormattedMenu: Array<FormattedMenu>) => {
  Object.assign(formattedMenu, computedFormattedMenu)
}
const sideMenuStore = useSideMenuStore()
const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route))
const windowWidth = ref(window.innerWidth)

provide<ProvideForceActiveMenu>("forceActiveMenu", (pageName: string) => {
  forceActiveMenu(route, pageName)
  setFormattedMenu(sideMenu.value)
})

watch(sideMenu, () => {
  setFormattedMenu(sideMenu.value)
})

watch(
  computed(() => route.path),
  () => {
    delete route.forceActiveMenu
  }
)

onMounted(() => {
  setFormattedMenu(sideMenu.value)
})

const getRouteFullPath = (pageName: string | undefined) => {
  try {
    return router.resolve({
      name: pageName
    }).fullPath
  } catch (err) {
    return ""
  }
}
</script>
