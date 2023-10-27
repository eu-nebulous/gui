import { defineStore } from "pinia"
import { Icon } from "@/base-components/Lucide/Lucide.vue"

export interface Menu {
  title: string
  isDivider?: boolean
  icon?: Icon
  pageName?: string
  subMenu?: Menu[]
  ignore?: boolean
}

export interface SideMenuState {
  menu: Array<Menu>
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: "Home",
        pageName: "applications-overview",
        title: "Applications",
        subMenu: [
          {
            pageName: "applications-overview",
            title: "Overview"
          },
          {
            pageName: "applications-resources",
            title: "Resources"
          }
        ]
      },
      {
        title: "User Management",
        isDivider: true
      },
      {
        icon: "User",
        pageName: "users",
        title: "Users"
      }
    ]
  })
})
