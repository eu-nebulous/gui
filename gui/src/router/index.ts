import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw
} from "vue-router"
import ApplicationsRoute from "@/containers/Applications/applications-route.ts"
const Users = () => import(/* webpackChunkName: "Users" */ "@/containers/Users")
const AccountSettings = () => import(/* webpackChunkName: "AccountSettings" */ "@/containers/AccountSettings")
const Login = () => import(/* webpackChunkName: "Login" */ "@/containers/Login")
const TwoFactorAuth = () => import(/* webpackChunkName: "Otp" */ "@/containers/Login/TwoFactorAuth.vue")
import { useUserStore } from "@/store/modules/user.ts"

const routes: Array<RouteRecordRaw> = [
  ApplicationsRoute,
  {
    path: "/users",
    name: "users",
    component: Users
  },
  {
    path: "/account-settings",
    name: "account-settings",
    component: AccountSettings
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      hideMenu: true
    }
  },
  {
    path: "/",
    redirect: { name: "applications" }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

// Auth nav guard
router.beforeEach(async (to: RouteLocationNormalized, from, next: NavigationGuardNext) => {
  const userStore = useUserStore()

  const hasToken = Boolean(localStorage.getItem("access-token"))

  const authRoutes = ["login"] // ["login", "otp"]
  // Redirect to Applications if user try accessing login having token
  if (hasToken && authRoutes.includes(to.name as string) && userStore.user !== null) {
    return next({ name: "applications" })
  } else if (!hasToken && to.name !== "login") {
    // If no token provided then redirect to login
    return next({ name: "login" })
  } else if (to.name !== "login") {
    if (userStore.user === null) {
      userStore.retrieveUserInfo().catch(() => {
        return next({ name: "login" })
      })
    }
  }
  next()
})

export default router
