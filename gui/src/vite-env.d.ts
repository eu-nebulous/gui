/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue"
  // eslint-disable-next-line
  const component: DefineComponent<object, object, any>
  export default component
}

declare module "@/containers/*"

declare module "@/router"

declare module "@/store/*"

declare module "@/constants"

declare module "@/types/*"

declare module "@/interfaces/*"

declare module "@/utils/*"

declare module "@/components/*"

declare module "@/base-components/*"

declare module "@/assets/*"

declare module "@/composables/*"

declare module "@vuelidate/components" {
  import Vue from "vue"

  class ValidateEach extends Vue {}

  export { ValidateEach }
}
