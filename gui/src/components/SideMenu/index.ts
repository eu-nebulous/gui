import { Router, RouteLocationNormalizedLoaded } from "vue-router"
import { Menu } from "@/store/modules/navigation.ts"
import { slideUp, slideDown } from "@/utils/helper.ts"
import SideMenu from "./SideMenu.vue"

export interface Route extends RouteLocationNormalizedLoaded {
  forceActiveMenu?: string
}

export interface FormattedMenu extends Menu {
  active?: boolean
  activeDropdown?: boolean
  subMenu?: FormattedMenu[]
}

export type ProvideForceActiveMenu = (pageName: string) => void

const forceActiveMenu = (route: Route, pageName: string) => {
  route.forceActiveMenu = pageName
}

// Setup side menu
const findActiveMenu = (subMenu: Menu[], route: Route): boolean => {
  let match = false
  subMenu.forEach((item) => {
    if (
      ((route.forceActiveMenu !== undefined && item.pageName === route.forceActiveMenu) ||
        (route.forceActiveMenu === undefined && item.pageName === route.name)) &&
      !item.ignore
    ) {
      match = true
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, route)
    }
  })
  return match
}

const nestedMenu = (menu: Array<Menu>, route: Route) => {
  const formattedMenu: Array<FormattedMenu> = []
  menu.forEach((item) => {
    if (!item.isDivider) {
      const menuItem: FormattedMenu = {
        icon: item.icon,
        title: item.title,
        pageName: item.pageName,
        subMenu: item.subMenu,
        ignore: item.ignore
      }
      menuItem.active =
        ((route.forceActiveMenu !== undefined && menuItem.pageName === route.forceActiveMenu) ||
          (route.forceActiveMenu === undefined && menuItem.pageName === route.name) ||
          (menuItem.subMenu && findActiveMenu(menuItem.subMenu, route))) &&
        !menuItem.ignore

      if (menuItem.subMenu) {
        menuItem.activeDropdown = findActiveMenu(menuItem.subMenu, route)

        // Nested menu
        const subMenu: Array<FormattedMenu> = []
        nestedMenu(menuItem.subMenu, route).map((menu) => !menu.isDivider && subMenu.push(menu))
        menuItem.subMenu = subMenu
      }

      formattedMenu.push(menuItem)
    } else {
      formattedMenu.push(item)
    }
  })

  return formattedMenu
}

const linkTo = (menu: FormattedMenu, router: Router) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown
  } else {
    if (menu.pageName !== undefined) {
      router.push({
        name: menu.pageName
      })
    }
  }
}

const enter = (el: Element) => {
  slideDown(el as HTMLElement, 300)
}

const leave = (el: Element) => {
  slideUp(el as HTMLElement, 300)
}

export { nestedMenu, linkTo, enter, leave, forceActiveMenu }
export default SideMenu
