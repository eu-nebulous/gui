<template>
  <div class="flex flex-col box p-5 flex-grow space-y-5">
    <div class="flex-grow overflow-y-auto h-0">
      <div
        v-for="(resource, index) in resources"
        :key="index"
        :class="{
          'border-b': index === resources.length - 1,
          'input--invalid my-1': hasBackendError(`resources[${index}]`)
        }"
        class="flex items-center min-h-[60px] px-4 py-1 border-slate-200/60 dark:border-darkmode-400 border-t border-l border-r"
      >
        <span class="flex-grow max-w-[200px]">{{ resource.title }}</span>
        <span
          v-if="resource.platform"
          class="ml-8 mr-4 py-1 px-4 rounded-2xl uppercase"
          :class="generateColor(resource.platform)"
        >
          {{ resource.platform }}
        </span>
        <FormSwitch class="ml-auto w-auto">
          <FormSwitch.Input id="show-example-1" v-model="resource.enabled" type="checkbox" />
        </FormSwitch>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { computed, Ref, inject } from "vue"
import { useResourceStore } from "@/store/modules/resources.ts"
import { IAppResource } from "@/interfaces/resources.interface.ts"
import { FormSwitch } from "@/base-components/Form"
import Lucide from "@/base-components/Lucide/Lucide.vue"
import { generateColor } from "@/utils/colors.ts"

interface ResourcesProps {
  payload: {
    appResources: Array<IAppResource>
  }
}

const router = useRouter()
const resourceStore = useResourceStore()

const pathsWithError = inject<Ref<Array<string>>>("pathsWithError")

const props = withDefaults(defineProps<ResourcesProps>(), {
  payload: () => ({
    appResources: []
  })
})

const resources = computed<Array<IAppResource>>(() =>

  resourceStore.resources.results.map((resource) => {
    // prettier-ignore
    const isEnabled = props.payload.appResources
        .find((appResource: IAppResource) => appResource.uuid === resource.uuid)?.enabled ?? false
    return {
      uuid: resource.uuid,
      title: resource.title,
      platform: resource.platform.title,
      enabled: isEnabled
    }
  })
)

const retrieveAllResources = async () => {
  await resourceStore.getAllResources()
}

const redirectToResources = () => {
  router.push({ name: "applications-resources" })
}

retrieveAllResources()

const hasBackendError = (path: string) => {
  if (!pathsWithError?.value) return false
  return Boolean(pathsWithError.value.find((fullPath: string) => fullPath.includes(path)))
}

defineExpose({ resources })
</script>
