import { RouteRecordRaw } from "vue-router"
const Applications = () => import(/* webpackChunkName: "Applications" */ "@/containers/Applications")
const ApplicationsOverview = () =>
  import(/* webpackChunkName: "ApplicationsOverview" */ "@/containers/Applications/Overview")
const ApplicationsResources = () =>
  import(/* webpackChunkName: "ApplicationsResources" */ "@/containers/Applications/Resources")
const ApplicationsPolicyEditor = () =>
  import(/* webpackChunkName: "ApplicationsResources" */ "@/containers/Applications/PolicyEditor")
const ApplicationCreation = () =>
  import(/* webpackChunkName: "ApplicationCreation" */ "@/containers/Applications/ApplicationCreation")

const ApplicationEditing = () =>
  import(/* webpackChunkName: "ApplicationEditing" */ "@/containers/Applications/ApplicationEditing")

const ApplicationsRoute: RouteRecordRaw = {
  path: "/applications",
  name: "applications",
  component: Applications,
  redirect: { name: "applications-overview" },
  children: [
    {
      path: "",
      name: "applications-overview",
      component: ApplicationsOverview
    },
    {
      path: ":appUuid",
      name: "application",
      props: true,
      component: ApplicationEditing
    },
    {
      path: "resources",
      name: "applications-resources",
      component: ApplicationsResources
    },
    {
      path: "policy-editor",
      name: "policy-editor",
      component: ApplicationsPolicyEditor
    },

    {
      path: "creation",
      name: "application-creation",
      component: ApplicationCreation
    }
  ]
}
export default ApplicationsRoute
